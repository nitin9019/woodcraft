from fastapi import APIRouter, HTTPException, Depends
from models.product import ProductCreate, ProductDB
from database import get_database
from typing import List

router = APIRouter()
db = get_database()

@router.get("/")
async def get_products(category: str = None, city: str = None, search: str = None):
    query = {}
    if category:
        query["category"] = category.lower()
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
        
    cursor = db["products"].find(query)
    products = await cursor.to_list(length=100)
    # Serialize _id to string for frontend
    for p in products:
        p["_id"] = str(p["_id"])
    return products

@router.post("/")
async def create_product(product: ProductCreate):
    product_dict = product.model_dump()
    if product_dict.get("category"):
        product_dict["category"] = product_dict["category"].lower()
    new_product = await db["products"].insert_one(product_dict)
    created_product = await db["products"].find_one({"_id": new_product.inserted_id})
    created_product["_id"] = str(created_product["_id"])
    return created_product

from bson import ObjectId
from datetime import datetime, timezone
from pydantic import BaseModel

class ReviewCreate(BaseModel):
    user_id: str
    name: str
    rating: int
    comment: str

@router.post("/{product_id}/reviews")
async def add_review(product_id: str, review: ReviewCreate):
    review_dict = review.model_dump()
    review_dict["date"] = datetime.now(timezone.utc).isoformat()
    
    product = await db["products"].find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    reviews = product.get("reviews", [])
    reviews.append(review_dict)
    
    new_rating = sum(r["rating"] for r in reviews) / len(reviews)
    
    await db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": {"reviews": reviews, "rating": new_rating}}
    )
    return {"msg": "Review added successfully"}

@router.get("/{product_id}/related")
async def get_related_products(product_id: str, limit: int = 4):
    product = await db["products"].find_one({"_id": ObjectId(product_id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    cursor = db["products"].find({"category": product["category"], "_id": {"$ne": ObjectId(product_id)}}).limit(limit)
    related = await cursor.to_list(length=limit)
    for p in related:
        p["_id"] = str(p["_id"])
    return related

@router.put("/{product_id}")
async def update_product(product_id: str, product: ProductCreate):
    product_dict = product.model_dump()
    result = await db["products"].update_one(
        {"_id": ObjectId(product_id)},
        {"$set": product_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated = await db["products"].find_one({"_id": ObjectId(product_id)})
    updated["_id"] = str(updated["_id"])
    return updated

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    result = await db["products"].delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 1:
        return {"msg": "Product deleted"}
    raise HTTPException(status_code=404, detail="Product not found")
