import asyncio
from app.db.session import AsyncSessionLocal
from app.models.shipping_address import ShippingAddress
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError

async def test_integrity():
    async with AsyncSessionLocal() as db:
        # Get an address that has orders
        # I'll just try to delete the first one that exists
        res = await db.execute(select(ShippingAddress).limit(1))
        addr = res.scalar_one_or_none()
        if not addr:
            print("No addresses found")
            return
            
        print(f"Trying to delete addr: {addr.id}")
        try:
            await db.delete(addr)
            await db.commit()
            print("Deleted successfully (Surprising!)")
        except IntegrityError as e:
            print(f"IntegrityError CAUGHT: {e}")
            await db.rollback()
        except Exception as e:
            print(f"Other Error CAUGHT: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(test_integrity())
