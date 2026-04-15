from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from pydantic.types import UUID4
from decimal import Decimal

from app.models.cart_item import CartItem
from app.models.product import Product
from app.schemas.cart import CartResponse, CartItemOut
from app.services.product_service import map_to_list_item

# --- Helper Methods ---

async def get_raw_cart_items(db: AsyncSession, user_id: UUID4) -> list[CartItem]:
    stmt = (
        select(CartItem)
        .options(selectinload(CartItem.product).selectinload(Product.images))
        .filter(CartItem.user_id == user_id)
    )
    result = await db.execute(stmt)
    return result.scalars().all()

def build_cart_response(cart_items: list[CartItem]) -> CartResponse:
    items_out = []
    subtotal = Decimal("0.0")
    total_amount = Decimal("0.0")
    item_count = 0

    for item in cart_items:
        prod = item.product
        qty = item.quantity
        
        unit_price = prod.price
        mrp = prod.mrp
        
        item_total = unit_price * qty
        item_subtotal = mrp * qty
        
        subtotal += item_subtotal
        total_amount += item_total
        item_count += qty
        
        items_out.append(
            CartItemOut(
                id=item.id,
                product=map_to_list_item(prod),
                quantity=qty,
                unit_price=unit_price,
                total_price=item_total
            )
        )

    # Shipping dynamically calculated based on bounds
    delivery_fee = Decimal("0.0") if total_amount > 499 else Decimal("40.0")
    
    # Empty cart shouldn't charge shipping
    if item_count == 0:
        delivery_fee = Decimal("0.0")
        
    total_amount += delivery_fee
    
    discount = subtotal - (total_amount - delivery_fee)
    savings = discount # Alias

    return CartResponse(
        items=items_out,
        item_count=item_count,
        subtotal=subtotal,
        total_discount=discount,
        total_amount=total_amount,
        savings=savings
    )

# --- Service Routines ---

async def get_cart(db: AsyncSession, user_id: UUID4) -> CartResponse:
    items = await get_raw_cart_items(db, user_id)
    return build_cart_response(items)

async def add_to_cart(db: AsyncSession, user_id: UUID4, product_id: UUID4, quantity: int) -> CartResponse:
    # Validate Product
    prod_stmt = select(Product).filter(Product.id == product_id)
    prod_res = await db.execute(prod_stmt)
    product = prod_res.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Check current item state
    cart_stmt = select(CartItem).filter(CartItem.user_id == user_id, CartItem.product_id == product_id)
    cart_res = await db.execute(cart_stmt)
    existing_item = cart_res.scalar_one_or_none()

    current_qty = existing_item.quantity if existing_item else 0
    new_qty = current_qty + quantity

    if new_qty > 10:
        raise HTTPException(status_code=409, detail="Maximum 10 items allowed per product")

    if new_qty > product.stock_qty:
        raise HTTPException(status_code=400, detail="Insufficient stock availability")

    if existing_item:
        existing_item.quantity = new_qty
    else:
        new_item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(new_item)

    await db.commit()
    return await get_cart(db, user_id)

async def update_cart_item(db: AsyncSession, user_id: UUID4, item_id: UUID4, quantity: int) -> CartResponse:
    stmt = select(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user_id)
    result = await db.execute(stmt)
    cart_item = result.scalar_one_or_none()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if quantity == 0:
        await db.delete(cart_item)
    else:
        # Validate against limits and stock lazily via DB constraints or explicit checks
        stmt_prod = select(Product).filter(Product.id == cart_item.product_id)
        res_prod = await db.execute(stmt_prod)
        prod = res_prod.scalar_one()

        if quantity > 10:
            raise HTTPException(status_code=409, detail="Maximum 10 items allowed per product")

        if quantity > prod.stock_qty:
            raise HTTPException(status_code=400, detail="Insufficient stock")

        cart_item.quantity = quantity
        
    await db.commit()
    return await get_cart(db, user_id)

async def remove_from_cart(db: AsyncSession, user_id: UUID4, item_id: UUID4) -> CartResponse:
    stmt = select(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user_id)
    result = await db.execute(stmt)
    cart_item = result.scalar_one_or_none()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    await db.delete(cart_item)
    await db.commit()
    return await get_cart(db, user_id)

async def clear_cart(db: AsyncSession, user_id: UUID4) -> CartResponse:
    stmt = select(CartItem).filter(CartItem.user_id == user_id)
    result = await db.execute(stmt)
    items = result.scalars().all()
    
    for item in items:
        await db.delete(item)
        
    await db.commit()
    return build_cart_response([])
