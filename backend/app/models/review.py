from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(64), primary_key=True, index=True)
    product_id = Column(String(64), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    review_text = Column(Text, nullable=False)
    rating = Column(Float, nullable=True)
    source_type = Column(String(32), default="synthetic_demo", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    product = relationship("Product", back_populates="reviews")
    analyses = relationship("ReviewAnalysis", back_populates="review", cascade="all, delete-orphan")
