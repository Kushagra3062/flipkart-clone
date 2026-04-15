from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base, with_loader_criteria, Session
from sqlalchemy import event
from app.core.config import settings

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

@event.listens_for(Session, "do_orm_execute")
def _add_filtering_criteria(execute_state):
    """
    Transparently filters out inactive products from all Select queries
    unless the 'include_deleted' execution option is True.
    """
    if execute_state.is_select \
            and not getattr(execute_state.statement, "_execution_options", {}).get("include_deleted", False):
        
        # Import internally to avoid circular dependencies when base models are loading
        from app.models.product import Product
        
        execute_state.statement = execute_state.statement.options(
            with_loader_criteria(Product, Product.is_active == True)
        )
