from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from datetime import datetime, timedelta
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models.review_models import (
    ReviewRequest, CustomerReview, ReviewRequestCreate, 
    ReviewRequestBatch, ReviewStats, ReviewRequestSummary
)
import urllib.parse

router = APIRouter(prefix="/api", tags=["reviews"])

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'diwali_delights')

if not MONGO_URL:
    raise ValueError("MONGO_URL environment variable is required")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

def get_admin_key():
    return os.environ.get('ADMIN_KEY')

async def verify_admin_key(admin_key: str = Query(...)):
    expected_key = get_admin_key()
    if not expected_key or admin_key != expected_key:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    return admin_key

@router.get("/admin/reviews/summary", response_model=ReviewRequestSummary)
async def get_review_summary(admin_key: str = Depends(verify_admin_key)):
    """Get summary of orders and review request status"""
    try:
        # Get all orders from the last 30 days
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        # Get recent orders
        orders_cursor = db.orders.find({
            "created_at": {"$gte": thirty_days_ago},
            "status": {"$in": ["confirmed", "delivered"]}
        })
        orders = await orders_cursor.to_list(length=None)
        
        # Get existing review requests
        review_requests_cursor = db.review_requests.find({})
        review_requests = await review_requests_cursor.to_list(length=None)
        
        # Get submitted reviews
        reviews_cursor = db.customer_reviews.find({})
        reviews = await reviews_cursor.to_list(length=None)
        
        # Create sets for tracking
        orders_with_requests = set()
        for req in review_requests:
            orders_with_requests.add(req.get('order_id'))
        
        # Calculate eligible orders (delivered orders without review requests)
        eligible_orders = []
        for order in orders:
            if order['id'] not in orders_with_requests and order['status'] == 'delivered':
                eligible_orders.append({
                    'order_id': order['id'],
                    'customer_name': order['customer_name'],
                    'customer_phone': order['customer_phone'],
                    'order_date': order['created_at'],
                    'total_amount': order['total_amount'],
                    'items': order['items']
                })
        
        return ReviewRequestSummary(
            total_orders=len(orders),
            orders_with_requests_sent=len(orders_with_requests),
            orders_pending_requests=len(eligible_orders),
            total_reviews_received=len(reviews),
            orders_eligible_for_requests=eligible_orders[:10]  # Limit to 10 for display
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching review summary: {str(e)}")

@router.post("/admin/reviews/send-requests", response_model=dict)
async def send_review_requests(
    request_data: ReviewRequestBatch,
    admin_key: str = Depends(verify_admin_key)
):
    """Send review requests for multiple orders"""
    try:
        success_count = 0
        failed_orders = []
        
        for order_id in request_data.order_ids:
            try:
                # Get order details
                order = await db.orders.find_one({"id": order_id})
                if not order:
                    failed_orders.append({"order_id": order_id, "reason": "Order not found"})
                    continue
                
                # Check if review request already exists
                existing_request = await db.review_requests.find_one({"order_id": order_id})
                if existing_request:
                    failed_orders.append({"order_id": order_id, "reason": "Review request already sent"})
                    continue
                
                # Extract product names
                product_names = [item['product_name'] for item in order['items']]
                
                # Create review request
                review_request = ReviewRequest(
                    customer_phone=order['customer_phone'],
                    customer_name=order['customer_name'],
                    order_id=order_id,
                    order_date=order['created_at'],
                    products_ordered=product_names,
                    request_sent_date=datetime.now(),
                    request_method=request_data.request_method,
                    status="sent"
                )
                
                # Save to database
                await db.review_requests.insert_one(review_request.dict())
                success_count += 1
                
            except Exception as e:
                failed_orders.append({"order_id": order_id, "reason": str(e)})
        
        return {
            "success": True,
            "requests_sent": success_count,
            "failed_orders": failed_orders,
            "message": f"Successfully sent {success_count} review requests via {request_data.request_method}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending review requests: {str(e)}")

@router.get("/admin/reviews/requests", response_model=List[ReviewRequest])
async def get_review_requests(
    status: Optional[str] = Query(None),
    limit: int = Query(50, le=100),
    admin_key: str = Depends(verify_admin_key)
):
    """Get all review requests with optional status filter"""
    try:
        filter_query = {}
        if status:
            filter_query["status"] = status
        
        cursor = db.review_requests.find(filter_query).sort("request_sent_date", -1).limit(limit)
        requests = await cursor.to_list(length=None)
        
        return [ReviewRequest(**req) for req in requests]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching review requests: {str(e)}")

@router.get("/admin/reviews/stats", response_model=ReviewStats)
async def get_review_stats(admin_key: str = Depends(verify_admin_key)):
    """Get review statistics and analytics"""
    try:
        # Get review requests
        requests_cursor = db.review_requests.find({})
        requests = await requests_cursor.to_list(length=None)
        
        # Get submitted reviews
        reviews_cursor = db.customer_reviews.find({}).sort("review_date", -1).limit(10)
        reviews = await reviews_cursor.to_list(length=None)
        
        # Calculate stats
        total_requests = len(requests)
        completed_reviews = len([r for r in requests if r.get('review_submitted')])
        pending_reviews = total_requests - completed_reviews
        
        response_rate = (completed_reviews / total_requests * 100) if total_requests > 0 else 0
        
        # Calculate average rating from actual reviews
        if reviews:
            avg_rating = sum(r.get('overall_rating', 0) for r in reviews) / len(reviews)
        else:
            avg_rating = 0.0
        
        return ReviewStats(
            total_requests_sent=total_requests,
            pending_reviews=pending_reviews,
            completed_reviews=completed_reviews,
            review_response_rate=round(response_rate, 2),
            average_overall_rating=round(avg_rating, 1),
            recent_reviews=[CustomerReview(**review) for review in reviews]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching review stats: {str(e)}")

@router.get("/admin/reviews/generate-links/{order_id}")
async def generate_review_links(
    order_id: str,
    admin_key: str = Depends(verify_admin_key)
):
    """Generate WhatsApp, SMS, and email links for manual review requests"""
    try:
        # Get order details
        order = await db.orders.find_one({"id": order_id})
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        customer_name = order['customer_name']
        products = [item['product_name'] for item in order['items']]
        products_text = ", ".join(products)
        
        # Base message template
        message = f"""🌟 Dear {customer_name},

Thank you for your recent order from Aparna's Diwali Delights!

We hope you enjoyed: {products_text}

We would love to hear your feedback! Your review helps us serve you better and helps other customers make informed choices.

Please rate your experience:
⭐ Taste & Quality
⭐ Packaging  
⭐ Delivery Experience
⭐ Overall Satisfaction

Share your thoughts with us!

Best regards,
Aparna's Diwali Delights
📞 +91 9920632654"""
        
        # Generate links
        whatsapp_message = urllib.parse.quote(message)
        sms_message = urllib.parse.quote(message.replace("🌟", "").replace("⭐", "*"))
        email_subject = urllib.parse.quote("Review Request - Aparna's Diwali Delights")
        email_body = urllib.parse.quote(message.replace("🌟", "").replace("⭐", "*"))
        
        return {
            "order_id": order_id,
            "customer_name": customer_name,
            "customer_phone": order['customer_phone'],
            "links": {
                "whatsapp": f"https://wa.me/{order['customer_phone'].replace('+', '')}?text={whatsapp_message}",
                "sms": f"sms:{order['customer_phone']}?body={sms_message}",
                "email": f"mailto:{order.get('customer_email', '')}?subject={email_subject}&body={email_body}"
            },
            "message_preview": message
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating review links: {str(e)}")

@router.put("/admin/reviews/requests/{request_id}/status")
async def update_review_request_status(
    request_id: str,
    status: str = Query(...),
    admin_key: str = Depends(verify_admin_key)
):
    """Update the status of a review request"""
    try:
        valid_statuses = ["pending", "sent", "reviewed", "expired"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")
        
        result = await db.review_requests.update_one(
            {"id": request_id},
            {
                "$set": {
                    "status": status,
                    "review_submitted": status == "reviewed",
                    "review_submitted_date": datetime.now() if status == "reviewed" else None
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Review request not found")
        
        return {"success": True, "message": f"Review request status updated to {status}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating review request: {str(e)}")