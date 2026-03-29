from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import bcrypt
from models.user import UserCreate, UserDB, UserBase
from database import get_database
from typing import Optional
from datetime import datetime, timedelta, timezone
import jwt
import os

router = APIRouter()
db = get_database()

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey_change_in_production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24 hours default

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=1440)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

import re

@router.post("/register", response_model=UserDB)
async def register(user: UserCreate):
    # Validations
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
    if not re.match(r'^[a-z0-9_]+$', user.username):
        raise HTTPException(status_code=400, detail="Username must be lowercase, no spaces, and contain only letters, numbers, or underscores")

    existing_user = await db["users"].find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    user_dict = user.model_dump()
    user_dict["password"] = get_password_hash(user_dict["password"])
    user_dict["role"] = "user"
    
    new_user = await db["users"].insert_one(user_dict)
    created_user = await db["users"].find_one({"_id": new_user.inserted_id})
    return created_user

@router.post("/login")
async def login(req: LoginRequest):
    # Fixed admin credential check
    if req.username_or_email == "admin" and req.password == "admin":
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": "admin", "role": "admin"}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer", "user": {"username": "admin", "role": "admin"}}
    
    user = await db["users"].find_one({"$or": [{"username": req.username_or_email}, {"email": req.username_or_email}]})
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "role": user.get("role", "user"), "id": str(user["_id"])}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": str(user["_id"]), "username": user["username"], "role": user.get("role", "user")}}
