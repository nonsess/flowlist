from typing import List, Optional
from uuid import UUID
from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.models.task import Task
from src.app.schemas.task import TaskCreate, TaskUpdate

class TaskRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, task_in: TaskCreate, user_id: UUID) -> Task:
        task = Task(**task_in.model_dump(), user_id=user_id)
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)

        return task
    
    async def list_all(self, user_id: UUID) -> Optional[List[Task]]:
        result = await self.db.execute(
            select(Task)
            .where(Task.user_id == user_id)
            .order_by(Task.completed, desc(Task.created_at))
        )
        return result.scalars()
    
    async def get_by_id(self, task_id: UUID, user_id: UUID) -> Optional[Task]:
        results = await self.db.execute(
            select(Task)
            .where(Task.user_id == user_id)
            .where(Task.id == task_id)
        )
        return results.scalars().first()
    
    async def update(self, task_id: UUID, task_update: TaskUpdate, user_id: UUID) -> Optional[Task]:
        task = await self.get_by_id(task_id, user_id)
        
        if not task:
            return None
        
        update_data = task_update.model_dump(exclude_unset=True)

        if "completed" in update_data:
            task.completed = update_data["completed"]
            if task.completed and not task.completed_at:
                from datetime import datetime
                task.completed_at = datetime.utcnow()
            elif not task.completed:
                task.completed_at = None

        for field, value in update_data.items():
            if field not in ("completed", "completed_at"):
                setattr(task, field, value)

        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task
    
    async def delete(self, task_id: UUID, user_id: UUID) -> bool:
        task = await self.get_by_id(task_id, user_id)
        if not task:
            return False
        await self.db.delete(task)
        await self.db.commit()
        return True