from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from models.user import PyObjectId

class BookingBase(BaseModel):
    product_id: str
    product_name: str
    name: str
    phone: str
    wood_type: str
    quantity: int
    city: str
    lat: float
    lng: float
    address: str
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingDB(BookingBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    status: str = "Pending"  # Pending, Accepted, In Progress, Completed, Cancelled
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
