from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis
from typing import List, Optional

from app.core.dependencies import get_db, get_cache
from app.services import product_service
from app.schemas.product import ProductListResponse, ProductOut, CategoryOut, SearchResponse

router = APIRouter()

@router.get("/products", response_model=ProductListResponse, summary="Get paginated products list")
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("newest", pattern="^(price_asc|price_desc|rating|newest)$"),
    min_price: Optional[int] = Query(None, ge=0),
    max_price: Optional[int] = Query(None, ge=0),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_cache)
):
    return await product_service.get_products(
        db, redis_client, page, limit, 
        sort_by=sort_by, min_price=min_price, max_price=max_price, min_rating=min_rating
    )

@router.get("/products/search", response_model=SearchResponse, summary="Search products")
async def search_products(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_cache)
):
    return await product_service.search_products(db, redis_client, q, page, limit)

@router.get("/products/{product_id}", response_model=ProductOut, summary="Get product details")
async def get_product(
    product_id: str = Path(...),
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_cache)
):
    return await product_service.get_product_by_id(db, redis_client, product_id)

@router.get("/categories", response_model=List[CategoryOut], summary="List all categories")
async def get_categories(
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_cache)
):
    return await product_service.get_categories(db, redis_client)

@router.get("/categories/{slug}/products", response_model=ProductListResponse, summary="Get products by category")
async def get_products_by_category(
    slug: str = Path(...),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("newest", pattern="^(price_asc|price_desc|rating|newest)$"),
    min_price: Optional[int] = Query(None, ge=0),
    max_price: Optional[int] = Query(None, ge=0),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_cache)
):
    return await product_service.get_products_by_category(
        db, redis_client, slug, page, limit, sort_by, 
        min_price=min_price, max_price=max_price, min_rating=min_rating
    )
