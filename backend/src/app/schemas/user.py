from uuid import UUID

from pydantic import BaseModel, Field, validator
from datetime import datetime
import re

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=32)
    password: str = Field(..., min_length=6, max_length=72)

    @validator("username")
    def username_valid(cls, v):
        if not re.match("^[a-zA-Z0-9_]+$", v):
            raise ValueError("Username must contain only letters, digits, and underscores")
        return v

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserRead(BaseModel):
    id: UUID
    username: str
    created_at: datetime

    class Config:
        from_attributes = True