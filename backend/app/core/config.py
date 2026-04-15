from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator
import json
import uuid

class Settings(BaseSettings):
    PROJECT_NAME: str = "Flipkart Clone API"
    
    # DB
    DATABASE_URL: str
    REDIS_URL: str
    
    # Secrets
    SECRET_KEY: str
    
    # Cloudinary
    CLOUDINARY_URL: str
    
    # CORS
    ALLOWED_ORIGINS: list[str] = []

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: str | list[str]) -> list[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str):
            import json
            return json.loads(v)
        return v
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""

    # Twilio Verify (SMS OTP)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_VERIFY_SERVICE_SID: str = ""

    # SendGrid (Email OTP)
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = ""

    # Default User ID for local testing
    DEFAULT_USER_ID: uuid.UUID
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()
