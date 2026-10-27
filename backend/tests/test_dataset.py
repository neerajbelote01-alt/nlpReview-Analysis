import os
import csv
import pytest
from app.models.product import Product
from app.models.review import Review

DATA_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "sample_reviews.csv"))

def test_csv_structure_and_counts():
    assert os.path.exists(DATA_FILE), f"Missing CSV at {DATA_FILE}"
    
    products = set()
    reviews_per_product = {}
    total_reviews = 0

    with open(DATA_FILE, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required_cols = {"review_id", "product_id", "product_name", "category", "review_text", "rating", "source_type"}
        assert required_cols.issubset(set(reader.fieldnames))

        for row in reader:
            total_reviews += 1
            pid = row["product_id"]
            products.add(pid)
            reviews_per_product[pid] = reviews_per_product.get(pid, 0) + 1
            assert row["source_type"] == "synthetic_demo"

    # Must contain at least 5 products
    assert len(products) >= 5, f"Expected at least 5 products, got {len(products)}"
    # Total reviews >= 100
    assert total_reviews >= 100, f"Expected >= 100 reviews, got {total_reviews}"
    # Each product >= 20 reviews
    for pid, count in reviews_per_product.items():
        assert count >= 20, f"Product {pid} has {count} reviews, expected >= 20"

def test_database_seeded_counts(db_session):
    prod_count = db_session.query(Product).count()
    rev_count = db_session.query(Review).count()
    assert prod_count >= 5
    assert rev_count >= 100
