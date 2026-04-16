from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

class GiftCardBase(BaseModel):
    card_number: str
    pin: str
    balance: float
    expiry_date: Optional[datetime] = None
    is_active: bool = True

class GiftCardCreate(GiftCardBase):
    pass

class GiftCard(GiftCardBase):
    id: UUID
    user_id: Optional[UUID] = None
    
    class Config:
        from_attributes = True
