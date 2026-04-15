import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzY3MDA0MDgsInN1YiI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCJ9.Hlkgtomt2XngvXmvba5AsG8Zl" # Truncated from my output, I should use the real one but I'll generate it in the script to be safe
BASE_URL = "http://localhost:8000/api/v1"

def test():
    # Generate token locally in script to match server's logic
    import sys
    import os
    sys.path.append(os.getcwd())
    from app.core.security import create_access_token
    token = create_access_token("00000000-0000-0000-0000-000000000000")
    
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Testing with token: {token[:20]}...")
    
    try:
        res = requests.get(f"{BASE_URL}/profile/wishlist", headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Body: {res.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
