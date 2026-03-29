from fastapi import APIRouter, HTTPException, Depends, Request
from models.booking import BookingCreate
from database import get_database
from bson import ObjectId
import jwt
import os
from datetime import datetime, timezone

router = APIRouter()
db = get_database()
SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey_change_in_production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def serialize_booking(b):
    """Convert MongoDB booking document to JSON-serializable dict."""
    b["_id"] = str(b["_id"])
    if isinstance(b.get("created_at"), datetime):
        b["created_at"] = b["created_at"].isoformat()
    return b

async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Unauthorized - token expired or invalid")

@router.post("/")
async def create_booking(booking: BookingCreate, current_user: dict = Depends(get_current_user)):
    booking_dict = booking.model_dump()
    booking_dict["user_id"] = current_user.get("id", current_user.get("sub", "admin"))
    booking_dict["status"] = "Pending"
    booking_dict["created_at"] = datetime.now(timezone.utc)
    
    new_booking = await db["bookings"].insert_one(booking_dict)
    created_booking = await db["bookings"].find_one({"_id": new_booking.inserted_id})
    return serialize_booking(created_booking)

@router.get("/")
async def get_bookings(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") == "admin":
        cursor = db["bookings"].find()
    else:
        user_id = current_user.get("id", current_user.get("sub"))
        cursor = db["bookings"].find({"user_id": user_id})
    bookings = await cursor.to_list(length=100)
    return [serialize_booking(b) for b in bookings]

@router.patch("/{booking_id}")
async def update_booking_status(booking_id: str, status: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    
    result = await db["bookings"].update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": status}}
    )
    if result.modified_count == 1:
        return {"msg": "Status updated successfully"}
    raise HTTPException(status_code=404, detail="Booking not found")
