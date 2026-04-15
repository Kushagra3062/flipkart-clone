from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from typing import Optional
import uuid

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.shipping_address import ShippingAddress
from app.models.wishlist import Wishlist
from app.models.product import Product
from app.schemas.order import ShippingAddressIn as AddressCreate, ShippingAddressOut as AddressOut

router = APIRouter()

# --- Schemas ---
class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None

# (AddressCreate and AddressOut are now imported from schemas.order)


# --- Profile Endpoints ---

@router.get("/me")
async def get_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "gender": current_user.gender,
        "avatar_url": current_user.avatar_url,
        "is_verified": current_user.is_verified,
    }


@router.put("/me")
async def update_profile(
    data: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.name is not None:
        current_user.name = data.name
    if data.gender is not None:
        current_user.gender = data.gender
    await db.commit()
    await db.refresh(current_user)
    return {"msg": "Profile updated", "name": current_user.name, "gender": current_user.gender}


# --- Address Endpoints ---

@router.get("/addresses")
async def get_addresses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ShippingAddress)
        .where(ShippingAddress.user_id == current_user.id)
        .order_by(ShippingAddress.is_default.desc())
    )
    addresses = result.scalars().all()
    return [
        {
            "id": str(a.id),
            "full_name": a.full_name,
            "phone": a.phone,
            "address_type": a.address_type,
            "address_line1": a.address_line1,
            "address_line2": a.address_line2,
            "city": a.city,
            "state": a.state,
            "pincode": a.pincode,
            "latitude": a.latitude,
            "longitude": a.longitude,
            "is_default": a.is_default,
        }
        for a in addresses
    ]


@router.post("/addresses")
async def add_address(
    data: AddressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If this is default, un-default all others
    if data.is_default:
        existing = await db.execute(
            select(ShippingAddress).where(ShippingAddress.user_id == current_user.id)
        )
        for addr in existing.scalars().all():
            addr.is_default = False

    # If first address, auto-set as default
    count_result = await db.execute(
        select(ShippingAddress).where(ShippingAddress.user_id == current_user.id)
    )
    is_first = len(count_result.scalars().all()) == 0

    new_addr = ShippingAddress(
        user_id=current_user.id,
        full_name=data.full_name,
        phone=data.phone,
        address_type=data.address_type,
        address_line1=data.address_line1,
        address_line2=data.address_line2,
        city=data.city,
        state=data.state,
        pincode=data.pincode,
        latitude=data.latitude,
        longitude=data.longitude,
        is_default=data.is_default or is_first,
    )
    db.add(new_addr)
    await db.commit()
    await db.refresh(new_addr)
    return {"id": str(new_addr.id), "msg": "Address added"}


@router.put("/addresses/{address_id}")
async def update_address(
    address_id: uuid.UUID,
    data: AddressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ShippingAddress).where(
            ShippingAddress.id == address_id,
            ShippingAddress.user_id == current_user.id
        )
    )
    addr = result.scalar_one_or_none()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found")

    if data.is_default:
        existing = await db.execute(
            select(ShippingAddress).where(ShippingAddress.user_id == current_user.id)
        )
        for a in existing.scalars().all():
            a.is_default = False

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(addr, field, value)
    await db.commit()
    return {"msg": "Address updated"}


@router.delete("/addresses/{address_id}")
async def delete_address(
    address_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(ShippingAddress).where(
            ShippingAddress.id == address_id,
            ShippingAddress.user_id == current_user.id
        )
    )
    addr = result.scalar_one_or_none()
    if not addr:
        raise HTTPException(status_code=404, detail="Address not found")
    try:
        await db.delete(addr)
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete address because it is linked to an existing order. You can edit it instead."
        )
    return {"msg": "Address deleted"}


@router.patch("/addresses/{address_id}/set-default")
async def set_default_address(
    address_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing = await db.execute(
        select(ShippingAddress).where(ShippingAddress.user_id == current_user.id)
    )
    for a in existing.scalars().all():
        a.is_default = str(a.id) == str(address_id)
    await db.commit()
    return {"msg": "Default address updated"}


# --- Wishlist Endpoints ---

@router.get("/wishlist")
async def get_wishlist(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Product)
        .where(Product.id.in_(
            select(Wishlist.product_id).where(Wishlist.user_id == current_user.id)
        ))
        .options(selectinload(Product.images))
    )
    products = result.scalars().all()
    return [
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

@router.post("/wishlist/{product_id}")
async def add_to_wishlist(
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if exists
    existing = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == current_user.id,
            Wishlist.product_id == product_id
        )
    )
    if existing.scalar_one_or_none():
        return {"msg": "Already in wishlist"}
    
    new_wish = Wishlist(user_id=current_user.id, product_id=product_id)
    db.add(new_wish)
    await db.commit()
    return {"msg": "Added to wishlist"}

@router.delete("/wishlist/{product_id}")
async def remove_from_wishlist(
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Wishlist).where(
            Wishlist.user_id == current_user.id,
            Wishlist.product_id == product_id
        )
    )
    wish = result.scalar_one_or_none()
    if wish:
        await db.delete(wish)
        await db.commit()
    return {"msg": "Removed from wishlist"}


# --- Account Management ---

@router.post("/deactivate")
async def deactivate_account(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.is_active = False
    await db.commit()
    return {"msg": "Account deactivated"}

@router.delete("/delete-account")
async def delete_account(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await db.delete(current_user)
    await db.commit()
    return {"msg": "Account deleted permanently"}
