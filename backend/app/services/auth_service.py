import secrets
import time
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
import redis.asyncio as redis
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, Token
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token

# --- In-memory OTP fallback (used when Redis is unavailable) ---
_otp_store: dict[str, tuple[str, float]] = {}  # key -> (otp_code, expires_at)
OTP_TTL = 300  # 5 minutes

async def _set_otp(redis_client: redis.Redis, key: str, value: str) -> None:
    try:
        await redis_client.setex(key, OTP_TTL, value)
    except Exception:
        _otp_store[key] = (value, time.time() + OTP_TTL)

async def _get_otp(redis_client: redis.Redis, key: str) -> str | None:
    try:
        result = await redis_client.get(key)
        return result.decode("utf-8") if result else None
    except Exception:
        entry = _otp_store.get(key)
        if entry and time.time() < entry[1]:
            return entry[0]
        return None

async def _del_otp(redis_client: redis.Redis, key: str) -> None:
    try:
        await redis_client.delete(key)
    except Exception:
        _otp_store.pop(key, None)

class AuthService:
    
    @staticmethod
    async def signup(db: AsyncSession, user_in: UserCreate) -> Token:
        # Check duplicate constraints (Email or Phone)
        stmt = select(User).filter((User.email == user_in.email) | (User.phone == user_in.phone))
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if user:
            if user.hashed_password:
                raise HTTPException(status_code=400, detail="User already exists")
            # If user exists but has no password (placeholder from OTP login), update it
            user.name = user_in.name
            user.email = user_in.email
            user.phone = user_in.phone
            user.hashed_password = get_password_hash(user_in.password)
            user.is_verified = True
            user.phone_verified = True
        else:
            user = User(
                email=user_in.email,
                name=user_in.name,
                phone=user_in.phone,
                hashed_password=get_password_hash(user_in.password),
                is_verified=True, # Assuming OTP was already verified on frontend
                phone_verified=True
            )
            db.add(user)
        
        await db.commit()
        await db.refresh(user)

        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
            user_id=str(user.id)
        )

    @staticmethod
    async def login(db: AsyncSession, user_in: UserLogin) -> Token:
        # Check against both email and phone
        stmt = select(User).filter(
            (User.email == user_in.identifier) | (User.phone == user_in.identifier)
        )
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user or not user.hashed_password:
            raise HTTPException(status_code=401, detail="Incorrect identifier or password")
            
        if not verify_password(user_in.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect identifier or password")

        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
            user_id=str(user.id)
        )

    @staticmethod
    async def send_otp(redis_client: redis.Redis, identifier: str) -> dict:
        from app.core.config import settings
        import asyncio

        is_phone = identifier.replace("+", "").isdigit() and len(identifier.replace("+", "")) >= 10

        if is_phone:
            # --- Twilio Verify: Send SMS OTP ---
            if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_VERIFY_SERVICE_SID:
                try:
                    from twilio.rest import Client
                    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
                    phone_e164 = f"+91{identifier}" if not identifier.startswith("+") else identifier
                    await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: client.verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID)
                            .verifications.create(to=phone_e164, channel="sms")
                    )
                    return {"msg": f"OTP sent to {identifier} via SMS"}
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"Twilio error: {str(e)}")
        else:
            # --- SendGrid: Send Email OTP ---
            if settings.SENDGRID_API_KEY and settings.SENDGRID_FROM_EMAIL:
                import secrets as sec
                otp_code = "".join([str(sec.randbelow(10)) for _ in range(6)])
                cache_key = f"otp:{identifier}"
                await _set_otp(redis_client, cache_key, otp_code)

                try:
                    from sendgrid import SendGridAPIClient
                    from sendgrid.helpers.mail import Mail
                    message = Mail(
                        from_email=settings.SENDGRID_FROM_EMAIL,
                        to_emails=identifier,
                        subject="Your Flipkart Clone OTP",
                        html_content=f"""
                        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0e0;border-radius:8px">
                            <h2 style="color:#2874f0">Flipkart Clone</h2>
                            <p style="font-size:15px;color:#333">Your One-Time Password is:</p>
                            <div style="font-size:36px;font-weight:bold;letter-spacing:12px;color:#2874f0;padding:16px 0">{otp_code}</div>
                            <p style="font-size:13px;color:#888">Valid for 5 minutes. Do not share this code.</p>
                        </div>
                        """
                    )
                    sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
                    await asyncio.get_event_loop().run_in_executor(None, sg.send, message)
                    return {"msg": f"OTP sent to {identifier} via email"}
                except Exception as e:
                    raise HTTPException(status_code=500, detail=f"SendGrid error: {str(e)}")

        # --- Fallback: in-memory OTP for development ---
        otp_code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
        cache_key = f"otp:{identifier}"
        await _set_otp(redis_client, cache_key, otp_code)
        return {"msg": f"OTP sent to {identifier} successfully", "dummy_code_for_testing": otp_code}

    @staticmethod
    async def verify_otp_phone(identifier: str, otp_code: str) -> bool:
        """Verify phone OTP via Twilio Verify (returns True if valid)."""
        from app.core.config import settings
        import asyncio
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_VERIFY_SERVICE_SID:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            phone_e164 = f"+91{identifier}" if not identifier.startswith("+") else identifier
            result = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: client.verify.v2.services(settings.TWILIO_VERIFY_SERVICE_SID)
                    .verification_checks.create(to=phone_e164, code=otp_code)
            )
            return result.status == "approved"
        return False  # Fall through to local verification

    @staticmethod
    async def verify_otp(db: AsyncSession, redis_client: redis.Redis, identifier: str, otp_code: str, only_verify: bool = False) -> dict:
        cache_key = f"otp:{identifier}"
        is_phone = identifier.replace("+", "").isdigit() and len(identifier.replace("+", "")) >= 10

        if is_phone:
            # Try Twilio Verify first for phone numbers
            twilio_valid = await auth_service.verify_otp_phone(identifier, otp_code)
            if not twilio_valid:
                # Fallback to local cache (dev mode)
                stored_otp = await _get_otp(redis_client, cache_key)
                if not stored_otp or stored_otp != otp_code:
                    raise HTTPException(status_code=400, detail="Invalid or expired OTP")
                await _del_otp(redis_client, cache_key)
        else:
            # Email OTP always uses local cache (generated by send_otp)
            stored_otp = await _get_otp(redis_client, cache_key)
            if not stored_otp or stored_otp != otp_code:
                raise HTTPException(status_code=400, detail="Invalid or expired OTP")
            await _del_otp(redis_client, cache_key)

        if only_verify:
            return {"msg": "OTP verified successfully"}

        # Auto-login flow for phone-only OTP login
        stmt = select(User).filter((User.phone == identifier) | (User.email == identifier))
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()

        if not user:
            is_phone = identifier.isdigit() and len(identifier) == 10
            user = User(
                email=f"{identifier}@flipkart-clone.app" if is_phone else identifier,
                name=f"User {identifier}",
                phone=identifier if is_phone else None,
                phone_verified=is_phone,
                is_verified=True
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        else:
            if identifier == user.phone:
                user.phone_verified = True
            if identifier == user.email:
                user.is_verified = True
            await db.commit()

        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
            user_id=str(user.id)
        )

    @staticmethod
    async def reset_password(db: AsyncSession, redis_client: redis.Redis, identifier: str, otp_code: str, new_password: str) -> dict:
        cache_key = f"otp:{identifier}"
        stored_otp = await _get_otp(redis_client, cache_key)
        
        if not stored_otp or stored_otp != otp_code:
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
            
        await _del_otp(redis_client, cache_key)

        stmt = select(User).filter((User.email == identifier) | (User.phone == identifier))
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.hashed_password = get_password_hash(new_password)
        if identifier == user.email:
            user.is_verified = True
        if identifier == user.phone:
            user.phone_verified = True
            
        await db.commit()
        return {"msg": "Password reset successfully"}

    @staticmethod
    async def google_login(db: AsyncSession, token: str) -> Token:
        from app.core.config import settings
        client_id = getattr(settings, "GOOGLE_CLIENT_ID", None)
        try:
            # Secure OAuth2 Validation reaching directly out to Google's public keys
            try:
                idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)
            except Exception as e:
                print(f"GOOGLE AUTH ERROR: {str(e)}")
                print(f"CLIENT_ID USED: '{client_id}'")
                raise
            
            email = idinfo.get("email")
            name = idinfo.get("name", "Google User")
            picture = idinfo.get("picture", None)

            if not email:
                raise HTTPException(status_code=400, detail="Google token missing email")

            stmt = select(User).filter(User.email == email)
            res = await db.execute(stmt)
            user = res.scalar_one_or_none()

            # Create transient identity if completely missing
            if not user:
                user = User(
                    email=email,
                    name=name,
                    avatar_url=picture,
                    is_verified=True,
                    phone_verified=False
                )
                db.add(user)
                await db.commit()
                await db.refresh(user)
            else:
                # Update avatar cleanly
                if picture and user.avatar_url != picture:
                    user.avatar_url = picture
                    await db.commit()

            return Token(
                access_token=create_access_token(user.id),
                refresh_token=create_refresh_token(user.id),
                user_id=str(user.id)
            )
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid Google identity token")

auth_service = AuthService()
