import requests

try:
    res = requests.get("http://127.0.0.1:8000/api/v1/products?limit=1")
    print(f"Status: {res.status_code}")
except Exception as e:
    print(f"Error: {e}")
