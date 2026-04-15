import redis.asyncio as redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Redis Connection Pool
redis_pool = redis.ConnectionPool.from_url(
    settings.REDIS_URL,
    decode_responses=True
)

async def get_redis_client() -> redis.Redis:
    # Yield a client from the connection pool
    client = redis.Redis(connection_pool=redis_pool)
    yield client
    # Do NOT eagerly close the client in a finally block to allow proper pooling reuse

