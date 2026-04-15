import asyncio
import sys
import os
import requests
from sqlalchemy import select

# Add current dir to path to import app correctly
sys.path.append(os.getcwd())

from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.core.security import create_access_token

async def test_wishlist_auth():
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(User))
        user = res.scalars().first()
        if not user:
            print("No users in DB!")
            return
        
        print(f"Testing for user: {user.email} (ID: {user.id})")
        token = create_access_token(user.id)
        
        url = "http://localhost:8000/api/v1/profile/wishlist"
        headers = {"Authorization": f"Bearer {token}"}
        
        print(f"Requesting {url}")
        r = requests.get(url, headers=headers)
        print(f"Status Code: {r.status_code}")
        print(f"Response Body: {r.text}")

if __name__ == "__main__":
    asyncio.run(test_wishlist_auth())
