from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.dependencies import get_db, get_current_user
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/status")
async def get_plus_status(
    current_user: UserModel = Depends(get_current_user)
):
    """Get SuperCoins and Plus membership status."""
    return {
        "supercoins": current_user.supercoins,
        "is_plus_member": current_user.is_plus_member,
        "benefits": [
            "Free Delivery on Plus items",
            "Early access to sales",
            "Exclusive rewards with SuperCoins"
        ]
    }
