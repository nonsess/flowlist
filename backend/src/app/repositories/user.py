from uuid import UUID
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.app.models.user import User
from src.app.core.security import get_password_hash

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_username(self, username: str) -> Optional[User]:
        result = await self.db.execute(select(User).where(User.username == username))
        return result.scalars().first()

    async def create(self, username: str, password: str) -> User:
        hashed_password = get_password_hash(password)
        user = User(username=username, hashed_password=hashed_password)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def get_by_id(self, user_id: str) -> Optional[User]:
        try:
            uuid_id = UUID(user_id)
        except ValueError:
            return None
        result = await self.db.execute(select(User).where(User.id == uuid_id))
        return result.scalars().first()
