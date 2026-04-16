import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.base import TimestampMixin

class GiftCard(TimestampMixin, Base):
    __tablename__ = "gift_cards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    card_number = Column(String(20), unique=True, index=True, nullable=False)
    pin = Column(String(10), nullable=False)
    balance = Column(Float, default=0.0)
    expiry_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
