from app.api.routes.products import router as products_router
from app.api.routes.cart import router as cart_router
from app.api.routes.orders import router as orders_router
from app.api.routes.orders import address_router as address_router
from app.api.routes.auth import router as auth_router
from app.api.routes.user_profile import router as profile_router

__all__ = ["products_router", "cart_router", "orders_router", "address_router", "auth_router", "profile_router"]
