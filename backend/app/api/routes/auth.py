from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as redis

from app.core.dependencies import get_db, get_cache
from app.schemas.auth import UserCreate, UserLogin, Token, OTPRequest, OTPVerify, UserIdentityOut, GoogleAuthRequest, ResetPasswordRequest
from app.services.auth_service import auth_service
from app.models.user import User

router = APIRouter()

@router.post("/signup", response_model=Token, summary="Email Signup")
async def signup(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    return await auth_service.signup(db, user_in)

@router.post("/login", response_model=Token, summary="Email Login")
async def login(
    user_in: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    return await auth_service.login(db, user_in)

@router.post("/send-otp", summary="Generate OTP (Email/Phone)")
async def send_otp(
    otp_req: OTPRequest,
    redis_client: redis.Redis = Depends(get_cache)
):
    return await auth_service.send_otp(redis_client, otp_req.identifier)

@router.post("/verify-otp", summary="Verify OTP (Email/Phone)")
async def verify_otp(
    verify_req: OTPVerify,
    only_verify: bool = False,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_cache)
):
    return await auth_service.verify_otp(db, redis_client, verify_req.identifier, verify_req.otp_code, only_verify)

@router.post("/reset-password", summary="Reset Password with OTP")
async def reset_password(
    reset_req: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_cache)
):
    return await auth_service.reset_password(db, redis_client, reset_req.identifier, reset_req.otp_code, reset_req.new_password)

@router.post("/google", response_model=Token, summary="Google Login Callback")
async def google_login(
    req: GoogleAuthRequest,
    db: AsyncSession = Depends(get_db)
):
    return await auth_service.google_login(db, req.id_token)
