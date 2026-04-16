from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.dependencies import get_db, get_current_user
from app.models.coupon import Coupon as CouponModel
from app.models.order import Order as OrderModel
from app.models.user import User as UserModel
from app.schemas.coupon import Coupon
from datetime import datetime

router = APIRouter()

import random
import string
import uuid
from datetime import timedelta

@router.get("/", response_model=List[Coupon])
async def get_coupons(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Fetch all active coupons not yet used by the current user, auto-refilling if necessary."""
    # Find all coupon codes used by this user
    used_stmt = select(OrderModel.coupon_code).where(
        OrderModel.user_id == current_user.id,
        OrderModel.coupon_code.isnot(None)
    )
    used_res = await db.execute(used_stmt)
    used_codes = [code for code in used_res.scalars().all()]

    # Fetch active coupons that are not in the used_codes list
    stmt = select(CouponModel).where(
        CouponModel.is_active == True,
        CouponModel.expiry_date > datetime.utcnow()
    )
    if used_codes:
        stmt = stmt.where(CouponModel.code.not_in(used_codes))
        
    result = await db.execute(stmt)
    coupons = result.scalars().all()
    
    # Auto-refill logic to maintain infinite pipeline (min 5 unused coupons)
    if len(coupons) < 5:
        to_create = 5 - len(coupons)
        new_coupons = []
        for _ in range(to_create):
            code_str = "FLIP" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
            is_percentage = random.choice([True, False])
            
            if is_percentage:
                val = random.choice([5.0, 10.0, 15.0, 20.0])
                desc = f"{int(val)}% off on select collections"
                dtype = "percentage"
            else:
                val = random.choice([100.0, 200.0, 500.0])
                desc = f"Flat ₹{int(val)} off on your order"
                dtype = "fixed"
                
            c = CouponModel(
                id=uuid.uuid4(),
                code=code_str,
                description=desc,
                discount_value=val,
                discount_type=dtype,
                min_order_value=random.choice([0.0, 499.0, 999.0]),
                expiry_date=datetime.utcnow() + timedelta(days=random.randint(10, 100))
            )
            db.add(c)
            new_coupons.append(c)
        await db.commit()
        # Add generated coupons to our list to be returned immediately
        for nc in new_coupons:
            await db.refresh(nc)
            coupons.append(nc)
            
    return coupons

@router.post("/validate")
async def validate_coupon(
    code: str,
    cart_total: float,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Validate a coupon code and return calculate discount."""
    # Check if used
    used_stmt = select(OrderModel).where(OrderModel.user_id == current_user.id, OrderModel.coupon_code == code)
    used_res = await db.execute(used_stmt)
    if used_res.scalars().first():
        raise HTTPException(status_code=400, detail="You have already used this coupon code.")
        
    coupon_stmt = select(CouponModel).where(
        CouponModel.code == code,
        CouponModel.is_active == True,
        CouponModel.expiry_date > datetime.utcnow()
    )
    coupon_res = await db.execute(coupon_stmt)
    coupon = coupon_res.scalars().first()
    
    if not coupon:
        raise HTTPException(status_code=400, detail="Invalid or expired coupon code.")
        
    if cart_total < coupon.min_order_value:
        raise HTTPException(status_code=400, detail=f"Minimum order value of ₹{coupon.min_order_value} required. Add more items to cart!")
        
    discount = 0
    if coupon.discount_type == "percentage":
        discount = float(cart_total) * float(coupon.discount_value) / 100.0
    else:
        discount = float(coupon.discount_value)
        
    return {
        "valid": True,
        "code": coupon.code,
        "discount_amount": round(discount, 2),
        "message": f"Awesome! Coupon {coupon.code} applied successfully."
    }
