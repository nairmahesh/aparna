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

# ENHANCED ORDER MANAGEMENT ENDPOINTS

@router.get("/orders", response_model=List[OrderEnhanced])
async def get_all_orders(
    status: Optional[str] = None,
    delivery_status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    limit: Optional[int] = 100,
    admin_key: str = Depends(verify_admin)
):
    """Get all orders with advanced filtering"""
    query = {}
    
    if status:
        query["status"] = status
    if delivery_status:
        query["delivery_status"] = delivery_status
    if date_from and date_to:
        query["created_at"] = {
            "$gte": datetime.fromisoformat(date_from),
            "$lte": datetime.fromisoformat(date_to)
        }
    
    orders = await db.orders.find(query).limit(limit).sort("created_at", -1).to_list(limit)
    return [OrderEnhanced(**order) for order in orders]

@router.get("/orders/{order_id}", response_model=OrderEnhanced)
async def get_order(order_id: str, admin_key: str = Depends(verify_admin)):
    """Get single order details"""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderEnhanced(**order)

@router.put("/orders/{order_id}", response_model=OrderEnhanced)
async def update_order(
    order_id: str, 
    updates: OrderUpdate, 
    admin_key: str = Depends(verify_admin)
):
    """Update order status, delivery details, etc."""
    update_dict = {k: v for k, v in updates.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    # Auto-set delivery date when dispatched
    if updates.delivery_status == DeliveryStatus.DISPATCHED and not updates.dispatched_date:
        update_dict["dispatched_date"] = datetime.utcnow()
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order = await db.orders.find_one({"id": order_id})
    return OrderEnhanced(**order)

@router.get("/orders/customer/{phone}")
async def get_customer_orders(phone: str, admin_key: str = Depends(verify_admin)):
    """Get all orders for a specific customer by phone number"""
    orders = await db.orders.find({"customer_phone": phone}).sort("created_at", -1).to_list(100)
    return [OrderEnhanced(**order) for order in orders]

# VISITOR ANALYTICS ENDPOINTS

@router.get("/analytics/visitors")
async def get_visitor_analytics(
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    admin_key: str = Depends(verify_admin)
):
    """Get comprehensive visitor analytics"""
    # Set default date range (last 30 days)
    if not date_from or not date_to:
        date_to_dt = datetime.utcnow()
        date_from_dt = date_to_dt - timedelta(days=30)
    else:
        date_from_dt = datetime.fromisoformat(date_from)
        date_to_dt = datetime.fromisoformat(date_to)
    
    # Get visitor sessions in date range
    sessions = await db.visitor_sessions.find({
        "first_visit": {"$gte": date_from_dt, "$lte": date_to_dt}
    }).to_list(1000)
    
    # Calculate metrics
    total_sessions = len(sessions)
    unique_visitors = len(set(s.get("session_id") for s in sessions))
    returning_visitors = len([s for s in sessions if s.get("visitor_type") == "customer"])
    new_visitors = total_sessions - returning_visitors
    
    # Engagement metrics
    total_time = sum(s.get("total_time_spent", 0) for s in sessions)
    avg_session_duration = total_time / total_sessions if total_sessions > 0 else 0
    
    total_page_views = sum(s.get("total_page_views", 0) for s in sessions)
    pages_per_session = total_page_views / total_sessions if total_sessions > 0 else 0
    
    # E-commerce metrics
    orders = await db.orders.find({
        "created_at": {"$gte": date_from_dt, "$lte": date_to_dt}
    }).to_list(1000)
    
    total_orders = len(orders)
    total_revenue = sum(order.get("final_amount", 0) for order in orders)
    avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
    conversion_rate = (total_orders / total_sessions * 100) if total_sessions > 0 else 0
    
    # Cart abandonment
    abandoned_carts = await db.cart_abandonments.count_documents({
        "abandoned_at": {"$gte": date_from_dt, "$lte": date_to_dt}
    })
    
    return DashboardAnalytics(
        date_range=f"{date_from_dt.strftime('%Y-%m-%d')} to {date_to_dt.strftime('%Y-%m-%d')}",
        total_visitors=total_sessions,
        unique_visitors=unique_visitors,
        returning_visitors=returning_visitors,
        new_visitors=new_visitors,
        avg_session_duration=avg_session_duration,
        pages_per_session=pages_per_session,
        total_orders=total_orders,
        total_revenue=total_revenue,
        avg_order_value=avg_order_value,
        conversion_rate=conversion_rate,
        abandoned_carts=abandoned_carts
    )

@router.get("/analytics/customers")
async def get_customer_analytics(admin_key: str = Depends(verify_admin)):
    """Get detailed customer analytics"""
    # Aggregate customer data
    pipeline = [
        {
            "$group": {
                "_id": "$customer_phone",
                "customer_name": {"$first": "$customer_name"},
                "customer_phone": {"$first": "$customer_phone"},
                "total_orders": {"$sum": 1},
                "total_spent": {"$sum": "$final_amount"},
                "first_order_date": {"$min": "$created_at"},
                "last_order_date": {"$max": "$created_at"},
                "orders": {"$push": "$$ROOT"}
            }
        }
    ]
    
    customer_data = await db.orders.aggregate(pipeline).to_list(1000)
    
    analytics = []
    for customer in customer_data:
        avg_order_value = customer["total_spent"] / customer["total_orders"]
        
        # Calculate days between first and last order
        if customer["total_orders"] > 1:
            days_diff = (customer["last_order_date"] - customer["first_order_date"]).days
            avg_time_between_orders = days_diff / (customer["total_orders"] - 1)
        else:
            avg_time_between_orders = None
        
        # Determine customer type
        customer_type = CustomerType.RETURNING if customer["total_orders"] > 1 else CustomerType.NEW
        
        analytics.append(CustomerAnalytics(
            customer_id=customer["_id"],
            customer_name=customer["customer_name"],
            customer_phone=customer["customer_phone"],
            customer_type=customer_type,
            total_orders=customer["total_orders"],
            total_spent=customer["total_spent"],
            avg_order_value=avg_order_value,
            first_order_date=customer["first_order_date"],
            last_order_date=customer["last_order_date"],
            avg_time_between_orders=avg_time_between_orders
        ))
    
    return sorted(analytics, key=lambda x: x.total_spent, reverse=True)

@router.get("/analytics/cart-abandonment")
async def get_cart_abandonment_analytics(admin_key: str = Depends(verify_admin)):
    """Get cart abandonment analytics and recovery opportunities"""
    # Get recent cart abandonments (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    abandoned_carts = await db.cart_abandonments.find({
        "abandoned_at": {"$gte": seven_days_ago},
        "recovered": False
    }).sort("abandoned_at", -1).to_list(100)
    
    return [CartAbandonmentSession(**cart) for cart in abandoned_carts]

