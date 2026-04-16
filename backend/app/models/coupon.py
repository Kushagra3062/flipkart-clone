import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
from app.models.base import TimestampMixin
from datetime import datetime

class Coupon(TimestampMixin, Base):
    __tablename__ = "coupons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(500), nullable=False)
    discount_value = Column(Float, nullable=False)
    discount_type = Column(String(20), default="fixed") # fixed, percentage
    min_order_value = Column(Float, default=0.0)
    expiry_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    category_id = Column(UUID(as_uuid=True), nullable=True)
