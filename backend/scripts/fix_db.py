import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def main():
    engine = create_async_engine(str(settings.DATABASE_URL))
    async with engine.begin() as conn:
        await conn.execute(text("UPDATE product_images SET image_url = REPLACE(image_url, 'source.unsplash.com/400x400/?', 'loremflickr.com/400/400/')"))
        await conn.execute(text("UPDATE categories SET image_url = REPLACE(image_url, 'source.unsplash.com/400x400/?', 'loremflickr.com/400/400/')"))
    await engine.dispose()
    print('Database images migrated successfully!')

asyncio.run(main())
