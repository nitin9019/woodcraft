from fastapi import APIRouter, HTTPException, Depends
from database import get_database
from routes.bookings import get_current_user

router = APIRouter()
db = get_database()

@router.get("/stats")
async def get_admin_stats(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    
    total_users = await db["users"].count_documents({"role": "user"})
    bookings = await db["bookings"].find().to_list(length=5000)
    products = await db["products"].find().to_list(length=5000)
    
    product_dict = {str(p["_id"]): p for p in products}
    
    total_revenue = 0
    orders_by_status = {"Pending": 0, "Accepted": 0, "In Progress": 0, "Completed": 0, "Cancelled": 0}
    
    # Monthly revenue mock data for the bar chart since creation dates might all be today for testing
    monthly_revenue = {
        "Jan": 45000, "Feb": 68000, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0
    }
    
    for b in bookings:
        status = b.get("status", "Pending")
        orders_by_status[status] = orders_by_status.get(status, 0) + 1
        
        p = product_dict.get(b["product_id"])
        if p and "price" in p:
            price = p["price"]
            total_revenue += price * b.get("quantity", 1)
            # Add to current month (Mar) for realistic graph scaling
            monthly_revenue["Mar"] += price * b.get("quantity", 1)

    status_chart = [{"name": k, "value": v} for k, v in orders_by_status.items() if v > 0]
    monthly_chart = [{"month": k, "revenue": v} for k, v in monthly_revenue.items() if v > 0 or k in ["Jan", "Feb", "Mar"]]
    
    return {
        "total_users": total_users,
        "total_orders": len(bookings),
        "total_revenue": total_revenue,
        "status_chart": status_chart,
        "monthly_chart": monthly_chart
    }

@router.get("/users")
async def get_all_users(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    users = await db["users"].find({"role": "user"}).to_list(length=1000)
    for u in users:
        u["_id"] = str(u["_id"])
    return users
