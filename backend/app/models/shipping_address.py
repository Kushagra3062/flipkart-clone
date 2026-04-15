import uuid
from sqlalchemy import Column, String, Boolean, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin

class ShippingAddress(TimestampMixin, Base):
    __tablename__ = "shipping_addresses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    address_type = Column(String(20), default="HOME")  # HOME, WORK, OTHER
    address_line1 = Column(String(512), nullable=False)
    address_line2 = Column(String(512), nullable=True)
    city = Column(String(255), nullable=False)
    state = Column(String(255), nullable=False)
    pincode = Column(String(20), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_default = Column(Boolean, default=False)

    user = relationship("User", backref="shipping_addresses")
    orders = relationship("Order", back_populates="shipping_address")
