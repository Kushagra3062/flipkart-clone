import requests

try:
    res = requests.get("http://127.0.0.1:8000/profile/ping")
    print(f"Status (no api/v1): {res.status_code}")
    res2 = requests.get("http://127.0.0.1:8000/api/v1/profile/ping")
    print(f"Status (with api/v1): {res2.status_code}")
except Exception as e:
    print(f"Error: {e}")
