import asyncio
import sys
import os
from sqlalchemy import inspect
from app.db.session import engine

async def inspect_schema():
    async with engine.connect() as conn:
        def get_cols(connection):
            inst = inspect(connection)
            return inst.get_columns("wishlist")
        
        columns = await conn.run_sync(get_cols)
        print("Columns in 'wishlist' table:")
        for col in columns:
            print(f"- {col['name']} ({col['type']})")

if __name__ == "__main__":
    asyncio.run(inspect_schema())
