import math
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, asc
from sqlalchemy.orm import selectinload
import redis.asyncio as redis
from fastapi import HTTPException, status

from app.models.product import Product
from app.models.category import Category
from app.schemas.product import (
    ProductOut, ProductListItem, ProductListResponse, 
    CategoryOut, SearchResponse
)
from app.cache.keys import (
    get_products_list_key, get_product_detail_key,
    get_categories_all_key, get_search_results_key
)
from app.cache.decorators import cache_response

def map_to_list_item(product: Product) -> dict:
    # Safely extract primary image if loaded
    primary_image = None
    if getattr(product, "images", None):
        primary_image = next((img.image_url for img in product.images if img.is_primary), product.images[0].image_url) if product.images else None

    # We return a dict since we handle JSON caching in our cache wrapper, or Pydantic items
    return {
        "id": product.id,
        "name": product.name,
        "slug": product.slug,
        "price": product.price,
        "mrp": product.mrp,
        "discount_percent": product.discount_percent,
        "rating": product.rating,
        "rating_count": product.rating_count,
        "brand": product.brand,
        "is_active": product.is_active,
        "image_url": primary_image
    }

async def fetch_categories_db(db: AsyncSession) -> List[CategoryOut]:
    result = await db.execute(select(Category).order_by(Category.name))
    categories = result.scalars().all()
    return [CategoryOut.model_validate(c) for c in categories]

async def get_categories(db: AsyncSession, redis_client: redis.Redis) -> List[dict]:
    async def fetch():
        return await fetch_categories_db(db)
    
    key = get_categories_all_key()
    return await cache_response(redis_client, key, fetch, ttl=3600)

async def apply_product_sort(stmt, sort_by: str):
    if sort_by == "price_asc":
        return stmt.order_by(asc(Product.price))
    elif sort_by == "price_desc":
        return stmt.order_by(desc(Product.price))
    elif sort_by == "rating":
        return stmt.order_by(desc(Product.rating))
    elif sort_by == "newest":
        return stmt.order_by(desc(Product.created_at))
    # default generic sort
    return stmt.order_by(desc(Product.created_at))

async def get_products(
    db: AsyncSession, 
    redis_client: redis.Redis, 
    page: int, 
    limit: int, 
    category_slug: Optional[str] = None, 
    sort_by: str = "newest",
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_rating: Optional[float] = None
) -> dict:
    async def fetch():
        offset = (page - 1) * limit
        stmt = select(Product).options(selectinload(Product.images))
        
        # filters
        if category_slug:
            stmt = stmt.join(Category).filter(Category.slug == category_slug)
        if min_price is not None:
            stmt = stmt.filter(Product.price >= min_price)
        if max_price is not None:
            stmt = stmt.filter(Product.price <= max_price)
        if min_rating is not None:
            stmt = stmt.filter(Product.rating >= min_rating)

        stmt = await apply_product_sort(stmt, sort_by)

        # Count total
        count_stmt = select(func.count(Product.id))
        if category_slug:
            count_stmt = count_stmt.join(Category).filter(Category.slug == category_slug)
        if min_price is not None:
            count_stmt = count_stmt.filter(Product.price >= min_price)
        if max_price is not None:
            count_stmt = count_stmt.filter(Product.price <= max_price)
        if min_rating is not None:
            count_stmt = count_stmt.filter(Product.rating >= min_rating)
            
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        # Paginate
        result = await db.execute(stmt.offset(offset).limit(limit))
        products = result.scalars().all()

        items = [map_to_list_item(p) for p in products]
        pages = math.ceil(total / limit) if limit > 0 else 0

        # We construct and return Pydantic schema
        resp = ProductListResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            pages=pages
        )
        return resp
        
    key = get_products_list_key(page, limit, category_slug or "all", f"{sort_by}_{min_price}_{max_price}_{min_rating}")
    return await cache_response(redis_client, key, fetch, ttl=300)

async def get_products_by_category(
    db: AsyncSession, 
    redis_client: redis.Redis, 
    slug: str, 
    page: int, 
    limit: int, 
    sort_by: str,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    min_rating: Optional[float] = None
) -> dict:
    # Just a wrapper around get_products
    return await get_products(db, redis_client, page, limit, slug, sort_by, min_price, max_price, min_rating)

async def get_product_by_id(db: AsyncSession, redis_client: redis.Redis, product_id: str) -> dict:
    async def fetch():
        stmt = select(Product).options(selectinload(Product.images), selectinload(Product.category)).filter(Product.id == product_id)
        result = await db.execute(stmt)
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return ProductOut.model_validate(product)

    key = get_product_detail_key(product_id)
    return await cache_response(redis_client, key, fetch, ttl=600)

async def search_products(db: AsyncSession, redis_client: redis.Redis, query: str, page: int, limit: int) -> dict:
    async def fetch():
        offset = (page - 1) * limit
        search_pattern = f"%{query}%"
        stmt = select(Product).options(selectinload(Product.images)).filter(Product.name.ilike(search_pattern))
        
        # Order searches typically by nearest text match natively or just newest
        stmt = stmt.order_by(desc(Product.created_at))

        count_stmt = select(func.count(Product.id)).filter(Product.name.ilike(search_pattern))
        total_result = await db.execute(count_stmt)
        total = total_result.scalar_one()

        result = await db.execute(stmt.offset(offset).limit(limit))
        products = result.scalars().all()
        
        items = [map_to_list_item(p) for p in products]
        pages = math.ceil(total / limit) if limit > 0 else 0
        
        resp = SearchResponse(
            query=query,
            results=items,
            total=total,
            page=page,
            limit=limit,
            pages=pages
        )
        return resp
        
    key = get_search_results_key(query, page)
    return await cache_response(redis_client, key, fetch, ttl=300)
