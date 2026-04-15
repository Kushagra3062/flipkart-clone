import os
import sys
import uuid
from jose import jwt, JWTError

# Add current dir to path to import app correctly
sys.path.append(os.getcwd())

from app.core.config import settings
from app.core.security import create_access_token, ALGORITHM

def test_token():
    user_id = uuid.uuid4()
    print(f"Testing with user_id: {user_id}")
    print(f"SECRET_KEY: {settings.SECRET_KEY}")
    print(f"ALGORITHM: {ALGORITHM}")
    
    token = create_access_token(user_id)
    print(f"Generated token: {token[:20]}...")
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Decoded payload: {payload}")
        if str(user_id) == payload.get("sub"):
            print("SUCCESS: Token validated correctly!")
        else:
            print(f"FAILURE: 'sub' mismatch. Expected {user_id}, got {payload.get('sub')}")
    except JWTError as e:
        print(f"FAILURE: JWT Decode Error: {e}")
    except Exception as e:
        print(f"FAILURE: Unexpected Error: {e}")

if __name__ == "__main__":
    test_token()
