import asyncio
import httpx
import uuid
import random
from typing import List, Dict
from sqlalchemy import text, select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.hash import bcrypt

from app.db.session import AsyncSessionLocal
from app.core.config import settings
from app.models.user import User
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage

# Real FlipKart Categories
CATEGORY_LIST = [
    {"name": "Fashion", "slug": "fashion"},
    {"name": "Mobiles", "slug": "mobiles"},
    {"name": "Electronics", "slug": "electronics"},
    {"name": "Beauty", "slug": "beauty"},
    {"name": "Home", "slug": "home"},
    {"name": "Appliances", "slug": "appliances"},
    {"name": "Toys", "slug": "toys"},
    {"name": "Food", "slug": "food"},
    {"name": "Auto", "slug": "auto"},
    {"name": "Furniture", "slug": "furniture"}
]

# Map DummyJSON categories to our core categories
DUMMY_MAP = {
    "smartphones": "mobiles",
    "laptops": "electronics",
    "fragrances": "beauty",
    "skincare": "beauty",
    "groceries": "food",
    "home-decoration": "home",
    "furniture": "furniture",
    "tops": "fashion",
    "womens-dresses": "fashion",
    "womens-shoes": "fashion",
    "mens-shirts": "fashion",
    "mens-shoes": "fashion",
    "mens-watches": "fashion",
    "womens-watches": "fashion",
    "womens-bags": "fashion",
    "womens-jewellery": "fashion",
    "sunglasses": "fashion",
    "automotive": "auto",
    "motorcycle": "auto",
    "lighting": "home"
}

def slugify(text_str: str) -> str:
    return text_str.lower().replace(" ", "-").replace("&", "and").replace(",", "").replace(".", "").replace("'", "")

async def fetch_dummy_products() -> List[Dict]:
    async with httpx.AsyncClient() as client:
        try:
            # Fetch 100 products from DummyJSON
            resp = await client.get("https://dummyjson.com/products?limit=100", timeout=15.0)
            if resp.status_code == 200:
                return resp.json()["products"]
        except Exception as e:
            print(f"Failed fetching DummyJSON: {e}")
    return []

async def seed_database():
    async with AsyncSessionLocal() as db:
        print("Wiping existing data...")
        await db.execute(text("TRUNCATE TABLE orders, order_items, cart_items, shipping_addresses, product_images, products, categories, users CASCADE;"))
        await db.commit()

        # 1. Create Default User
        print("Creating default user...")
        default_user = User(
            id=settings.DEFAULT_USER_ID,
            name="Rahul Sharma",
            email="user@flipkart.com",
            phone="9876543210",
            is_active=True
        )
        db.add(default_user)

        # 2. Create Categories
        category_map = {}
        for config in CATEGORY_LIST:
            cat = Category(
                id=uuid.uuid4(),
                name=config["name"],
                slug=config["slug"],
                image_url=f"https://loremflickr.com/400/400/{config['slug']}?lock=1"
            )
            category_map[config["slug"]] = cat
            db.add(cat)
        
        await db.flush()
        print(f"Created {len(category_map)} core categories.")

        # 3. Fetch Real Data
        dummy_products = await fetch_dummy_products()
        if not dummy_products:
            print("ERROR: Could not fetch DummyJSON data. Aborting.")
            return

        product_models = []
        image_models = []

        # 4. Populate each category with ~100 products
        for slug, cat_model in category_map.items():
            print(f"Populating category: {cat_model.name}...")
            
            # Find base products for this category from DummyJSON
            relevant_bases = [p for p in dummy_products if DUMMY_MAP.get(p["category"]) == slug]
            
            # If no direct match (like Appliances, Toys), use generic bases or generate
            if not relevant_bases:
                relevant_bases = dummy_products[:5] # Fallback to first few

            for i in range(100):
                base = random.choice(relevant_bases)
                
                # Create variations to fulfill the 100 count
                variant_name = f"{base['title']}"
                if i > 0:
                    variant_name += f" - {random.choice(['Pro', 'Max', 'Plus', 'Premium', 'Elite', 'Special Edition'])} {i}"
                
                # Prices in INR (convert loosely from USD)
                price_in_inr = int(base["price"] * 82)
                mrp = int(price_in_inr * (1 + (base["discountPercentage"] / 100) + random.uniform(0.1, 0.2)))
                
                prod_id = uuid.uuid4()
                prod = Product(
                    id=prod_id,
                    name=variant_name,
                    slug=f"{slugify(variant_name)}-{str(uuid.uuid4())[:6]}",
                    description=base["description"],
                    price=price_in_inr,
                    mrp=mrp,
                    discount_percent=round(((mrp - price_in_inr) / mrp) * 100, 2),
                    stock_qty=base.get("stock", 50),
                    category_id=cat_model.id,
                    brand=base.get("brand", "Generic Brand"),
                    rating=base["rating"],
                    rating_count=random.randint(100, 50000),
                    is_active=True
                )
                product_models.append(prod)

                # Images: Use the high-quality image from DummyJSON
                # For variations, we can still use the same high-quality base image or its gallery
                primary_img = base["thumbnail"]
                image_models.append(ProductImage(
                    id=uuid.uuid4(),
                    product_id=prod_id,
                    image_url=primary_img,
                    is_primary=True,
                    display_order=1
                ))
                
                # Add secondary images from the base product's gallery if available
                if "images" in base and len(base["images"]) > 1:
                    for idx, img_url in enumerate(base["images"][1:3]):
                        image_models.append(ProductImage(
                            id=uuid.uuid4(),
                            product_id=prod_id,
                            image_url=img_url,
                            is_primary=False,
                            display_order=idx + 2
                    ))
                else:
                    # Fallback Unsplash image if gallery is small
                    image_models.append(ProductImage(
                        id=uuid.uuid4(),
                        product_id=prod_id,
                        image_url=f"https://loremflickr.com/500/500/{slugify(cat_model.name)}?lock={random.randint(1, 10000)}",
                        is_primary=False,
                        display_order=2
                    ))

            # Partial commit for each category to manage memory
            db.add_all(product_models)
            await db.flush()
            db.add_all(image_models)
            await db.commit()
            
            # Clear lists for next category
            product_models = []
            image_models = []

        print("Database re-seeded successfully with 1000 high-fidelity products!")

if __name__ == "__main__":
    asyncio.run(seed_database())
