from pydantic import BaseModel, EmailStr, Field
from pydantic.functional_validators import BeforeValidator
from typing import Optional, Annotated

# Custom type for handling MongoDB ObjectIds
PyObjectId = Annotated[str, BeforeValidator(str)]

class UserBase(BaseModel):
    name: str
    phone: str
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    role: str = "user" # 'user' or 'admin'
