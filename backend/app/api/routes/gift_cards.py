from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.dependencies import get_db, get_current_user
from app.models.gift_card import GiftCard as GiftCardModel
from app.models.user import User as UserModel
from app.schemas.gift_card import GiftCard
import uuid

router = APIRouter()

@router.get("/me", response_model=List[GiftCard])
async def get_my_gift_cards(
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Fetch gift cards linked to the user."""
    stmt = select(GiftCardModel).where(GiftCardModel.user_id == current_user.id)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/apply")
async def apply_gift_card(
    card_number: str,
    pin: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """Link a gift card to the user account."""
    stmt = select(GiftCardModel).where(
        GiftCardModel.card_number == card_number,
        GiftCardModel.pin == pin,
        GiftCardModel.is_active == True
    )
    result = await db.execute(stmt)
    card = result.scalar_one_or_none()
    
    if not card:
        raise HTTPException(status_code=404, detail="Invalid Gift Card or PIN")
    
    if card.user_id:
        raise HTTPException(status_code=400, detail="Gift Card already linked to an account")
    
    card.user_id = current_user.id
    await db.commit()
    return {"message": "Gift Card successfully linked", "balance": card.balance}
