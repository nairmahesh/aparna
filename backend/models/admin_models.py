from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    OUT_OF_STOCK = "out_of_stock"

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    images: List[str] = []
    description: str
    note_from_aparna: Optional[str] = None
    base_price: float
    discount_percentage: Optional[float] = None
    offer_price: Optional[float] = None
    unit: str = "per kg"
    status: ProductStatus = ProductStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    @property
    def final_price(self):
        if self.offer_price:
            return self.offer_price
        elif self.discount_percentage:
            return self.base_price * (1 - self.discount_percentage / 100)
        return self.base_price
    
    @property
    def has_offer(self):
        return self.offer_price is not None or self.discount_percentage is not None

class ProductCreate(BaseModel):
    name: str
    category: str
    images: List[str] = []
    description: str
    note_from_aparna: Optional[str] = None
    base_price: float
    discount_percentage: Optional[float] = None
    offer_price: Optional[float] = None
    unit: str = "per kg"
    status: ProductStatus = ProductStatus.ACTIVE

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    images: Optional[List[str]] = None
    description: Optional[str] = None
    note_from_aparna: Optional[str] = None
    base_price: Optional[float] = None
    discount_percentage: Optional[float] = None
    offer_price: Optional[float] = None
    unit: Optional[str] = None
    status: Optional[ProductStatus] = None

# Contact and Link Tracking Models
class Contact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    relationship: str  # friend, family, colleague, etc.
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_contacted: Optional[datetime] = None

class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    relationship: str
    notes: Optional[str] = None

class PersonalizedLink(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    contact_id: str
    link_token: str = Field(default_factory=lambda: str(uuid.uuid4().hex))
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    is_active: bool = True

class LinkTracking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    link_id: str
    contact_id: str
    event_type: str  # 'link_opened', 'page_viewed', 'item_added', 'checkout_started', 'order_placed'
    page_url: Optional[str] = None
    product_id: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

class LinkAnalytics(BaseModel):
    link_id: str
    contact_name: str
    contact_phone: str
    total_opens: int
    unique_opens: int
    last_opened: Optional[datetime]
    pages_viewed: List[str]
    products_viewed: List[str]
    items_added_to_cart: int
    checkout_started: bool
    order_placed: bool
    total_order_value: Optional[float]
    created_at: datetime
    link_status: str

class MessageTemplate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    message: str
    variables: List[str] = []  # Available variables like {name}, {link}, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Order Management Models
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    price: float
    quantity: int
    unit: str

class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_phone: str
    customer_address: str
    delivery_date: datetime
    items: List[OrderItem]
    total_amount: float
    status: OrderStatus = OrderStatus.PENDING
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_address: str
    delivery_date: datetime
    items: List[OrderItem]
    total_amount: float
    notes: Optional[str] = None

import uuid