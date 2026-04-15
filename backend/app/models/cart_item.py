import uuid
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin

class CartItem(TimestampMixin, Base):
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity = Column(Integer, default=1, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "product_id", name="uix_user_product_cart"),
        CheckConstraint("quantity > 0", name="check_quantity_positive"),
        Index("ix_cart_user_id", "user_id"),
    )

    user = relationship("User", backref="cart_items")
    product = relationship("Product", back_populates="cart_items")
