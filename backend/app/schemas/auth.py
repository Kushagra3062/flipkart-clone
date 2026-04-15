from pydantic import BaseModel, EmailStr, Field
from pydantic.types import UUID4
from typing import Optional

# --- Token Models ---
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

# --- User Auth Models ---
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    phone: Optional[str] = Field(None, pattern=r"^\d{10}$")

class UserLogin(BaseModel):
    identifier: str # can be email or phone
    password: str

class OTPRequest(BaseModel):
    identifier: str # email or phone

class OTPVerify(BaseModel):
    identifier: str
    otp_code: str = Field(..., pattern=r"^\d{6}$")

class ResetPasswordRequest(BaseModel):
    identifier: str
    otp_code: str = Field(..., pattern=r"^\d{6}$")
    new_password: str = Field(..., min_length=8)

class GoogleAuthRequest(BaseModel):
    id_token: str

# --- Internal Return Identity ---
class UserIdentityOut(BaseModel):
    id: UUID4
    email: EmailStr
    name: str
    phone: Optional[str] = None
    is_verified: bool
    phone_verified: bool
    
    class Config:
        from_attributes = True
