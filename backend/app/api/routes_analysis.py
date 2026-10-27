from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_user_optional
from app.models.user import User
from app.schemas.analysis import (
    AnalyzeRequest,
    AnalysisOut,
    BulkAnalyzeResponse
)
from app.services.analysis_service import analysis_service

router = APIRouter(prefix="", tags=["Analysis"])

@router.post("/analyze", response_model=AnalysisOut)
def analyze_review(
    data: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    return analysis_service.analyze_single_review(db, data, current_user=current_user)

@router.post("/analyze/bulk", response_model=BulkAnalyzeResponse)
def analyze_bulk_reviews(
    data: List[AnalyzeRequest],
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No reviews provided for bulk analysis.")
    
    if len(data) > 300:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum 300 reviews allowed per bulk batch.")

    results: List[AnalysisOut] = []
    pos_count = 0
    neg_count = 0
    neu_count = 0
    mix_count = 0

    for item in data:
        res = analysis_service.analyze_single_review(db, item, current_user=current_user)
        results.append(res)
        if res.overall_sentiment == "Positive":
            pos_count += 1
        elif res.overall_sentiment == "Negative":
            neg_count += 1
        elif res.overall_sentiment == "Neutral":
            neu_count += 1
        elif res.overall_sentiment == "Mixed":
            mix_count += 1

    return BulkAnalyzeResponse(
        total_processed=len(results),
        positive_count=pos_count,
        negative_count=neg_count,
        neutral_count=neu_count,
        mixed_count=mix_count,
        results=results
    )

@router.get("/analyses/history", response_model=List[AnalysisOut])
def get_user_analysis_history(
    search: Optional[str] = Query(None, description="Search review text"),
    sentiment: Optional[str] = Query(None, description="Filter by sentiment"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Strictly isolated to current_user.id
    return analysis_service.get_user_history(
        db=db,
        user_id=current_user.id,
        search=search,
        sentiment=sentiment,
        limit=limit,
        offset=offset
    )

@router.delete("/analyses/{analysis_id}")
def delete_user_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    analysis_service.delete_user_analysis(db, user_id=current_user.id, analysis_id=analysis_id)
    return {"message": "Analysis record deleted successfully."}
