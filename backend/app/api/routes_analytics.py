from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db
from app.models.analysis import ReviewAnalysis, AspectResult
from app.models.product import Product
from app.schemas.analytics import DashboardStats, ComplaintItem
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_data(db: Session = Depends(get_db)):
    return analytics_service.get_dashboard_stats(db)

@router.get("/complaints", response_model=List[ComplaintItem])
def get_complaints(
    product_id: Optional[str] = Query(None, description="Optional product filter"),
    db: Session = Depends(get_db)
):
    return analytics_service.get_complaint_discovery(db, product_id=product_id)

@router.get("/compare")
def compare_products(
    product_ids: str = Query(..., description="Comma-separated product IDs to compare e.g. prod_nova_x,prod_pixelwave_9"),
    db: Session = Depends(get_db)
):
    ids = [pid.strip() for pid in product_ids.split(",") if pid.strip()]
    return analytics_service.get_product_comparison(db, ids)

@router.get("/aspects")
def get_aspect_analytics(
    product_id: Optional[str] = Query(None, description="Optional product filter"),
    aspect_name: Optional[str] = Query(None, description="Optional aspect name filter"),
    db: Session = Depends(get_db)
):
    """
    Returns aspect breakdown, mention counts, sentiment distributions,
    representative praise, and representative complaints.
    """
    query = (
        db.query(
            AspectResult.aspect_name,
            AspectResult.sentiment,
            func.count(AspectResult.id)
        )
        .join(ReviewAnalysis, AspectResult.analysis_id == ReviewAnalysis.id)
    )
    if product_id:
        query = query.filter(ReviewAnalysis.product_id == product_id)
    if aspect_name:
        query = query.filter(AspectResult.aspect_name == aspect_name)

    rows = query.group_by(AspectResult.aspect_name, AspectResult.sentiment).all()

    aspects_dict: Dict[str, Dict[str, int]] = {}
    for asp, sent, count in rows:
        if asp not in aspects_dict:
            aspects_dict[asp] = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
        aspects_dict[asp][sent] = count

    aspect_list = []
    for asp, counts in aspects_dict.items():
        total = sum(counts.values())
        # Grab top praise excerpts
        praise_rows = (
            db.query(ReviewAnalysis.review_text, AspectResult.evidence_text, Product.name)
            .join(AspectResult, AspectResult.analysis_id == ReviewAnalysis.id)
            .outerjoin(Product, ReviewAnalysis.product_id == Product.id)
            .filter(AspectResult.aspect_name == asp, AspectResult.sentiment == "Positive")
        )
        if product_id:
            praise_rows = praise_rows.filter(ReviewAnalysis.product_id == product_id)
        praises = [
            {"text": r[0], "evidence": r[1] or "", "product": r[2] or "Generic"}
            for r in praise_rows.limit(3).all()
        ]

        # Grab top complaint excerpts
        complaint_rows = (
            db.query(ReviewAnalysis.review_text, AspectResult.evidence_text, Product.name)
            .join(AspectResult, AspectResult.analysis_id == ReviewAnalysis.id)
            .outerjoin(Product, ReviewAnalysis.product_id == Product.id)
            .filter(AspectResult.aspect_name == asp, AspectResult.sentiment == "Negative")
        )
        if product_id:
            complaint_rows = complaint_rows.filter(ReviewAnalysis.product_id == product_id)
        complaints = [
            {"text": r[0], "evidence": r[1] or "", "product": r[2] or "Generic"}
            for r in complaint_rows.limit(3).all()
        ]

        aspect_list.append({
            "aspect_name": asp,
            "total_mentions": total,
            "sentiments": counts,
            "net_sentiment": round((counts["Positive"] - counts["Negative"]) / (total or 1), 2),
            "frequent_praises": praises,
            "common_complaints": complaints
        })

    aspect_list.sort(key=lambda x: x["total_mentions"], reverse=True)
    return {"aspects": aspect_list}
