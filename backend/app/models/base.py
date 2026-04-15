from sqlalchemy import Column, DateTime, func
from app.db.session import Base
import uuid
import datetime

class TimestampMixin:
    """Mixin for models that need created/updated timestamps."""
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), default=func.now(), server_default=func.now())

