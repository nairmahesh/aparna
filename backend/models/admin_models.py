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

# Enhanced Order Management Models
class DeliveryStatus(str, Enum):
    PENDING = "pending"
    DISPATCHED = "dispatched"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    FAILED = "failed"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class CustomerType(str, Enum):
    NEW = "new"
    RETURNING = "returning"

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    delivery_date: Optional[datetime] = None
    dispatched_date: Optional[datetime] = None
    delivery_cost: Optional[float] = None
    delivery_status: Optional[DeliveryStatus] = None
    payment_status: Optional[PaymentStatus] = None
    notes: Optional[str] = None

# Enhanced Order Model
class OrderEnhanced(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    customer_address: str
    customer_type: CustomerType = CustomerType.NEW
    is_repeat_customer: bool = False
    previous_orders_count: int = 0
    
    # Order details
    items: List[OrderItem]
    total_amount: float
    delivery_cost: float = 0.0
    
    # Dates
    delivery_date: datetime
    dispatched_date: Optional[datetime] = None
    delivered_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Status
    status: OrderStatus = OrderStatus.PENDING
    delivery_status: DeliveryStatus = DeliveryStatus.PENDING
    payment_status: PaymentStatus = PaymentStatus.PENDING
    
    # Tracking
    visitor_session_id: Optional[str] = None
    referral_link_token: Optional[str] = None
    
    # Notes
    notes: Optional[str] = None
    admin_notes: Optional[str] = None
    
    @property
    def final_amount(self) -> float:
        return self.total_amount + self.delivery_cost

# Visitor Tracking Models
class VisitorType(str, Enum):
    ANONYMOUS = "anonymous"
    IDENTIFIED = "identified"
    CUSTOMER = "customer"

class VisitorSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4().hex))
    visitor_type: VisitorType = VisitorType.ANONYMOUS
    
    # Visitor identification
    customer_id: Optional[str] = None  # If known customer
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    
    # Session details
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    referral_source: Optional[str] = None
    referral_link_token: Optional[str] = None
    
    # Tracking data
    first_visit: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    total_page_views: int = 0
    total_time_spent: int = 0  # in seconds
    
    # E-commerce tracking
    products_viewed: List[str] = []
    items_added_to_cart: int = 0
    cart_abandonment_count: int = 0
    checkout_attempts: int = 0
    orders_placed: int = 0
    total_order_value: float = 0.0
    
    # Status
    is_active: bool = True
    converted_to_customer: bool = False

class VisitorEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    event_type: str  # 'page_view', 'product_view', 'cart_add', 'cart_remove', 'checkout_start', 'order_complete', etc.
    
    # Event details
    page_url: Optional[str] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    cart_value: Optional[float] = None
    order_id: Optional[str] = None
    
    # Metadata
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    properties: Optional[dict] = {}

# Cart Abandonment Tracking
class CartAbandonmentSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    
    # Cart details
    cart_items: List[OrderItem]
    cart_total: float
    abandonment_stage: str  # 'cart', 'shipping', 'payment', 'confirmation'
    
    # Timing
    cart_created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    abandoned_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Follow-up
    recovery_attempts: int = 0
    recovered: bool = False
    recovery_order_id: Optional[str] = None

# Analytics Summary Models
class DashboardAnalytics(BaseModel):
    # Time range
    date_range: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
    # Visitor metrics
    total_visitors: int = 0
    unique_visitors: int = 0
    returning_visitors: int = 0
    new_visitors: int = 0
    
    # Engagement metrics
    avg_session_duration: float = 0.0
    bounce_rate: float = 0.0
    pages_per_session: float = 0.0
    
    # E-commerce metrics
    total_orders: int = 0
    total_revenue: float = 0.0
    avg_order_value: float = 0.0
    conversion_rate: float = 0.0
    
    # Cart metrics
    cart_abandonment_rate: float = 0.0
    abandoned_carts: int = 0
    recovered_carts: int = 0
    
    # Product metrics
    top_products: List[dict] = []
    most_viewed_products: List[dict] = []

class CustomerAnalytics(BaseModel):
    customer_id: str
    customer_name: str
    customer_phone: str
    customer_type: CustomerType
    
    # Order history
    total_orders: int = 0
    total_spent: float = 0.0
    avg_order_value: float = 0.0
    first_order_date: Optional[datetime] = None
    last_order_date: Optional[datetime] = None
    
    # Engagement
    total_visits: int = 0
    last_visit_date: Optional[datetime] = None
    avg_time_between_orders: Optional[float] = None  # in days
    
    # Preferences
    favorite_categories: List[str] = []
    favorite_products: List[str] = []
    
    # Status
    is_active: bool = True
    risk_level: str = "low"  # low, medium, high (based on activity)