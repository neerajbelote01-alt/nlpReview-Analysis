from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False, unique=True, index=True)
    brand = Column(String(64), nullable=True, index=True)
    category = Column(String(64), nullable=False, index=True)
    price = Column(String(32), nullable=True)
    image_url = Column(String(255), nullable=True)
    amazon_url = Column(String(512), nullable=True)
    flipkart_url = Column(String(512), nullable=True)
    official_url = Column(String(512), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
    analyses = relationship("ReviewAnalysis", back_populates="product")
