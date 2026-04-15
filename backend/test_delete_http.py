import asyncio
import httpx

async def test_delete():
    # Use the ID I found earlier or any valid one
    # Note: User Kushagra ID was found earlier.
    # I'll first get an address ID for Kushagra again to be sure.
    url = "http://localhost:8000/api/v1/profile/addresses"
    headers = {
        "Authorization": "Bearer <TOKEN_HERE>" # I'll need a token or just skip auth for testing if I can?
    }
    # Actually, I'll just run it against the DB to see if the logic works.
    # But for Network Error, I need to test via HTTP.
    
    async with httpx.AsyncClient() as client:
        try:
            # Try a random ID first to see if it reaches the server
            res = await client.delete("http://localhost:8000/api/v1/profile/addresses/00000000-0000-0000-0000-000000000000")
            print(f"Status: {res.status_code}")
            print(f"Body: {res.text}")
        except Exception as e:
            print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_delete())
