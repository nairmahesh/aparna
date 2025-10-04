#!/usr/bin/env python3
"""
Create sample orders for testing the admin panel
"""

import asyncio
import uuid
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import os

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
            "customer_name": "Anita Patel",
            "customer_phone": "+91-9876543212",
            "customer_email": "anita.patel@email.com",
            "customer_address": "789 Commercial Street, Bangalore, Karnataka 560001",
            "customer_type": "returning",
            "is_repeat_customer": True,
            "previous_orders_count": 2,
            "items": [
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Besan Laddu",
                    "price": 600.0,
                    "quantity": 1,
                    "unit": "per kg"
                },
                {
                    "product_id": str(uuid.uuid4()),
                    "product_name": "Murukku",
                    "price": 250.0,
                    "quantity": 2,
                    "unit": "per pack"
                }
            ],
            "total_amount": 1100.0,
            "delivery_cost": 40.0,
            "delivery_date": datetime.now() + timedelta(days=3),
            "status": "preparing",
            "delivery_status": "pending",
            "payment_status": "paid",
            "created_at": datetime.now() - timedelta(hours=5),
            "updated_at": datetime.now(),
            "notes": "Regular customer, prefers morning delivery"
        }
    ]
    
    # Insert sample orders
    result = await db.orders.insert_many(sample_orders)
    print(f"Created {len(result.inserted_ids)} sample orders")
    
    # Create some visitor analytics data
    visitor_sessions = [
        {
            "id": str(uuid.uuid4()),
            "session_id": str(uuid.uuid4().hex),
            "visitor_type": "anonymous",
            "first_visit": datetime.now() - timedelta(hours=2),
            "last_activity": datetime.now() - timedelta(hours=1),
            "total_page_views": 5,
            "total_time_spent": 450,
            "items_added_to_cart": 2,
            "checkout_attempts": 0,
            "orders_placed": 0,
            "converted_to_customer": False
        },
        {
            "id": str(uuid.uuid4()),
            "session_id": str(uuid.uuid4().hex),
            "visitor_type": "customer",
            "customer_phone": "+91-9876543210",
            "first_visit": datetime.now() - timedelta(hours=4),
            "last_activity": datetime.now() - timedelta(hours=3),
            "total_page_views": 8,
            "total_time_spent": 720,
            "items_added_to_cart": 3,
            "checkout_attempts": 1,
            "orders_placed": 1,
            "converted_to_customer": True
        }
    ]
    
    await db.visitor_sessions.insert_many(visitor_sessions)
    print(f"Created {len(visitor_sessions)} visitor sessions")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_sample_orders())