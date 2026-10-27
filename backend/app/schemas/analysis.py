from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

class AspectResultOut(BaseModel):
    id: Optional[int] = None
    aspect_name: str
    sentiment: str  # Positive, Negative, Neutral, Mixed
    confidence: Optional[float] = None
    evidence_text: Optional[str] = None

    class Config:
        from_attributes = True

class AnalyzeRequest(BaseModel):
    review_text: str = Field(..., min_length=2, max_length=5000)
    product_id: Optional[str] = None
    save_to_history: bool = True

class AnalysisOut(BaseModel):
    id: Optional[int] = None
    review_id: Optional[str] = None
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    review_text: str
    overall_sentiment: str
    confidence: Optional[float] = None
    model_name: str
    analysis_timestamp: Optional[datetime] = None
    aspect_results: List[AspectResultOut] = []

    class Config:
        from_attributes = True

class BulkAnalyzeResponse(BaseModel):
    total_processed: int
    positive_count: int
    negative_count: int
    neutral_count: int
    mixed_count: int
    results: List[AnalysisOut]
