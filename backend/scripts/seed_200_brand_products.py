"""
Seeds 230+ original brand tech products into ReviewIQ AI database.
- Migrates products table schema if new columns are missing.
- Ingests all 236 brand products with official store, Amazon, and Flipkart URLs.
- Ingests realistic aspect-bearing reviews for all products and runs ABSA pipeline.
- Idempotent and preserves user accounts.
"""

import os
import sys
import json
import sqlite3

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import engine, Base, SessionLocal
from app.models import User, Product, Review, ReviewAnalysis, AspectResult
from app.nlp.pipeline import pipeline

JSON_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "brand_products.json"))

def migrate_sqlite_columns():
    """Ensure brand, price, image_url, amazon_url, flipkart_url, official_url columns exist."""
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "reviewiq.db"))
    if not os.path.exists(db_path):
        return

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(products)")
    existing_cols = {row[1] for row in cur.fetchall()}

    columns_to_add = [
        ("brand", "VARCHAR(64)"),
        ("price", "VARCHAR(32)"),
        ("image_url", "VARCHAR(255)"),
        ("amazon_url", "VARCHAR(512)"),
        ("flipkart_url", "VARCHAR(512)"),
        ("official_url", "VARCHAR(512)")
    ]

    for col_name, col_type in columns_to_add:
        if col_name not in existing_cols:
            print(f"[MIGRATION] Adding column '{col_name}' to products table...")
            cur.execute(f"ALTER TABLE products ADD COLUMN {col_name} {col_type}")
    
    conn.commit()
    conn.close()

REVIEW_TEMPLATES = [
    ("The build quality is outstanding and the display looks gorgeous, but the battery drains faster than expected under heavy load.", 4.0),
    ("Superb performance with zero lag or heating issues. The camera optics produce crisp and vibrant photos.", 5.0),
    ("At this price point it feels slightly expensive, though the software interface is remarkably clean and intuitive.", 4.0),
    ("Audio speakers deliver crystal clear sound with punchy bass, and fast charging replenishes the battery quickly.", 5.0),
    ("Connectivity over 5G and Wi-Fi is rock solid, while the sleek modern design feels extremely comfortable in hand.", 5.0)
]

def seed_200_products():
    print("=" * 60)
    print("Seeding 230+ Original Brand Products & Aspect Reviews")
    print("=" * 60)

    # 1. Run column migration on SQLite
    migrate_sqlite_columns()

    # 2. Ensure schema
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if not os.path.exists(JSON_PATH):
        print(f"Error: {JSON_PATH} not found.")
        return

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        products_data = json.load(f)

    inserted_prods = 0
    updated_prods = 0
    reviews_created = 0

    try:
        for idx, item in enumerate(products_data, start=1):
            pid = item["id"]
            existing = db.query(Product).filter(Product.id == pid).first()
            if not existing:
                p_obj = Product(
                    id=pid,
                    name=item["name"],
                    brand=item["brand"],
                    category=item["category"],
                    price=item["price"],
                    image_url=item["image_url"],
                    amazon_url=item["amazon_url"],
                    flipkart_url=item["flipkart_url"],
                    official_url=item["official_url"],
                    description=item["description"]
                )
                db.add(p_obj)
                db.flush()
                inserted_prods += 1
                target_p = p_obj
            else:
                existing.brand = item["brand"]
                existing.price = item["price"]
                existing.amazon_url = item["amazon_url"]
                existing.flipkart_url = item["flipkart_url"]
                existing.official_url = item["official_url"]
                if not existing.description or len(existing.description) < len(item["description"]):
                    existing.description = item["description"]
                updated_prods += 1
                target_p = existing

            # Check if product has reviews
            rev_count = db.query(Review).filter(Review.product_id == pid).count()
            if rev_count < 2:
                # Add 2 reviews per product
                for r_idx in range(2):
                    tpl_text, rating = REVIEW_TEMPLATES[(idx + r_idx) % len(REVIEW_TEMPLATES)]
                    # Customize slightly with product name
                    rev_text = f"Reviewing the {item['name']}: {tpl_text}"
                    rev_id = f"rev_{pid[:20]}_{r_idx+1}"
                    
                    if not db.query(Review).filter(Review.id == rev_id).first():
                        review_obj = Review(
                            id=rev_id,
                            product_id=pid,
                            review_text=rev_text,
                            rating=rating,
                            source_type="brand_catalog_demo"
                        )
                        db.add(review_obj)
                        db.flush()

                        # Run ABSA analysis
                        nlp_res = pipeline.analyze_review(rev_text)
                        analysis_record = ReviewAnalysis(
                            user_id=None,
                            review_id=rev_id,
                            product_id=pid,
                            review_text=rev_text,
                            overall_sentiment=nlp_res["overall_sentiment"],
                            confidence=nlp_res["overall_confidence"],
                            model_name=nlp_res["model_name"]
                        )
                        db.add(analysis_record)
                        db.flush()

                        for asp in nlp_res["aspects"]:
                            db.add(
                                AspectResult(
                                    analysis_id=analysis_record.id,
                                    aspect_name=asp["aspect"],
                                    sentiment=asp["sentiment"],
                                    confidence=asp["confidence"],
                                    evidence_text=asp["evidence"]
                                )
                            )
                        reviews_created += 1

        db.commit()
        total_p = db.query(Product).count()
        total_r = db.query(Review).count()
        total_a = db.query(ReviewAnalysis).count()

        print(f"Products: {inserted_prods} inserted, {updated_prods} updated.")
        print(f"Reviews created: {reviews_created}")
        print(f"Total Products in DB: {total_p}")
        print(f"Total Reviews in DB: {total_r}")
        print(f"Total Analyses in DB: {total_a}")
        print("[SUCCESS] Brand products seeding completed!")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seeding failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_200_products()
