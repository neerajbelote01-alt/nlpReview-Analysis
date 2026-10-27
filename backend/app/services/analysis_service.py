from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.product import Product
from app.models.review import Review
from app.models.analysis import ReviewAnalysis, AspectResult
from app.schemas.analysis import AnalyzeRequest, AnalysisOut, AspectResultOut, BulkAnalyzeResponse
from app.nlp.pipeline import pipeline

class AnalysisService:
    @staticmethod
    def analyze_single_review(
        db: Session,
        data: AnalyzeRequest,
        current_user: Optional[User] = None
    ) -> AnalysisOut:
        text = data.review_text.strip()
        if not text:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Review text cannot be empty.")

        nlp_res = pipeline.analyze_review(text)

        # Check if product exists if provided
        product_name = None
        if data.product_id:
            prod = db.query(Product).filter(Product.id == data.product_id).first()
            if prod:
                product_name = prod.name

        analysis_record = None
        # Save to DB if requested or if authenticated user requested save
        if data.save_to_history:
            analysis_record = ReviewAnalysis(
                user_id=current_user.id if current_user else None,
                product_id=data.product_id,
                review_text=text,
                overall_sentiment=nlp_res["overall_sentiment"],
                confidence=nlp_res["overall_confidence"],
                model_name=nlp_res["model_name"]
            )
            db.add(analysis_record)
            db.flush()

            for asp in nlp_res["aspects"]:
                asp_record = AspectResult(
                    analysis_id=analysis_record.id,
                    aspect_name=asp["aspect"],
                    sentiment=asp["sentiment"],
                    confidence=asp["confidence"],
                    evidence_text=asp["evidence"]
                )
                db.add(asp_record)
            db.commit()
            db.refresh(analysis_record)

        aspect_outs = [
            AspectResultOut(
                id=None,
                aspect_name=asp["aspect"],
                sentiment=asp["sentiment"],
                confidence=asp["confidence"],
                evidence_text=asp["evidence"]
            )
            for asp in nlp_res["aspects"]
        ]

        return AnalysisOut(
            id=analysis_record.id if analysis_record else None,
            product_id=data.product_id,
            product_name=product_name,
            review_text=text,
            overall_sentiment=nlp_res["overall_sentiment"],
            confidence=nlp_res["overall_confidence"],
            model_name=nlp_res["model_name"],
            analysis_timestamp=analysis_record.analysis_timestamp if analysis_record else datetime.now(timezone.utc),
            aspect_results=aspect_outs
        )

    @staticmethod
    def get_user_history(
        db: Session,
        user_id: int,
        search: Optional[str] = None,
        sentiment: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[AnalysisOut]:
        query = db.query(ReviewAnalysis).filter(ReviewAnalysis.user_id == user_id)
        if search:
            query = query.filter(ReviewAnalysis.review_text.ilike(f"%{search.strip()}%"))
        if sentiment:
            query = query.filter(ReviewAnalysis.overall_sentiment == sentiment)

        records = query.order_by(ReviewAnalysis.analysis_timestamp.desc()).offset(offset).limit(limit).all()
        results: List[AnalysisOut] = []

        for rec in records:
            prod_name = rec.product.name if rec.product else None
            aspects = [
                AspectResultOut(
                    id=a.id,
                    aspect_name=a.aspect_name,
                    sentiment=a.sentiment,
                    confidence=a.confidence,
                    evidence_text=a.evidence_text
                )
                for a in rec.aspect_results
            ]
            results.append(
                AnalysisOut(
                    id=rec.id,
                    review_id=rec.review_id,
                    product_id=rec.product_id,
                    product_name=prod_name,
                    review_text=rec.review_text,
                    overall_sentiment=rec.overall_sentiment,
                    confidence=rec.confidence,
                    model_name=rec.model_name,
                    analysis_timestamp=rec.analysis_timestamp,
                    aspect_results=aspects
                )
            )
        return results

    @staticmethod
    def delete_user_analysis(db: Session, user_id: int, analysis_id: int) -> bool:
        record = db.query(ReviewAnalysis).filter(
            ReviewAnalysis.id == analysis_id,
            ReviewAnalysis.user_id == user_id
        ).first()
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis record not found or does not belong to you."
            )
        db.delete(record)
        db.commit()
        return True

analysis_service = AnalysisService()
