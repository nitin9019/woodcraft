from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime
from models.user import PyObjectId

class ProductBase(BaseModel):
    name: str
    category: str
    image: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    price: float = 0.0
    brand: Optional[str] = "Good Craft Services"
    stock: int = 10
    rating: float = 0.0
    reviews: List[dict] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    durability_info: Optional[str] = "High-quality, long-lasting resilience designed for everyday use."
    maintenance_guide: Optional[str] = "Wipe with a damp cloth. Avoid direct long-term sun exposure."
    delivery_details: Optional[str] = "Ships within 5-7 business days."
    description: Optional[str] = "A beautifully crafted piece of furniture to elevate your home."

class ProductCreate(ProductBase):
    pass

class ProductDB(ProductBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
