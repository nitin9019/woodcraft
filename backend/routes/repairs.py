from fastapi import APIRouter, HTTPException, Depends, Request
from models.repair import RepairCreate, RepairDB
from database import get_database
from typing import List
from bson import ObjectId
from routes.bookings import get_current_user

router = APIRouter()
db = get_database()

@router.post("/", response_model=RepairDB)
async def create_repair(repair: RepairCreate, current_user: dict = Depends(get_current_user)):
    repair_dict = repair.model_dump()
    repair_dict["user_id"] = current_user.get("id", "admin")
    repair_dict["status"] = "Pending"
    
    new_repair = await db["repairs"].insert_one(repair_dict)
    created_repair = await db["repairs"].find_one({"_id": new_repair.inserted_id})
    return created_repair

@router.get("/", response_model=List[RepairDB])
async def get_repairs(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") == "admin":
        cursor = db["repairs"].find()
    else:
        cursor = db["repairs"].find({"user_id": current_user.get("id")})
    repairs = await cursor.to_list(length=100)
    return repairs

@router.patch("/{repair_id}")
async def update_repair_status(repair_id: str, status: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    
    result = await db["repairs"].update_one(
        {"_id": ObjectId(repair_id)},
        {"$set": {"status": status}}
    )
    if result.modified_count == 1:
        return {"msg": "Status updated successfully"}
    raise HTTPException(status_code=404, detail="Repair not found")
