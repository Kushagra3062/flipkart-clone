import asyncio
from app.db.session import AsyncSessionLocal
from app.models.product import Product
from app.models.product_image import ProductImage
from sqlalchemy import select
import random

async def update_images():
    async with AsyncSessionLocal() as db:
        # Get all products
        stmt = select(Product)
        result = await db.execute(stmt)
        products = result.scalars().all()
        
        print(f"Updating images for {len(products)} products...")
        
        for p in products:
            # Get images for this product
            img_stmt = select(ProductImage).filter(ProductImage.product_id == p.id)
            img_result = await db.execute(img_stmt)
            images = img_result.scalars().all()
            
            # Use part of the product name as a tag for LoremFlickr
            # This ensures relevant yet diverse images
            search_tag = p.name.split()[0].replace(",", "").replace("-", "").lower()
            if len(search_tag) < 3: # Fallback for short names
                search_tag = "gadget"
                
            for i, img in enumerate(images):
                # Use a unique lock for every image to prevent duplicates
                unique_lock = random.randint(1, 100000)
                img.image_url = f"https://loremflickr.com/400/400/{search_tag}?lock={unique_lock}"
        
        await db.commit()
        print("Successfully updated image URLs for variety.")

if __name__ == "__main__":
    asyncio.run(update_images())
