import csv
import io
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.deps import get_db, get_current_user_optional
from app.models.user import User
from app.models.product import Product
from app.models.review import Review
from app.models.analysis import ReviewAnalysis, AspectResult
from app.nlp.pipeline import pipeline

router = APIRouter(prefix="/dataset", tags=["Dataset"])

@router.get("/summary")
def get_dataset_summary(db: Session = Depends(get_db)):
    total_reviews = db.query(Review).count()
    synthetic_count = db.query(Review).filter(Review.source_type == "synthetic_demo").count()
    uploaded_count = total_reviews - synthetic_count

    # Reviews per product
    product_stats = []
    products = db.query(Product).all()
    for p in products:
        cnt = db.query(Review).filter(Review.product_id == p.id).count()
        product_stats.append({
            "product_id": p.id,
            "product_name": p.name,
            "category": p.category,
            "review_count": cnt
        })

    # Aspect distribution
    aspect_counts = (
        db.query(AspectResult.aspect_name, func.count(AspectResult.id))
        .group_by(AspectResult.aspect_name)
        .order_by(func.count(AspectResult.id).desc())
        .all()
    )
    aspect_distribution = [{"aspect": a[0], "count": a[1]} for a in aspect_counts]

    return {
        "total_reviews": total_reviews,
        "synthetic_demo_reviews": synthetic_count,
        "user_uploaded_reviews": uploaded_count,
        "products": product_stats,
        "aspect_distribution": aspect_distribution,
        "provenance_statement": (
            "All demo reviews in this system are synthetic demonstrations clearly labeled as 'synthetic_demo'. "
            "They simulate customer feedback for academic demonstration and do not represent actual customer opinions."
        )
    }

@router.post("/upload")
async def upload_dataset_csv(
    file: UploadFile = File(...),
    product_id: str = "prod_nova_x",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a .csv file."
        )

    content = await file.read()
    try:
        decoded_content = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        try:
            decoded_content = content.decode("latin1")
        except Exception:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to decode CSV file encoding.")

    reader = csv.DictReader(io.StringIO(decoded_content))
    fieldnames = [f.strip().lower() for f in (reader.fieldnames or [])]

    # Find review text column
    text_col = None
    for candidate in ["review_text", "review", "text", "content", "feedback", "comment"]:
        if candidate in fieldnames:
            text_col = candidate
            break

    if not text_col:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"CSV must contain a review text column such as 'review_text', 'review', or 'text'. Found headers: {list(reader.fieldnames or [])}"
        )

    # Find rating column if present
    rating_col = None
    for candidate in ["rating", "score", "stars"]:
        if candidate in fieldnames:
            rating_col = candidate
            break

    # Find product_id column if present
    prod_id_col = None
    for candidate in ["product_id", "product", "product_name"]:
        if candidate in fieldnames:
            prod_id_col = candidate
            break

    imported_count = 0
    errors = []
    analyses = []

    for idx, row in enumerate(reader, start=1):
        # Match case-insensitive keys
        row_normalized = {k.strip().lower(): v for k, v in row.items() if k}
        raw_text = row_normalized.get(text_col, "").strip()
        if not raw_text or len(raw_text) < 3:
            continue

        raw_rating = row_normalized.get(rating_col) if rating_col else None
        rating_val = None
        if raw_rating:
            try:
                rating_val = float(raw_rating)
            except ValueError:
                pass

        target_prod_id = row_normalized.get(prod_id_col, product_id) if prod_id_col else product_id
        # Verify product exists or fallback to first product
        prod_exists = db.query(Product).filter(Product.id == target_prod_id).first()
        if not prod_exists:
            target_prod_id = product_id

        rev_id = f"upload_{idx}_{db.query(Review).count() + 1}"
        rev = Review(
            id=rev_id,
            product_id=target_prod_id,
            review_text=raw_text,
            rating=rating_val,
            source_type="user_uploaded"
        )
        db.add(rev)
        db.flush()

        # Run pipeline
        res = pipeline.analyze_review(raw_text)
        analysis_record = ReviewAnalysis(
            user_id=current_user.id if current_user else None,
            review_id=rev.id,
            product_id=target_prod_id,
            review_text=raw_text,
            overall_sentiment=res["overall_sentiment"],
            confidence=res["overall_confidence"],
            model_name=res["model_name"]
        )
        db.add(analysis_record)
        db.flush()

        for asp in res["aspects"]:
            db.add(
                AspectResult(
                    analysis_id=analysis_record.id,
                    aspect_name=asp["aspect"],
                    sentiment=asp["sentiment"],
                    confidence=asp["confidence"],
                    evidence_text=asp["evidence"]
                )
            )

        imported_count += 1
        analyses.append({
            "review_id": rev.id,
            "overall_sentiment": res["overall_sentiment"],
            "aspects_count": len(res["aspects"])
        })

    db.commit()
    return {
        "status": "success",
        "imported_count": imported_count,
        "errors": errors,
        "sample_analyzed": analyses[:5]
    }
