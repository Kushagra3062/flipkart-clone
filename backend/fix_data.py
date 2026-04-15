import asyncio
from app.db.session import AsyncSessionLocal
from app.models.shipping_address import ShippingAddress
from sqlalchemy import select, delete

async def fix():
    async with AsyncSessionLocal() as db:
        # Delete the bad address
        stmt = delete(ShippingAddress).where(ShippingAddress.phone == "E 3062")
        await db.execute(stmt)
        await db.commit()
        print("Bad address deleted.")

if __name__ == "__main__":
    asyncio.run(fix())
