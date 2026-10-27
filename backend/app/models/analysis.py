from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ReviewAnalysis(Base):
    __tablename__ = "review_analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    review_id = Column(String(64), ForeignKey("reviews.id", ondelete="SET NULL"), nullable=True, index=True)
    product_id = Column(String(64), ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    review_text = Column(Text, nullable=False)
    overall_sentiment = Column(String(32), nullable=False)  # Positive, Negative, Neutral, Mixed
    confidence = Column(Float, nullable=True)
    model_name = Column(String(64), default="TF-IDF + Logistic Regression ABSA", nullable=False)
    analysis_timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User", back_populates="analyses")
    product = relationship("Product", back_populates="analyses")
    review = relationship("Review", back_populates="analyses")
    aspect_results = relationship("AspectResult", back_populates="analysis", cascade="all, delete-orphan")

class AspectResult(Base):
    __tablename__ = "aspect_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    analysis_id = Column(Integer, ForeignKey("review_analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    aspect_name = Column(String(64), nullable=False, index=True)
    sentiment = Column(String(32), nullable=False)  # Positive, Negative, Neutral, Mixed
    confidence = Column(Float, nullable=True)
    evidence_text = Column(Text, nullable=True)

    analysis = relationship("ReviewAnalysis", back_populates="aspect_results")
