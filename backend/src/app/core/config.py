from pydantic_settings import BaseSettings
from datetime import timedelta


class Settings(BaseSettings):
    POSTGRE_DSN: str
    JWT_SECRET: str
    JWT_ALG: str
    JWT_EXPIRE_MINUTES: int

    @property
    def access_token_timedelta(self) -> timedelta:
        return timedelta(minutes=self.JWT_EXPIRE_MINUTES)
    
    class Config:
        env_file = ".env"

settings = Settings()