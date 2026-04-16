from pydantic import BaseModel, ConfigDict, Field, constr
from pydantic.types import UUID4
from decimal import Decimal
from typing import List, Optional, Literal
from datetime import datetime

from app.schemas.product import ProductListItem

class ShippingAddressIn(BaseModel):
    full_name: str
    phone: str = Field(..., pattern=r"^\d{10}$")
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    pincode: str = Field(..., pattern=r"^\d{6}$")
    address_type: str = "HOME"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_default: bool = False

class ShippingAddressOut(ShippingAddressIn):
    id: UUID4

    model_config = ConfigDict(from_attributes=True)

class CheckoutRequest(BaseModel):
    address: Optional[ShippingAddressIn] = None
    use_existing_address_id: Optional[UUID4] = None
    coupon_code: Optional[str] = None
    payment_method: Literal["COD", "UPI", "CARD", "Wallets", "Net Banking", "Credit / Debit / ATM Card"]

class OrderItemOut(BaseModel):
    id: UUID4
    product: ProductListItem
    quantity: int
    unit_price: Decimal
    total_price: Decimal

    model_config = ConfigDict(from_attributes=True)

class OrderOut(BaseModel):
    id: UUID4
    order_number: str
    status: str
    items: List[OrderItemOut]
    shipping_address: ShippingAddressOut
    subtotal: Decimal
    discount: Decimal
    delivery_fee: Decimal
    total: Decimal
    payment_method: str
    payment_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class OrderListItem(BaseModel):
    id: UUID4
    order_number: str
    status: str
    total: Decimal
    item_count: int
    first_item_image: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
