from pydantic import BaseModel, ConfigDict, Field
from pydantic.types import UUID4
from decimal import Decimal
from typing import List
from app.schemas.product import ProductListItem

class CartItemIn(BaseModel):
    product_id: UUID4
    quantity: int = Field(..., ge=1, le=10)

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=0, le=10)

class CartItemOut(BaseModel):
    id: UUID4
    product: ProductListItem
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    items: List[CartItemOut]
    item_count: int
    subtotal: Decimal
    total_discount: Decimal
    total_amount: Decimal
    savings: Decimal
