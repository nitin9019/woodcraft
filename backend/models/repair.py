from pydantic import BaseModel, Field
from typing import Optional
from models.user import PyObjectId

class RepairBase(BaseModel):
    name: str
    phone: str
    city: str
    lat: float
    lng: float
    description: str
    image: Optional[str] = None

class RepairCreate(RepairBase):
    pass

class RepairDB(RepairBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    status: str = "Pending"
