import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.shipping_address import ShippingAddress
from sqlalchemy import select

async def check():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).filter(User.email == "kushagrasingh3062@gmail.com"))
        user = res.scalar_one_or_none()
        if not user: return
        res = await db.execute(select(ShippingAddress).filter(ShippingAddress.user_id == user.id))
        for a in res.scalars().all():
            print(f"ID:{a.id} | NAME:{a.full_name} | PHONE:{a.phone} | PIN:{a.pincode}")

if __name__ == "__main__":
    asyncio.run(check())
