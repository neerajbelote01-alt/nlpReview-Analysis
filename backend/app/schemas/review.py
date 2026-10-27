from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

class ReviewCreate(BaseModel):
    product_id: str
    review_text: str = Field(..., min_length=3)
    rating: Optional[float] = Field(None, ge=1.0, le=5.0)
    source_type: str = "synthetic_demo"

class ReviewOut(BaseModel):
    id: str
    product_id: str
    product_name: Optional[str] = None
    review_text: str
    rating: Optional[float] = None
    source_type: str
    created_at: datetime
    overall_sentiment: Optional[str] = None
    aspect_count: int = 0

    class Config:
        from_attributes = True
