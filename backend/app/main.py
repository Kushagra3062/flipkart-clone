from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import products, cart, orders, auth
from app.api.routes.user_profile import router as profile_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Flipkart Clone API Backend",
    version="1.0.0"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.ALLOWED_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Flipkart Clone API"}

app.include_router(products.router, prefix="/api/v1")
app.include_router(cart.router, prefix="/api/v1/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(orders.address_router, prefix="/api/v1/addresses", tags=["Addresses"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(profile_router, prefix="/api/v1/profile", tags=["Profile"])
