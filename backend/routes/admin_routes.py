from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
from models.admin_models import (
    Product, ProductCreate, ProductUpdate, ProductStatus,
    Contact, ContactCreate, PersonalizedLink, LinkTracking,
    LinkAnalytics, MessageTemplate, OrderEnhanced, OrderUpdate,
    VisitorSession, VisitorEvent, CartAbandonmentSession,
    DashboardAnalytics, CustomerAnalytics, DeliveryStatus,
    PaymentStatus, CustomerType, VisitorType
)
import os
from motor.motor_asyncio import AsyncIOMotorClient

router = APIRouter(prefix="/admin", tags=["admin"])

# Get database instance (assuming it's already configured in main server.py)
from server import db

# Authentication middleware (simple admin check)
async def verify_admin(admin_key: str = Query(...)):
    # Simple admin authentication - in production use proper JWT
    expected_admin_key = os.environ.get('ADMIN_KEY', 'aparna_admin_2025')
    if admin_key != expected_admin_key:
        raise HTTPException(status_code=403, detail="Admin access required")
    return True

# PRODUCT MANAGEMENT ENDPOINTS

@router.post("/products", response_model=Product)
async def create_product(product: ProductCreate, admin_key: str = Depends(verify_admin)):
    """Create a new product"""
    product_dict = product.dict()
    product_dict["id"] = str(uuid.uuid4())
    product_dict["created_at"] = datetime.utcnow()
    product_dict["updated_at"] = datetime.utcnow()
    
    result = await db.products.insert_one(product_dict)
    if result.inserted_id:
        return Product(**product_dict)
    raise HTTPException(status_code=400, detail="Failed to create product")

@router.get("/products", response_model=List[Product])
async def get_all_products(admin_key: str = Depends(verify_admin)):
    """Get all products for admin"""
    products = await db.products.find().to_list(1000)
    return [Product(**product) for product in products]

