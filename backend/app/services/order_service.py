import random
import string
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from pydantic.types import UUID4
from decimal import Decimal

from app.models.cart_item import CartItem
from app.models.product import Product
from app.models.shipping_address import ShippingAddress
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.schemas.order import CheckoutRequest, OrderOut, OrderListItem, ShippingAddressOut
from app.services.product_service import map_to_list_item

def generate_order_number() -> str:
    return "ORD-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

async def place_order(db: AsyncSession, user_id: UUID4, checkout_request: CheckoutRequest) -> OrderOut:
    # We will wrap the operations logically. If any step fails, we raise an HTTPException,
    # which causes the FastAPI session dependency to rollback without committing.

    # 1. Fetch Cart
    cart_stmt = select(CartItem).options(selectinload(CartItem.product).selectinload(Product.images)).filter(CartItem.user_id == user_id)
    cart_res = await db.execute(cart_stmt)
    cart_items = cart_res.scalars().all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # 2. Validate Stock and compute totals
    subtotal = Decimal("0.0")
    total_amount = Decimal("0.0")
    item_count = 0

    for item in cart_items:
        prod = item.product
        if item.quantity > prod.stock_qty:
            raise HTTPException(status_code=400, detail=f"Product {prod.name} has insufficient stock")
        
        item_total = prod.price * item.quantity
        item_subtotal = prod.mrp * item.quantity
        
        subtotal += item_subtotal
        total_amount += item_total
        item_count += item.quantity

    delivery_fee = Decimal("0.0") if total_amount > 499 else Decimal("40.0")
    total_amount += delivery_fee
    discount = subtotal - (total_amount - delivery_fee)

    # 3. Resolve Shipping Address
    address_id = None
    if checkout_request.use_existing_address_id:
        addr_stmt = select(ShippingAddress).filter(ShippingAddress.id == checkout_request.use_existing_address_id, ShippingAddress.user_id == user_id)
        addr_res = await db.execute(addr_stmt)
        if not addr_res.scalar_one_or_none():
            raise HTTPException(status_code=404, detail="Shipping address not found")
        address_id = checkout_request.use_existing_address_id
    elif checkout_request.address:
        new_addr = ShippingAddress(
            user_id=user_id,
            **checkout_request.address.model_dump()
        )
        db.add(new_addr)
        await db.flush() # Get the new ID securely inside the transaction
        address_id = new_addr.id
    else:
        raise HTTPException(status_code=400, detail="Shipping address required")

    # 4. Create Order
    new_order = Order(
        order_number=generate_order_number(),
        user_id=user_id,
        address_id=address_id,
        status=OrderStatus.PENDING,
        subtotal=subtotal,
        discount=discount,
        delivery_fee=delivery_fee,
        total=total_amount,
        payment_method=checkout_request.payment_method
    )
    db.add(new_order)
    await db.flush() # Yield order ID

    # 5. Create items and decrement (6)
    for item in cart_items:
        prod = item.product
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=prod.id,
            quantity=item.quantity,
            unit_price=prod.price,
            total_price=prod.price * item.quantity
        )
        db.add(order_item)
        
        # Decrement stock tracking using ORM native updates
        prod.stock_qty -= item.quantity
        
        # 7. Clear cart item tracking
        await db.delete(item)

    # 8. Commit atomic transaction bounds
    await db.commit()

    # Re-fetch mapped Order securely formatted
    return await get_order_by_id(db, user_id, new_order.id)

async def get_orders(db: AsyncSession, user_id: UUID4) -> list[OrderListItem]:
    stmt = (
        select(Order)
        .options(selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images))
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
    )
    res = await db.execute(stmt)
    orders = res.scalars().all()

    results = []
    for order in orders:
        count = sum(i.quantity for i in order.items)
        img = None
        if order.items and order.items[0].product.images:
            images = order.items[0].product.images
            img = next((i.image_url for i in images if i.is_primary), images[0].image_url)

        results.append(
            OrderListItem(
                id=order.id,
                order_number=order.order_number,
                status=order.status.value,
                total=order.total,
                item_count=count,
                first_item_image=img,
                created_at=order.created_at
            )
        )
    return results

async def get_order_by_id(db: AsyncSession, user_id: UUID4, order_id: UUID4) -> OrderOut:
    stmt = (
        select(Order)
        .options(
            selectinload(Order.items).selectinload(OrderItem.product).selectinload(Product.images),
            selectinload(Order.shipping_address)
        )
        .filter(Order.id == order_id, Order.user_id == user_id)
    )
    res = await db.execute(stmt)
    order = res.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    items_out = []
    for item in order.items:
        items_out.append({
            "id": item.id,
            "product": map_to_list_item(item.product),
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "total_price": item.total_price
        })

    return OrderOut(
        id=order.id,
        order_number=order.order_number,
        status=order.status.value,
        items=items_out,
        shipping_address=ShippingAddressOut.model_validate(order.shipping_address),
        subtotal=order.subtotal,
        discount=order.discount,
        delivery_fee=order.delivery_fee,
        total=order.total,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        created_at=order.created_at
    )

async def get_user_addresses(db: AsyncSession, user_id: UUID4) -> list[ShippingAddressOut]:
    stmt = select(ShippingAddress).filter(ShippingAddress.user_id == user_id)
    res = await db.execute(stmt)
    addrs = res.scalars().all()
    return [ShippingAddressOut.model_validate(a) for a in addrs]
