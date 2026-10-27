from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from fastapi import HTTPException, status
from app.models.product import Product
from app.models.review import Review
from app.models.analysis import ReviewAnalysis, AspectResult
from app.schemas.product import ProductOut, ProductCreate, ProductDetail

class ProductService:
    @staticmethod
    def get_all_products(
        db: Session,
        search: Optional[str] = None,
        category: Optional[str] = None,
        brand: Optional[str] = None
    ) -> List[ProductOut]:
        query = db.query(Product)
        if search:
            term = f"%{search.strip()}%"
            query = query.filter(
                or_(
                    Product.name.ilike(term),
                    Product.brand.ilike(term),
                    Product.category.ilike(term),
                    Product.description.ilike(term)
                )
            )
        if category and category != "All":
            query = query.filter(Product.category == category)
        if brand and brand != "All":
            query = query.filter(Product.brand == brand)
            
        products = query.order_by(Product.name.asc()).all()
        results: List[ProductOut] = []

        for p in products:
            reviews = db.query(Review).filter(Review.product_id == p.id).all()
            rev_count = len(reviews)
            ratings = [r.rating for r in reviews if r.rating is not None]
            avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else None

            # Sentiment distribution
            analyses = db.query(ReviewAnalysis).filter(ReviewAnalysis.product_id == p.id).all()
            sent_dist = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
            for a in analyses:
                if a.overall_sentiment in sent_dist:
                    sent_dist[a.overall_sentiment] += 1

            # Top mentioned aspects
            top_aspect_rows = (
                db.query(AspectResult.aspect_name, func.count(AspectResult.id).label("cnt"))
                .join(ReviewAnalysis, AspectResult.analysis_id == ReviewAnalysis.id)
                .filter(ReviewAnalysis.product_id == p.id)
                .group_by(AspectResult.aspect_name)
                .order_by(func.count(AspectResult.id).desc())
                .limit(4)
                .all()
            )
            top_aspects = [row[0] for row in top_aspect_rows]

            results.append(
                ProductOut(
                    id=p.id,
                    name=p.name,
                    brand=p.brand,
                    category=p.category,
                    price=p.price,
                    image_url=p.image_url,
                    amazon_url=p.amazon_url,
                    flipkart_url=p.flipkart_url,
                    official_url=p.official_url,
                    description=p.description,
                    created_at=p.created_at,
                    review_count=rev_count,
                    average_rating=avg_rating,
                    sentiment_summary=sent_dist,
                    top_aspects=top_aspects
                )
            )
        return results

    @staticmethod
    def get_product_detail(db: Session, product_id: str) -> ProductDetail:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")

        reviews = db.query(Review).filter(Review.product_id == product.id).all()
        rev_count = len(reviews)
        ratings = [r.rating for r in reviews if r.rating is not None]
        avg_rating = round(sum(ratings) / len(ratings), 2) if ratings else None

        analyses = db.query(ReviewAnalysis).filter(ReviewAnalysis.product_id == product.id).all()
        sent_dist = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
        for a in analyses:
            if a.overall_sentiment in sent_dist:
                sent_dist[a.overall_sentiment] += 1

        # Aspect breakdown: aspect -> {Positive, Negative, Neutral, Mixed}
        aspect_breakdown: Dict[str, Dict[str, int]] = {}
        aspect_records = (
            db.query(AspectResult.aspect_name, AspectResult.sentiment, func.count(AspectResult.id))
            .join(ReviewAnalysis, AspectResult.analysis_id == ReviewAnalysis.id)
            .filter(ReviewAnalysis.product_id == product.id)
            .group_by(AspectResult.aspect_name, AspectResult.sentiment)
            .all()
        )
        for asp_name, sent, count in aspect_records:
            if asp_name not in aspect_breakdown:
                aspect_breakdown[asp_name] = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
            aspect_breakdown[asp_name][sent] = count

        top_aspects = sorted(
            aspect_breakdown.keys(),
            key=lambda k: sum(aspect_breakdown[k].values()),
            reverse=True
        )[:5]

        return ProductDetail(
            id=product.id,
            name=product.name,
            brand=product.brand,
            category=product.category,
            price=product.price,
            image_url=product.image_url,
            amazon_url=product.amazon_url,
            flipkart_url=product.flipkart_url,
            official_url=product.official_url,
            description=product.description,
            created_at=product.created_at,
            review_count=rev_count,
            average_rating=avg_rating,
            sentiment_summary=sent_dist,
            top_aspects=top_aspects,
            aspect_breakdown=aspect_breakdown
        )

    @staticmethod
    def create_product(db: Session, data: ProductCreate) -> Product:
        existing = db.query(Product).filter((Product.id == data.id) | (Product.name == data.name)).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A product with this ID or name already exists."
            )
        new_prod = Product(
            id=data.id,
            name=data.name,
            brand=data.brand,
            category=data.category,
            price=data.price,
            image_url=data.image_url,
            amazon_url=data.amazon_url,
            flipkart_url=data.flipkart_url,
            official_url=data.official_url,
            description=data.description
        )
        db.add(new_prod)
        db.commit()
        db.refresh(new_prod)
        return new_prod

product_service = ProductService()
