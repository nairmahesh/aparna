from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
import uuid

class ReviewRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_phone: str
    customer_name: str
    order_id: str
    order_date: datetime
    products_ordered: List[str]
    request_sent_date: Optional[datetime] = None
    request_method: Optional[Literal["whatsapp", "sms", "email"]] = None
    review_submitted: bool = False
    review_submitted_date: Optional[datetime] = None
    status: Literal["pending", "sent", "reviewed", "expired"] = "pending"

class CustomerReview(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_phone: str
    customer_name: str
    order_id: str
    product_id: str
    product_name: str
    overall_rating: int = Field(ge=1, le=5)
    taste_rating: Optional[int] = Field(None, ge=1, le=5)
    packaging_rating: Optional[int] = Field(None, ge=1, le=5)
    delivery_rating: Optional[int] = Field(None, ge=1, le=5)
    comment: str
    review_date: datetime
    approved: bool = False
    display_on_website: bool = False

class ReviewRequestCreate(BaseModel):
    customer_phone: str
    customer_name: str
    order_id: str
    order_date: datetime
    products_ordered: List[str]
    request_method: Literal["whatsapp", "sms", "email"]

class ReviewRequestBatch(BaseModel):
    order_ids: List[str]
    request_method: Literal["whatsapp", "sms", "email"]
    message_template: Optional[str] = None

class ReviewStats(BaseModel):
    total_requests_sent: int
    pending_reviews: int
    completed_reviews: int
    review_response_rate: float
    average_overall_rating: float
    recent_reviews: List[CustomerReview]

class ReviewRequestSummary(BaseModel):
    total_orders: int
    orders_with_requests_sent: int
    orders_pending_requests: int
    total_reviews_received: int
    orders_eligible_for_requests: List[dict]