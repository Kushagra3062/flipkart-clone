import json
import logging
from typing import Callable, Any, Awaitable
from pydantic import BaseModel
import redis.asyncio as redis

logger = logging.getLogger(__name__)

async def cache_response(
    redis_client: redis.Redis,
    key: str,
    coroutine: Callable[[], Awaitable[Any]],
    ttl: int = 300
) -> Any:
    """
    Checks cache for the specified key. If found, parses JSON and returns.
    If missing, runs the awaitable coroutine, caches the result (dumping to JSON), and sets TTL.
    """
    try:
        cached_data = await redis_client.get(key)
        if cached_data:
            return json.loads(cached_data)
    except Exception as e:
        logger.error(f"Redis cache GET error for key {key}: {e}")
        # Proceed to execute coroutine if cache fails

    # Cache miss or error, fetch fresh data
    result = await coroutine()

    # Pre-process the result to JSON serializable dicts if they are Pydantic models
    if isinstance(result, BaseModel):
        data_to_cache = result.model_dump(mode="json")
    # if it's a list, check if elements are Pydantic models
    elif isinstance(result, list) and len(result) > 0 and isinstance(result[0], BaseModel):
        data_to_cache = [item.model_dump(mode="json") for item in result]
    else:
        # Assuming dictionaries or primitives
        data_to_cache = result

    try:
        await redis_client.setex(key, ttl, json.dumps(data_to_cache))
    except Exception as e:
        logger.error(f"Redis cache SET error for key {key}: {e}")

    # Return the raw result data structure so fastapi dependency injection works identically 
    # to a cache hit (which currently returns parsed dicts). 
    # Wait, FastAPI automatically JSON encodes responses, so passing dicts back is fine!
    return data_to_cache
