import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.shipping_address import ShippingAddress
from sqlalchemy import select

async def check_addresses():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(User).filter(User.email == "kushagrasingh3062@gmail.com"))
        user = res.scalar_one_or_none()
        if not user:
            print("User not found")
            return
        print(f"User: {user.name}")
        res = await db.execute(select(ShippingAddress).filter(ShippingAddress.user_id == user.id))
        addrs = res.scalars().all()
        print(f"Address count: {len(addrs)}")
        for i, a in enumerate(addrs):
            print(f"Address {i+1}:")
            print(f"  ID: {a.id}")
            print(f"  Full Name: {a.full_name}")
            print(f"  Phone: {a.phone}")
            print(f"  Pincode: {a.pincode}")
            print(f"  Line1: {a.address_line1}")

if __name__ == "__main__":
    asyncio.run(check_addresses())
