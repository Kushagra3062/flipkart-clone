from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class CouponBase(BaseModel):
    code: str
    description: str
    discount_value: float
    discount_type: str = "fixed"
    min_order_value: float = 0.0
    expiry_date: datetime
    is_active: bool = True
    category_id: Optional[UUID] = None

class CouponCreate(CouponBase):
    pass

class Coupon(CouponBase):
    id: UUID
    
    class Config:
        from_attributes = True
