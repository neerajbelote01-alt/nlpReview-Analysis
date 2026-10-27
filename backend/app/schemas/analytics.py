from pydantic import BaseModel
from typing import Dict, List, Any, Optional

class SentimentDistribution(BaseModel):
    positive: int = 0
    negative: int = 0
    neutral: int = 0
    mixed: int = 0

class AspectSummaryItem(BaseModel):
    aspect_name: str
    total_mentions: int
    positive_count: int
    negative_count: int
    neutral_count: int
    mixed_count: int
    net_sentiment_score: float  # (pos - neg) / total

class ProductSentimentItem(BaseModel):
    product_id: str
    product_name: str
    total_reviews: int
    average_rating: Optional[float] = None
    positive: int = 0
    negative: int = 0
    neutral: int = 0
    mixed: int = 0

class DashboardStats(BaseModel):
    total_products: int
    total_reviews: int
    total_analyses: int
    sentiment_distribution: SentimentDistribution
    most_frequent_aspects: List[AspectSummaryItem]
    top_positive_aspects: List[AspectSummaryItem]
    top_negative_aspects: List[AspectSummaryItem]
    product_sentiment_comparison: List[ProductSentimentItem]
    recent_activity: List[Dict[str, Any]]

class ComplaintItem(BaseModel):
    aspect_name: str
    problem_count: int
    percentage: float
    affected_products: List[str]
    representative_excerpts: List[Dict[str, str]]
