import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.cart_item import CartItem
from sqlalchemy import select

async def check_cart():
    async with AsyncSessionLocal() as db:
        user_stmt = select(User).order_by(User.id)
        user_res = await db.execute(user_stmt)
        users = user_res.scalars().all()
        
        print("Cart Check Report:")
        for user in users:
            cart_stmt = select(CartItem).filter(CartItem.user_id == user.id)
            cart_res = await db.execute(cart_stmt)
            items = cart_res.scalars().all()
            print(f"User: {user.name} ({user.email}) -> Items in Cart: {len(items)}")
            for item in items:
                print(f"  - Item ID: {item.id}, Qty: {item.quantity}, Product ID: {item.product_id}")

if __name__ == "__main__":
    asyncio.run(check_cart())
