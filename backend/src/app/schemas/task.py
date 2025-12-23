from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Task title")
    description: Optional[str] = Field(None, max_length=1000, description="Optional task description")


class TaskCreate(TaskBase):
    """Schema for creating a new task"""
    pass


class TaskUpdate(TaskBase):
    """Schema for updating a task — все поля опциональны"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None


class TaskInDB(TaskBase):
    """Internal schema — то, что хранится в БД"""
    id: UUID
    completed: bool
    completed_at: Optional[datetime] = None
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


class TaskRead(TaskInDB):
    """Schema for API response — то, что видит клиент"""
    pass