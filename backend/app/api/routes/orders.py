from fastapi import APIRouter, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic.types import UUID4
from typing import List

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.order import CheckoutRequest, OrderOut, OrderListItem, ShippingAddressOut
from app.services import order_service

# To comply with the unified app interface, we will define one router for both /orders and /addresses
# Or we can just use the same router and prefix it conditionally in main, but let's centralize.
router = APIRouter()

@router.post("/checkout", response_model=OrderOut, summary="Place a new order")
async def place_order(
    checkout_req: CheckoutRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await order_service.place_order(db, current_user.id, checkout_req)

@router.get("/", response_model=List[OrderListItem], summary="Get order history")
async def get_orders(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await order_service.get_orders(db, current_user.id)

@router.get("/{order_id}", response_model=OrderOut, summary="Get order details by ID")
async def get_order_by_id(
    order_id: UUID4 = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await order_service.get_order_by_id(db, current_user.id, order_id)

address_router = APIRouter()

@address_router.get("/", response_model=List[ShippingAddressOut], summary="Get user saved addresses")
async def get_saved_addresses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await order_service.get_user_addresses(db, current_user.id)