@router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str, admin_key: str = Depends(verify_admin)):
    """Get single product"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, updates: ProductUpdate, admin_key: str = Depends(verify_admin)):
    """Update product"""
    update_dict = {k: v for k, v in updates.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product = await db.products.find_one({"id": product_id})
    return Product(**product)

@router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin_key: str = Depends(verify_admin)):
    """Delete product"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), admin_key: str = Depends(verify_admin)):
    """Upload product image"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Create uploads directory if it doesn't exist
    upload_dir = "/app/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Return URL (adjust based on your static file serving)
    image_url = f"/uploads/{filename}"
    return {"image_url": image_url}

# CONTACT MANAGEMENT ENDPOINTS

@router.post("/contacts", response_model=Contact)
async def create_contact(contact: ContactCreate, admin_key: str = Depends(verify_admin)):
    """Add new contact"""
    contact_dict = contact.dict()
    contact_dict["id"] = str(uuid.uuid4())
    contact_dict["created_at"] = datetime.utcnow()
    
    result = await db.contacts.insert_one(contact_dict)
    if result.inserted_id:
        return Contact(**contact_dict)
    raise HTTPException(status_code=400, detail="Failed to create contact")

@router.get("/contacts", response_model=List[Contact])
async def get_contacts(admin_key: str = Depends(verify_admin)):
    """Get all contacts"""
    contacts = await db.contacts.find().to_list(1000)
    return [Contact(**contact) for contact in contacts]

@router.post("/contacts/bulk-import")
async def bulk_import_contacts(contacts: List[ContactCreate], admin_key: str = Depends(verify_admin)):
    """Bulk import contacts"""
    contact_dicts = []
    for contact in contacts:
        contact_dict = contact.dict()
        contact_dict["id"] = str(uuid.uuid4())
        contact_dict["created_at"] = datetime.utcnow()
        contact_dicts.append(contact_dict)
    
    result = await db.contacts.insert_many(contact_dicts)
    return {"message": f"Imported {len(result.inserted_ids)} contacts successfully"}

# PERSONALIZED LINK ENDPOINTS

@router.post("/personalized-links")
async def create_personalized_link(
    contact_id: str,
    message: str,
    expires_in_days: Optional[int] = 30,
    admin_key: str = Depends(verify_admin)
):
    """Create personalized link for a contact"""
    # Check if contact exists
    contact = await db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Create personalized link
    link_data = {
        "id": str(uuid.uuid4()),
        "contact_id": contact_id,
        "link_token": str(uuid.uuid4().hex),
        "message": message,
        "created_at": datetime.utcnow(),
        "expires_at": datetime.utcnow() + timedelta(days=expires_in_days) if expires_in_days else None,
        "is_active": True
    }
    
    result = await db.personalized_links.insert_one(link_data)
    if result.inserted_id:
        # Generate the personalized URL
        domain = os.environ.get('APP_DOMAIN', 'localhost:3000')
        protocol = 'https' if 'localhost' not in domain else 'http'
        personalized_url = f"{protocol}://{domain}/?ref={link_data['link_token']}"
        
        return {
            "link_id": link_data["id"],
            "personalized_url": personalized_url,
            "message": message,
            "contact_name": contact["name"],
            "expires_at": link_data["expires_at"]
        }
    
    raise HTTPException(status_code=400, detail="Failed to create personalized link")

@router.post("/send-personalized-message")
async def send_personalized_message(
    contact_id: str,
    message_template: str,
    admin_key: str = Depends(verify_admin)
):
    """Send personalized message with link to contact"""
    # Get contact
    contact = await db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Create personalized link
    link_response = await create_personalized_link(contact_id, message_template)
    
    # Format message with personalized link
    personalized_message = message_template.replace("{name}", contact["name"])
    personalized_message = personalized_message.replace("{link}", link_response["personalized_url"])
    
    # Here you would integrate with SMS/WhatsApp API
    # For now, we'll return the formatted message
    
    # Update last contacted
    await db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"last_contacted": datetime.utcnow()}}
    )
    
    return {
        "contact_name": contact["name"],
        "contact_phone": contact["phone"],
        "message": personalized_message,
        "link_id": link_response["link_id"],
        "status": "ready_to_send"
    }

# TRACKING ENDPOINTS

@router.post("/track-event")
async def track_event(
    link_token: str,
    event_type: str,
    page_url: Optional[str] = None,
    product_id: Optional[str] = None,
    user_agent: Optional[str] = None,
    ip_address: Optional[str] = None
):
    """Track user events (no admin auth required for tracking)"""
    # Find the personalized link
    link = await db.personalized_links.find_one({"link_token": link_token, "is_active": True})
    if not link:
        raise HTTPException(status_code=404, detail="Invalid or expired link")
    
    # Create tracking event
    tracking_data = {
        "id": str(uuid.uuid4()),
        "link_id": link["id"],
        "contact_id": link["contact_id"],
        "event_type": event_type,
        "page_url": page_url,
        "product_id": product_id,
        "timestamp": datetime.utcnow(),
        "user_agent": user_agent,
        "ip_address": ip_address
    }
    
    await db.link_tracking.insert_one(tracking_data)
    return {"status": "tracked"}

@router.get("/analytics/links", response_model=List[LinkAnalytics])
async def get_link_analytics(admin_key: str = Depends(verify_admin)):
    """Get analytics for all personalized links"""
    # Aggregate analytics data
    pipeline = [
        {
            "$lookup": {
                "from": "contacts",
                "localField": "contact_id",
                "foreignField": "id",
                "as": "contact"
            }
        },
        {
            "$unwind": "$contact"
        },
        {
            "$lookup": {
                "from": "link_tracking",
                "localField": "id",
                "foreignField": "link_id",
                "as": "tracking_events"
            }
        }
    ]
    
    links_with_analytics = await db.personalized_links.aggregate(pipeline).to_list(1000)
    
    analytics_results = []
    for link_data in links_with_analytics:
        events = link_data.get("tracking_events", [])
        
        # Calculate analytics
        opens = [e for e in events if e["event_type"] == "link_opened"]
        page_views = [e for e in events if e["event_type"] == "page_viewed"]
        cart_adds = [e for e in events if e["event_type"] == "item_added"]
        checkouts = [e for e in events if e["event_type"] == "checkout_started"]
        orders = [e for e in events if e["event_type"] == "order_placed"]
        
        analytics = LinkAnalytics(
            link_id=link_data["id"],
            contact_name=link_data["contact"]["name"],
            contact_phone=link_data["contact"]["phone"],
            total_opens=len(opens),
            unique_opens=1 if opens else 0,  # Simplified - could be more sophisticated
            last_opened=max([e["timestamp"] for e in opens]) if opens else None,
            pages_viewed=list(set([e["page_url"] for e in page_views if e["page_url"]])),
            products_viewed=list(set([e["product_id"] for e in events if e["product_id"]])),
            items_added_to_cart=len(cart_adds),
            checkout_started=len(checkouts) > 0,
            order_placed=len(orders) > 0,
            total_order_value=None,  # Would need order data integration
            created_at=link_data["created_at"],
            link_status="active" if link_data["is_active"] else "inactive"
        )
        analytics_results.append(analytics)
    
    return analytics_results

@router.get("/analytics/summary")
async def get_analytics_summary(admin_key: str = Depends(verify_admin)):
    """Get overall analytics summary"""
    total_links = await db.personalized_links.count_documents({})
    total_contacts = await db.contacts.count_documents({})
    total_events = await db.link_tracking.count_documents({})
    
    # Recent activity (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_links = await db.personalized_links.count_documents({
        "created_at": {"$gte": thirty_days_ago}
    })
    recent_events = await db.link_tracking.count_documents({
        "timestamp": {"$gte": thirty_days_ago}
    })
    
    return {
        "total_personalized_links": total_links,
        "total_contacts": total_contacts,
        "total_tracking_events": total_events,
        "recent_links_30_days": recent_links,
        "recent_events_30_days": recent_events,
        "last_updated": datetime.utcnow()
    }

# MESSAGE TEMPLATES

@router.post("/message-templates", response_model=MessageTemplate)
async def create_message_template(template: MessageTemplate, admin_key: str = Depends(verify_admin)):
    """Create message template"""
    template_dict = template.dict()
    template_dict["id"] = str(uuid.uuid4())
    template_dict["created_at"] = datetime.utcnow()
    
    result = await db.message_templates.insert_one(template_dict)
    if result.inserted_id:
        return MessageTemplate(**template_dict)
    raise HTTPException(status_code=400, detail="Failed to create template")

@router.get("/message-templates", response_model=List[MessageTemplate])
async def get_message_templates(admin_key: str = Depends(verify_admin)):
    """Get all message templates"""
    templates = await db.message_templates.find().to_list(100)
    return [MessageTemplate(**template) for template in templates]