import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.user import User

async def check_users():
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(User))
        users = res.scalars().all()
        print(f"Users in DB: {len(users)}")
        for u in users:
            print(f"- {u.email} (ID: {u.id})")

if __name__ == "__main__":
    asyncio.run(check_users())
