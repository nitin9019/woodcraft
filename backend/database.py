from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "woodcraft_db")

client = AsyncIOMotorClient(MONGO_URI)
database = client[DB_NAME]

def get_database():
    return database
