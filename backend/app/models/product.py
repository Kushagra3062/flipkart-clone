import uuid
from sqlalchemy import Column, String, Text, Numeric, Integer, Boolean, ForeignKey, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.base import TimestampMixin

class Product(TimestampMixin, Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    mrp = Column(Numeric(10, 2), nullable=False)
    discount_percent = Column(Numeric(5, 2), nullable=True)
    stock_qty = Column(Integer, default=0, nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False, index=True)
    brand = Column(String(255), nullable=True)
    rating = Column(Numeric(3, 2), default=0.0)
    rating_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")

    __table_args__ = (
        CheckConstraint("price >= 0", name="check_price_positive"),
        CheckConstraint("stock_qty >= 0", name="check_stock_positive"),
        Index("ix_product_category_active", "category_id", "is_active"), # Composite index for faster category listings
        Index("ix_product_name_search", "name", postgresql_ops={"name": "varchar_pattern_ops"}), # Optimized search
    )

