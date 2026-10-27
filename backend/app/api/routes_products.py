from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.review import Review
from app.schemas.product import ProductOut, ProductCreate, ProductDetail
from app.schemas.review import ReviewOut
from app.services.product_service import product_service

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductOut])
def list_products(
    search: Optional[str] = Query(None, description="Search products by name, brand, or specs"),
    category: Optional[str] = Query(None, description="Filter by category"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    db: Session = Depends(get_db)
):
    return product_service.get_all_products(db, search=search, category=category, brand=brand)

@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    prod = product_service.create_product(db, data)
    return product_service.get_product_detail(db, prod.id)

@router.get("/{product_id}", response_model=ProductDetail)
def get_product(product_id: str, db: Session = Depends(get_db)):
    return product_service.get_product_detail(db, product_id)

@router.get("/{product_id}/reviews", response_model=List[ReviewOut])
def get_product_reviews(
    product_id: str,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    reviews = (
        db.query(Review)
        .filter(Review.product_id == product_id)
        .order_by(Review.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    result = []
    for r in reviews:
        # Get overall sentiment from latest analysis if exists
        overall_sent = r.analyses[0].overall_sentiment if r.analyses else None
        asp_cnt = len(r.analyses[0].aspect_results) if r.analyses else 0
        result.append(
            ReviewOut(
                id=r.id,
                product_id=r.product_id,
                product_name=r.product.name if r.product else None,
                review_text=r.review_text,
                rating=r.rating,
                source_type=r.source_type,
                created_at=r.created_at,
                overall_sentiment=overall_sent,
                aspect_count=asp_cnt
            )
        )
    return result
