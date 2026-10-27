"""
Database seeding script for ReviewIQ AI.
- Creates database tables if they do not exist.
- Inserts the 5 fictional smartphone products (idempotent).
- Inserts at least 20 sample reviews per product from data/sample_reviews.csv.
- Automatically analyzes each sample review using the real ABSA pipeline and seeds ReviewAnalysis and AspectResult records.
- Preserves all registered users and existing user history.
- Reports inserted, skipped, and total review counts.
"""

import sys
import os
import csv

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import engine, Base, SessionLocal
from app.models import User, Product, Review, ReviewAnalysis, AspectResult
from app.nlp.pipeline import pipeline

SAMPLE_CSV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "sample_reviews.csv"))

SAMPLE_PRODUCTS = [
    {
        "id": "prod_nova_x",
        "name": "Nova X Pro",
        "category": "Flagship Smartphone",
        "description": "Next-gen flagship with 200MP ultra-sensor, titanium frame, and 144Hz AMOLED display."
    },
    {
        "id": "prod_pixelwave_9",
        "name": "PixelWave 9",
        "category": "AI Camera Smartphone",
        "description": "AI-first photography powerhouse featuring tensor computing, clean UI, and real-time computational photography."
    },
    {
        "id": "prod_galaxysphere_s25",
        "name": "GalaxySphere S25",
        "category": "Productivity Smartphone",
        "description": "Ultra-premium productivity flagship with integrated stylus, quad-lens optical zoom, and 6500mAh power system."
    },
    {
        "id": "prod_ifruit_17",
        "name": "iFruit 17",
        "category": "Premium Smartphone",
        "description": "Sleek aerospace glass design, A19 Bionic neural chip, dynamic island, and unified ecosystem software."
    },
    {
        "id": "prod_onemax_ultra",
        "name": "OneMax Ultra",
        "category": "Performance Smartphone",
        "description": "Speed-focused gaming flagship with 150W ultra-fast charging, liquid vapor chamber cooling, and stereo acoustic resonance."
    }
]

def seed_database():
    print("=" * 60)
    print("ReviewIQ AI — Database Seeding")
    print("=" * 60)

    # 1. Initialize schema
    print("[1/4] Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 2. Seed Products
        print("[2/4] Seeding products...")
        prods_inserted = 0
        prods_skipped = 0
        for p in SAMPLE_PRODUCTS:
            existing = db.query(Product).filter(Product.id == p["id"]).first()
            if not existing:
                prod_obj = Product(
                    id=p["id"],
                    name=p["name"],
                    category=p["category"],
                    description=p["description"]
                )
                db.add(prod_obj)
                prods_inserted += 1
            else:
                prods_skipped += 1
        db.commit()
        print(f"      Products: {prods_inserted} inserted, {prods_skipped} already existed.")

        # 3. Seed Reviews & Analyses from CSV
        print("[3/4] Reading sample reviews from CSV and generating ABSA records...")
        if not os.path.exists(SAMPLE_CSV_PATH):
            print(f"[ERROR] Sample reviews file not found at {SAMPLE_CSV_PATH}")
            return

        reviews_inserted = 0
        reviews_skipped = 0
        analyses_created = 0

        with open(SAMPLE_CSV_PATH, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                rev_id = row["review_id"]
                prod_id = row["product_id"]
                text = row["review_text"]
                rating = float(row["rating"]) if row.get("rating") else None
                source_type = row.get("source_type", "synthetic_demo")

                # Check if review already exists
                existing_rev = db.query(Review).filter(Review.id == rev_id).first()
                if not existing_rev:
                    review_obj = Review(
                        id=rev_id,
                        product_id=prod_id,
                        review_text=text,
                        rating=rating,
                        source_type=source_type
                    )
                    db.add(review_obj)
                    db.flush()  # ensure review is persisted
                    reviews_inserted += 1

                    # Run ABSA analysis on the seed review
                    analysis_result = pipeline.analyze_review(text)
                    analysis_record = ReviewAnalysis(
                        user_id=None,  # Public synthetic seed review, no private user ownership
                        review_id=rev_id,
                        product_id=prod_id,
                        review_text=text,
                        overall_sentiment=analysis_result["overall_sentiment"],
                        confidence=analysis_result["overall_confidence"],
                        model_name=analysis_result["model_name"]
                    )
                    db.add(analysis_record)
                    db.flush()

                    for asp in analysis_result["aspects"]:
                        asp_record = AspectResult(
                            analysis_id=analysis_record.id,
                            aspect_name=asp["aspect"],
                            sentiment=asp["sentiment"],
                            confidence=asp["confidence"],
                            evidence_text=asp["evidence"]
                        )
                        db.add(asp_record)
                    analyses_created += 1
                else:
                    reviews_skipped += 1

        db.commit()
        print(f"      Reviews: {reviews_inserted} inserted, {reviews_skipped} already existed.")
        print(f"      Analyses created: {analyses_created}")

        # 4. Summary counts
        total_products = db.query(Product).count()
        total_reviews = db.query(Review).count()
        total_analyses = db.query(ReviewAnalysis).count()
        total_aspects = db.query(AspectResult).count()
        print("[4/4] Verification Summary:")
        print(f"      Total Products in DB: {total_products}")
        print(f"      Total Reviews in DB: {total_reviews}")
        print(f"      Total Analyses in DB: {total_analyses}")
        print(f"      Total Aspect Results in DB: {total_aspects}")
        print("=" * 60)
        print("[SUCCESS] Database seeding completed successfully!")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seeding failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
