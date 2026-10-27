from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any, List

class ProductCreate(BaseModel):
    id: str = Field(..., min_length=2, max_length=64)
    name: str = Field(..., min_length=2, max_length=128)
    brand: Optional[str] = None
    category: str = Field(..., min_length=2, max_length=64)
    price: Optional[str] = None
    image_url: Optional[str] = None
    amazon_url: Optional[str] = None
    flipkart_url: Optional[str] = None
    official_url: Optional[str] = None
    description: Optional[str] = None

class ProductOut(BaseModel):
    id: str
    name: str
    brand: Optional[str] = None
    category: str
    price: Optional[str] = None
    image_url: Optional[str] = None
    amazon_url: Optional[str] = None
    flipkart_url: Optional[str] = None
    official_url: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    review_count: int = 0
    average_rating: Optional[float] = None
    sentiment_summary: Dict[str, int] = {}
    top_aspects: List[str] = []

    class Config:
        from_attributes = True

class ProductDetail(ProductOut):
    aspect_breakdown: Dict[str, Dict[str, int]] = {}
