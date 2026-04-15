import uuid
from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.base import TimestampMixin

class User(TimestampMixin, Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=True)
    gender = Column(String(10), nullable=True)  # Male, Female, Other
    is_verified = Column(Boolean(), default=False)
    phone_verified = Column(Boolean(), default=False)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean(), default=True)
