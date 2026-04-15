import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.cart_item import CartItem
from sqlalchemy import select

async def check():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).filter(User.email == "kushagrasingh3062@gmail.com"))
        user = res.scalar_one_or_none()
        if not user:
            print("User not found")
            return
        print(f"User: {user.name}")
        res = await db.execute(select(CartItem).filter(CartItem.user_id == user.id))
        items = res.scalars().all()
        print(f"Cart count: {len(items)}")

if __name__ == "__main__":
    asyncio.run(check())
