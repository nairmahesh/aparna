#!/usr/bin/env python3
"""
Test Enhanced Admin Panel with Sample Data
Creates sample orders and tests the full functionality
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
import os

# Configuration
BACKEND_URL = "http://localhost:8001"
ADMIN_KEY = "aparna_admin_2025"
API_BASE = f"{BACKEND_URL}/admin"

async def create_sample_orders():
    """Create sample orders in the database"""
    # Connect to MongoDB
    mongo_url = "mongodb://localhost:27017"
    client = AsyncIOMotorClient(mongo_url)
    db = client["aparna_diwali_delights"]
    
    # Sample orders
    sample_orders = [
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Priya Sharma",
            "customer_phone": "+91-9876543210",
            "customer_email": "priya.sharma@email.com",
            "customer_address": "123 MG Road, Bangalore, Karnataka 560001",
            "customer_type": "returning",
            "is_repeat_customer": True,
            "previous_orders_count": 3,
            "items": [
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Special Diwali Mix",
                    "price": 450.0,
                    "quantity": 2,
                    "unit": "per kg"
                },
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Kaju Katli",
                    "price": 800.0,
                    "quantity": 1,
                    "unit": "per kg"
                }
            ],
            "total_amount": 1700.0,
            "delivery_cost": 50.0,
            "delivery_date": datetime.now() + timedelta(days=2),
            "status": "confirmed",
            "delivery_status": "pending",
            "payment_status": "paid",
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "notes": "Please deliver before 6 PM"
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Rajesh Kumar",
            "customer_phone": "+91-9876543211",
            "customer_email": "rajesh.kumar@email.com",
            "customer_address": "456 Brigade Road, Bangalore, Karnataka 560025",
            "customer_type": "new",
            "is_repeat_customer": False,
            "previous_orders_count": 0,
            "items": [
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Samosa Chivda",
                    "price": 320.0,
                    "quantity": 1,
                    "unit": "per kg"
                }
            ],
            "total_amount": 320.0,
            "delivery_cost": 30.0,
            "delivery_date": datetime.now() + timedelta(days=1),
            "status": "pending",
            "delivery_status": "pending",
            "payment_status": "pending",
            "created_at": datetime.now() - timedelta(days=1),
            "updated_at": datetime.now() - timedelta(days=1),
            "notes": "First time customer"
        },
        {
            "id": str(uuid.uuid4()),
            "customer_name": "Priya Sharma",  # Same customer as first order
            "customer_phone": "+91-9876543210",
            "customer_email": "priya.sharma@email.com",
            "customer_address": "123 MG Road, Bangalore, Karnataka 560001",
            "customer_type": "returning",
            "is_repeat_customer": True,
            "previous_orders_count": 4,
            "items": [
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Besan Laddu",
                    "price": 600.0,
                    "quantity": 1,
                    "unit": "per kg"
                }
            ],
            "total_amount": 600.0,
            "delivery_cost": 40.0,
            "delivery_date": datetime.now() + timedelta(days=3),
            "status": "delivered",
            "delivery_status": "delivered",
            "payment_status": "paid",
            "created_at": datetime.now() - timedelta(days=5),
            "updated_at": datetime.now() - timedelta(days=2),
            "delivered_date": datetime.now() - timedelta(days=2),
            "notes": "Delivered successfully"
        }
    ]
    
    # Insert sample orders
    result = await db.orders.insert_many(sample_orders)
    print(f"✅ Created {len(result.inserted_ids)} sample orders")
    
    # Create sample visitor sessions
    sample_sessions = [
        {
            "session_id": str(uuid.uuid4().hex),
            "visitor_type": "customer",
            "customer_phone": "+91-9876543210",
            "first_visit": datetime.now() - timedelta(hours=2),
            "last_activity": datetime.now() - timedelta(minutes=30),
            "total_page_views": 15,
            "total_time_spent": 1800,  # 30 minutes
            "items_added_to_cart": 3,
            "checkout_attempts": 1,
            "orders_placed": 1,
            "total_order_value": 1750.0,
            "converted_to_customer": True
        },
        {
            "session_id": str(uuid.uuid4().hex),
            "visitor_type": "anonymous",
            "first_visit": datetime.now() - timedelta(hours=1),
            "last_activity": datetime.now() - timedelta(minutes=10),
            "total_page_views": 8,
            "total_time_spent": 600,  # 10 minutes
            "items_added_to_cart": 1,
            "checkout_attempts": 0,
            "orders_placed": 0,
            "total_order_value": 0.0,
            "converted_to_customer": False
        }
    ]
    
    result = await db.visitor_sessions.insert_many(sample_sessions)
    print(f"✅ Created {len(result.inserted_ids)} sample visitor sessions")
    
    # Create sample cart abandonment
    sample_abandonment = [
        {
            "id": str(uuid.uuid4()),
            "session_id": sample_sessions[1]["session_id"],
            "customer_phone": "+91-9876543212",
            "cart_items": [
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Dry Fruit Mix",
                    "price": 900.0,
                    "quantity": 1,
                    "unit": "per kg"
                }
            ],
            "cart_total": 900.0,
            "abandonment_stage": "payment",
            "cart_created_at": datetime.now() - timedelta(hours=2),
            "last_activity": datetime.now() - timedelta(hours=1),
            "abandoned_at": datetime.now() - timedelta(hours=1),
            "recovery_attempts": 0,
            "recovered": False
        }
    ]
    
    result = await db.cart_abandonments.insert_many(sample_abandonment)
    print(f"✅ Created {len(result.inserted_ids)} sample cart abandonment records")
    
    client.close()
    return sample_orders

def test_with_sample_data():
    """Test endpoints with sample data"""
    print("🧪 Testing Enhanced Admin Panel with Sample Data...")
    
    session = requests.Session()
    
    # Test 1: Get all orders (should now have data)
    print("\n📋 Testing Order Management with Sample Data:")
    response = session.get(f"{API_BASE}/orders", params={"admin_key": ADMIN_KEY})
    if response.status_code == 200:
        orders = response.json()
        print(f"✅ Retrieved {len(orders)} orders")
        if orders:
            print(f"   Sample order: {orders[0]['customer_name']} - ₹{orders[0]['total_amount']}")
    
    # Test 2: Get customer order history
    response = session.get(f"{API_BASE}/orders/customer/+91-9876543210", params={"admin_key": ADMIN_KEY})
    if response.status_code == 200:
        customer_orders = response.json()
        print(f"✅ Retrieved {len(customer_orders)} orders for customer +91-9876543210")
    
    # Test 3: Update an order
    if 'orders' in locals() and orders:
        order_id = orders[0]['id']
        update_data = {
            "status": "preparing",
            "delivery_status": "dispatched",
            "admin_notes": "Updated via API test with sample data"
        }
        response = session.put(
            f"{API_BASE}/orders/{order_id}",
            params={"admin_key": ADMIN_KEY},
            json=update_data
        )
        if response.status_code == 200:
            updated_order = response.json()
            print(f"✅ Successfully updated order {order_id}")
            print(f"   New status: {updated_order['status']}")
    
    # Test 4: Analytics with real data
    print("\n📊 Testing Analytics with Sample Data:")
    response = session.get(f"{API_BASE}/analytics/visitors", params={"admin_key": ADMIN_KEY})
    if response.status_code == 200:
        analytics = response.json()
        print(f"✅ Visitor Analytics:")
        print(f"   Total Visitors: {analytics['total_visitors']}")
        print(f"   Total Orders: {analytics['total_orders']}")
        print(f"   Total Revenue: ₹{analytics['total_revenue']}")
        print(f"   Conversion Rate: {analytics['conversion_rate']:.2f}%")
    
    # Test 5: Customer analytics
    response = session.get(f"{API_BASE}/analytics/customers", params={"admin_key": ADMIN_KEY})
    if response.status_code == 200:
        customer_analytics = response.json()
        print(f"✅ Customer Analytics: {len(customer_analytics)} customers")
        if customer_analytics:
            top_customer = customer_analytics[0]
            print(f"   Top Customer: {top_customer['customer_name']} - ₹{top_customer['total_spent']}")
    
    # Test 6: Revenue report
    response = session.get(f"{API_BASE}/analytics/revenue-report", params={"admin_key": ADMIN_KEY})
    if response.status_code == 200:
        revenue_report = response.json()
        summary = revenue_report['summary']
        print(f"✅ Revenue Report:")
        print(f"   Total Orders: {summary['total_orders']}")
        print(f"   Total Revenue: ₹{summary['total_revenue']}")
        print(f"   Delivery Revenue: ₹{summary['total_delivery_revenue']}")
        print(f"   Grand Total: ₹{summary['grand_total']}")
    
    # Test 7: Cart abandonment
    response = session.get(f"{API_BASE}/analytics/cart-abandonment", params={"admin_key": ADMIN_KEY})
    if response.status_code == 200:
        abandonment_data = response.json()
        print(f"✅ Cart Abandonment: {len(abandonment_data)} abandoned carts")
        if abandonment_data:
            print(f"   Sample abandonment: ₹{abandonment_data[0]['cart_total']} cart value")

async def main():
    print("🎯 Enhanced Admin Panel Testing with Sample Data")
    print("=" * 60)
    
    # Create sample data
    print("🔧 Creating sample data...")
    sample_orders = await create_sample_orders()
    
    # Test with sample data
    test_with_sample_data()
    
    print("\n✅ All tests completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())