from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import database
from routes import auth, products, bookings, repairs, admin

app = FastAPI(title="WoodCraft Furniture Services API")

import os

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    # Attempt to ping MongoDB
    await database.command("ping")
    print("Connected to MongoDB!")

@app.get("/")
def read_root():
    return {"message": "Welcome to WoodCraft Furniture API"}

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
app.include_router(repairs.router, prefix="/api/repairs", tags=["Repairs"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
