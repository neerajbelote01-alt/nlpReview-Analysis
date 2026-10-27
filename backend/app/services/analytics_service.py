from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.product import Product
from app.models.review import Review
from app.models.analysis import ReviewAnalysis, AspectResult
from app.schemas.analytics import (
    DashboardStats,
    SentimentDistribution,
    AspectSummaryItem,
    ProductSentimentItem,
    ComplaintItem
)

class AnalyticsService:
    @staticmethod
    def get_dashboard_stats(db: Session) -> DashboardStats:
        total_products = db.query(Product).count()
        total_reviews = db.query(Review).count()
        total_analyses = db.query(ReviewAnalysis).count()

        # Sentiment distribution
        sent_counts = (
            db.query(ReviewAnalysis.overall_sentiment, func.count(ReviewAnalysis.id))
            .group_by(ReviewAnalysis.overall_sentiment)
            .all()
        )
        dist_map = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
        for sent, cnt in sent_counts:
            if sent in dist_map:
                dist_map[sent] = cnt
        sentiment_distribution = SentimentDistribution(
            positive=dist_map["Positive"],
            negative=dist_map["Negative"],
            neutral=dist_map["Neutral"],
            mixed=dist_map["Mixed"]
        )

        # Aspect breakdown across all records
        aspect_records = (
            db.query(
                AspectResult.aspect_name,
                AspectResult.sentiment,
                func.count(AspectResult.id).label("cnt")
            )
            .group_by(AspectResult.aspect_name, AspectResult.sentiment)
            .all()
        )
        aspect_data: Dict[str, Dict[str, int]] = {}
        for asp_name, sent, cnt in aspect_records:
            if asp_name not in aspect_data:
                aspect_data[asp_name] = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
            if sent in aspect_data[asp_name]:
                aspect_data[asp_name][sent] += cnt

        aspect_summaries: List[AspectSummaryItem] = []
        for name, counts in aspect_data.items():
            pos = counts["Positive"]
            neg = counts["Negative"]
            neu = counts["Neutral"]
            mix = counts["Mixed"]
            tot = pos + neg + neu + mix
            net_score = round((pos - neg) / tot, 2) if tot > 0 else 0.0
            aspect_summaries.append(
                AspectSummaryItem(
                    aspect_name=name,
                    total_mentions=tot,
                    positive_count=pos,
                    negative_count=neg,
                    neutral_count=neu,
                    mixed_count=mix,
                    net_sentiment_score=net_score
                )
            )

        most_frequent = sorted(aspect_summaries, key=lambda a: a.total_mentions, reverse=True)
        top_positive = sorted(aspect_summaries, key=lambda a: a.positive_count, reverse=True)
        top_negative = sorted(aspect_summaries, key=lambda a: a.negative_count, reverse=True)

        # Product comparison items
        products = db.query(Product).all()
        product_items: List[ProductSentimentItem] = []
        for p in products:
            reviews = db.query(Review).filter(Review.product_id == p.id).all()
            ratings = [r.rating for r in reviews if r.rating is not None]
            avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else None

            p_analyses = db.query(ReviewAnalysis).filter(ReviewAnalysis.product_id == p.id).all()
            p_dist = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
            for a in p_analyses:
                if a.overall_sentiment in p_dist:
                    p_dist[a.overall_sentiment] += 1

            product_items.append(
                ProductSentimentItem(
                    product_id=p.id,
                    product_name=p.name,
                    total_reviews=len(reviews),
                    average_rating=avg_rating,
                    positive=p_dist["Positive"],
                    negative=p_dist["Negative"],
                    neutral=p_dist["Neutral"],
                    mixed=p_dist["Mixed"]
                )
            )

        # Recent activity
        recent_rows = (
            db.query(ReviewAnalysis)
            .order_by(ReviewAnalysis.analysis_timestamp.desc())
            .limit(6)
            .all()
        )
        recent_activity = [
            {
                "id": r.id,
                "product_name": r.product.name if r.product else "Standalone Review",
                "review_text": r.review_text[:120] + ("..." if len(r.review_text) > 120 else ""),
                "overall_sentiment": r.overall_sentiment,
                "confidence": r.confidence,
                "timestamp": r.analysis_timestamp.isoformat() if r.analysis_timestamp else None
            }
            for r in recent_rows
        ]

        return DashboardStats(
            total_products=total_products,
            total_reviews=total_reviews,
            total_analyses=total_analyses,
            sentiment_distribution=sentiment_distribution,
            most_frequent_aspects=most_frequent,
            top_positive_aspects=top_positive,
            top_negative_aspects=top_negative,
            product_sentiment_comparison=product_items,
            recent_activity=recent_activity
        )

    @staticmethod
    def get_complaint_discovery(db: Session, product_id: Optional[str] = None) -> List[ComplaintItem]:
        query = (
            db.query(
                AspectResult.aspect_name,
                func.count(AspectResult.id).label("cnt")
            )
            .join(ReviewAnalysis, AspectResult.analysis_id == ReviewAnalysis.id)
            .filter(AspectResult.sentiment == "Negative")
        )
        if product_id:
            query = query.filter(ReviewAnalysis.product_id == product_id)

        negative_aspect_rows = query.group_by(AspectResult.aspect_name).order_by(func.count(AspectResult.id).desc()).all()
        total_complaints = sum(r[1] for r in negative_aspect_rows) or 1

        complaints: List[ComplaintItem] = []
        for asp_name, count in negative_aspect_rows:
            # Find representative review excerpts
            excerpt_query = (
                db.query(ReviewAnalysis.review_text, AspectResult.evidence_text, Product.name)
                .join(AspectResult, AspectResult.analysis_id == ReviewAnalysis.id)
                .outerjoin(Product, ReviewAnalysis.product_id == Product.id)
                .filter(AspectResult.aspect_name == asp_name, AspectResult.sentiment == "Negative")
            )
            if product_id:
                excerpt_query = excerpt_query.filter(ReviewAnalysis.product_id == product_id)

            samples = excerpt_query.limit(4).all()
            excerpts = [
                {
                    "text": s[0],
                    "evidence": s[1] or "",
                    "product": s[2] or "Unknown Product"
                }
                for s in samples
            ]

            affected_prods = list({s[2] for s in samples if s[2]})

            complaints.append(
                ComplaintItem(
                    aspect_name=asp_name,
                    problem_count=count,
                    percentage=round((count / total_complaints) * 100, 1),
                    affected_products=affected_prods,
                    representative_excerpts=excerpts
                )
            )
        return complaints

    @staticmethod
    def get_product_comparison(db: Session, product_ids: List[str]) -> Dict[str, Any]:
        if not product_ids:
            return {"products": [], "aspects": [], "matrix": []}

        products = db.query(Product).filter(Product.id.in_(product_ids)).all()
        prod_map = {p.id: p for p in products}

        # Query all aspect sentiment per product
        rows = (
            db.query(
                ReviewAnalysis.product_id,
                AspectResult.aspect_name,
                AspectResult.sentiment,
                func.count(AspectResult.id)
            )
            .join(AspectResult, AspectResult.analysis_id == ReviewAnalysis.id)
            .filter(ReviewAnalysis.product_id.in_(product_ids))
            .group_by(ReviewAnalysis.product_id, AspectResult.aspect_name, AspectResult.sentiment)
            .all()
        )

        # Structure data
        product_aspect_sentiments: Dict[str, Dict[str, Dict[str, int]]] = {
            pid: {} for pid in product_ids
        }
        all_aspects = set()

        for pid, asp_name, sent, cnt in rows:
            all_aspects.add(asp_name)
            if asp_name not in product_aspect_sentiments[pid]:
                product_aspect_sentiments[pid][asp_name] = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
            product_aspect_sentiments[pid][asp_name][sent] += cnt

        # Build comparison items
        comparison_products = []
        for pid in product_ids:
            if pid not in prod_map:
                continue
            p = prod_map[pid]
            rev_count = db.query(Review).filter(Review.product_id == pid).count()
            
            # Overall sentiment
            p_analyses = db.query(ReviewAnalysis).filter(ReviewAnalysis.product_id == pid).all()
            dist = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
            for a in p_analyses:
                if a.overall_sentiment in dist:
                    dist[a.overall_sentiment] += 1

            comparison_products.append({
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "review_count": rev_count,
                "sentiment_distribution": dist,
                "aspects": product_aspect_sentiments[pid]
            })

        return {
            "products": comparison_products,
            "all_aspects": sorted(list(all_aspects))
        }

analytics_service = AnalyticsService()
