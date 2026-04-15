from fastapi import APIRouter, Depends, Path
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic.types import UUID4

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.cart import CartResponse, CartItemIn, CartItemUpdate
from app.services import cart_service

router = APIRouter()

@router.get("/", response_model=CartResponse, summary="Get current user's cart")
async def get_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await cart_service.get_cart(db, current_user.id)

@router.post("/items", response_model=CartResponse, summary="Add item to cart")
async def add_to_cart(
    item_in: CartItemIn,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await cart_service.add_to_cart(db, current_user.id, item_in.product_id, item_in.quantity)

@router.put("/items/{item_id}", response_model=CartResponse, summary="Update cart item quantity")
async def update_cart_item(
    item_update: CartItemUpdate,
    item_id: UUID4 = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await cart_service.update_cart_item(db, current_user.id, item_id, item_update.quantity)

@router.delete("/items/{item_id}", response_model=CartResponse, summary="Remove item from cart")
async def remove_from_cart(
    item_id: UUID4 = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await cart_service.remove_from_cart(db, current_user.id, item_id)

@router.delete("/", response_model=CartResponse, summary="Clear user's cart entirely")
async def clear_cart(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await cart_service.clear_cart(db, current_user.id)