@router.get("/analytics/revenue-report")
async def get_revenue_report(
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    admin_key: str = Depends(verify_admin)
):
    """Get detailed revenue report with delivery costs breakdown"""
    # Set default date range (last 30 days)
    if not date_from or not date_to:
        date_to_dt = datetime.utcnow()
        date_from_dt = date_to_dt - timedelta(days=30)
    else:
        date_from_dt = datetime.fromisoformat(date_from)
        date_to_dt = datetime.fromisoformat(date_to)
    
    # Revenue aggregation pipeline
    pipeline = [
        {
            "$match": {
                "created_at": {"$gte": date_from_dt, "$lte": date_to_dt},
                "status": {"$ne": "cancelled"}
            }
        },
        {
            "$group": {
                "_id": {
                    "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
                    "status": "$delivery_status"
                },
                "total_orders": {"$sum": 1},
                "total_revenue": {"$sum": "$total_amount"},
                "total_delivery_cost": {"$sum": "$delivery_cost"},
                "final_amount": {"$sum": "$final_amount"}
            }
        },
        {"$sort": {"_id.date": -1}}
    ]
    
    revenue_data = await db.orders.aggregate(pipeline).to_list(1000)
    
    return {
        "date_range": f"{date_from_dt.strftime('%Y-%m-%d')} to {date_to_dt.strftime('%Y-%m-%d')}",
        "daily_breakdown": revenue_data,
        "summary": {
            "total_orders": sum(item["total_orders"] for item in revenue_data),
            "total_revenue": sum(item["total_revenue"] for item in revenue_data),
            "total_delivery_revenue": sum(item["total_delivery_cost"] for item in revenue_data),
            "grand_total": sum(item["final_amount"] for item in revenue_data)
        }
    }

# VISITOR TRACKING ENDPOINTS (for frontend integration)

@router.post("/track/visitor-session")
async def track_visitor_session(
    session_id: str,
    visitor_type: Optional[str] = "anonymous",
    referral_link_token: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
):
    """Track visitor session (no admin auth required)"""
    session_data = {
        "session_id": session_id,
        "visitor_type": visitor_type,
        "referral_link_token": referral_link_token,
        "ip_address": ip_address,
        "user_agent": user_agent,
        "first_visit": datetime.utcnow(),
        "last_activity": datetime.utcnow()
    }
    
    # Check if session already exists
    existing_session = await db.visitor_sessions.find_one({"session_id": session_id})
    
    if existing_session:
        await db.visitor_sessions.update_one(
            {"session_id": session_id},
            {"$set": {"last_activity": datetime.utcnow()}}
        )
    else:
        await db.visitor_sessions.insert_one(session_data)
    
    return {"status": "tracked"}

@router.post("/track/visitor-event")
async def track_visitor_event(
    session_id: str,
    event_type: str,
    page_url: Optional[str] = None,
    product_id: Optional[str] = None,
    product_name: Optional[str] = None,
    cart_value: Optional[float] = None,
    order_id: Optional[str] = None
):
    """Track visitor events (no admin auth required)"""
    event_data = {
        "id": str(uuid.uuid4()),
        "session_id": session_id,
        "event_type": event_type,
        "page_url": page_url,
        "product_id": product_id,
        "product_name": product_name,
        "cart_value": cart_value,
        "order_id": order_id,
        "timestamp": datetime.utcnow()
    }
    
    await db.visitor_events.insert_one(event_data)
    
    # Update visitor session based on event type
    if event_type == "page_view":
        await db.visitor_sessions.update_one(
            {"session_id": session_id},
            {
                "$inc": {"total_page_views": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    elif event_type == "cart_add":
        await db.visitor_sessions.update_one(
            {"session_id": session_id},
            {
                "$inc": {"items_added_to_cart": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    elif event_type == "checkout_start":
        await db.visitor_sessions.update_one(
            {"session_id": session_id},
            {
                "$inc": {"checkout_attempts": 1},
                "$set": {"last_activity": datetime.utcnow()}
            }
        )
    elif event_type == "order_complete":
        await db.visitor_sessions.update_one(
            {"session_id": session_id},
            {
                "$inc": {"orders_placed": 1, "total_order_value": cart_value or 0},
                "$set": {
                    "last_activity": datetime.utcnow(),
                    "converted_to_customer": True
                }
            }
        )
    
    return {"status": "tracked"}