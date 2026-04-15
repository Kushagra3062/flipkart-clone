from pydantic import BaseModel, ConfigDict
from pydantic.types import UUID4
from decimal import Decimal
from typing import List, Optional
from datetime import datetime

class CategoryOut(BaseModel):
    id: UUID4
    name: str
    slug: str
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ProductImageOut(BaseModel):
    id: UUID4
    image_url: str
    is_primary: bool
    display_order: int

    model_config = ConfigDict(from_attributes=True)

class ProductListItem(BaseModel):
    id: UUID4
    name: str
    slug: str
    price: Decimal
    mrp: Decimal
    discount_percent: Optional[Decimal] = None
    rating: Decimal
    rating_count: int
    brand: Optional[str] = None
    is_active: bool
    image_url: Optional[str] = None # Deduced from primary image if available

    model_config = ConfigDict(from_attributes=True)

class ProductOut(BaseModel):
    id: UUID4
    name: str
    slug: str
    description: Optional[str] = None
    price: Decimal
    mrp: Decimal
    discount_percent: Optional[Decimal] = None
    stock_qty: int
    brand: Optional[str] = None
    rating: Decimal
    rating_count: int
    is_active: bool
    category_id: UUID4
    created_at: datetime
    images: List[ProductImageOut] = []

    model_config = ConfigDict(from_attributes=True)

class ProductListResponse(BaseModel):
    items: List[ProductListItem]
    total: int
    page: int
    limit: int
    pages: int

class SearchResponse(BaseModel):
    query: str
    results: List[ProductListItem]
    total: int
    page: int
    limit: int
    pages: int
