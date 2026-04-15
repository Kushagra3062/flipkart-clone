import asyncio
import sys
import os
import uuid

sys.path.append(os.getcwd())

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.db.session import AsyncSessionLocal
from app.models.product import Product
from app.models.wishlist import Wishlist
from app.models.user import User

async def debug_wishlist():
    user_id = uuid.UUID("00000000-0000-0000-0000-000000000000")
    async with AsyncSessionLocal() as db:
        try:
            print("Executing query...")
            result = await db.execute(
                select(Product)
                .where(Product.id.in_(
                    select(Wishlist.product_id).where(Wishlist.user_id == user_id)
                ))
                .options(selectinload(Product.images))
            )
            products = result.scalars().all()
            print(f"Found {len(products)} products")
            
            data = [
                {
                    "id": str(p.id),
                    "name": p.name,
                    "price": p.price,
                    "mrp": p.mrp,
                    "discount_percent": p.discount_percent,
                    "image_url": p.images[0].image_url if p.images else None,
                    "rating": p.rating,
                    "rating_count": p.rating_count,
                    "brand": p.brand
                }
                for p in products
            ]
            print("Successfully mapped data")
            print(data)
        except Exception as e:
            print(f"!!! CRASH !!!")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_wishlist())
