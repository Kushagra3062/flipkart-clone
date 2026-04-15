import asyncio
from app.db.session import AsyncSessionLocal
from app.models.shipping_address import ShippingAddress
from sqlalchemy import select

async def find_bad():
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(ShippingAddress).filter(ShippingAddress.phone == "E 3062"))
        addrs = res.scalars().all()
        for a in addrs:
            print(f"BAD ADDR FOUND: ID {a.id} User {a.user_id} Phone {a.phone}")

if __name__ == "__main__":
    asyncio.run(find_bad())
