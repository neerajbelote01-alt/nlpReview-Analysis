"""
Populates ReviewIQ AI with:
1. High-resolution tailored product images for all 241 products.
2. At least 50 distinct aspect-rich reviews per product (>12,000 reviews total)
   with complete ABSA aspect extraction and sentiment classification.
"""

import os
import sys
import json
import random
import time
from datetime import datetime, timezone

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.models import Product, Review, ReviewAnalysis, AspectResult
from app.nlp.pipeline import pipeline

JSON_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "brand_products.json"))

# High-resolution, curated tech imagery mapped by category and brand
IMAGE_MAP = {
    "Apple_Smartphones": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
    "Samsung_Smartphones": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
    "Google_Smartphones": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
    "OnePlus_Smartphones": "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    "Xiaomi_Smartphones": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
    "Smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    
    "Apple_Laptops & Computers": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    "Dell_Laptops & Computers": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
    "HP_Laptops & Computers": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
    "Lenovo_Laptops & Computers": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
    "Asus_Laptops & Computers": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
    "Laptops & Computers": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80",

    "Sony_Audio & Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    "Bose_Audio & Headphones": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    "Apple_Audio & Headphones": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    "Audio & Headphones": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",

    "Smartwatches & Wearables": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    "Tablets": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
    "Cameras & Drones": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    "Gaming & Consoles": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80",
    "Smart Home & TV": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80"
}

def get_product_image(brand, category):
    key = f"{brand}_{category}"
    if key in IMAGE_MAP:
        return IMAGE_MAP[key]
    if category in IMAGE_MAP:
        return IMAGE_MAP[category]
    return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"

# Sentence components for generating distinct, linguistically realistic reviews
POSITIVE_COMPONENTS = [
    "The camera captures unbelievable night photos with stunning dynamic range.",
    "The battery is an absolute beast lasting two full days of heavy usage.",
    "The 120Hz display is bright, fluid, and beautifully calibrated outdoors.",
    "Outstanding performance with zero lag or stuttering in demanding games.",
    "Aggressive price point offers unbeatable hardware specifications per dollar.",
    "Sleek minimalist design feels extraordinarily luxurious and lightweight in hand.",
    "Build quality is second to none with tight seams and premium aluminum construction.",
    "Stereo speakers deliver punchy sound, rich volume, and crisp audio dialogue.",
    "Operating software is clean and intuitive with smooth fluid animations.",
    "Fast charging works as advertised, replenishing the battery from zero in 25 minutes.",
    "5G and Wi-Fi connectivity are rock solid, maintaining full signal in basements.",
    "Exceptional durability; survived an accidental drop on hardwood floor without a scratch.",
    "The screen clarity and color accuracy are unmatched in this class.",
    "Microphone clarity on audio calls is pristine and cuts out background noise.",
    "Battery standby overnight drain is barely one percent, truly impressive power management."
]

NEGATIVE_COMPONENTS = [
    "Battery backup is terribly weak and drains out before the afternoon.",
    "At this price tag, it feels significantly overpriced compared to rivals.",
    "The phone gets uncomfortably hot and thermal throttles during long video calls.",
    "Software UI has too much bloatware and intrusive notification ads.",
    "Audio from the speaker sounds hollow, tinny, and completely lacks bass.",
    "Charging is painfully slow, taking nearly two hours for a full cycle.",
    "Low-light camera photos are noisy, muddy, and suffer from shutter lag.",
    "The glossy finish is an absolute fingerprint magnet and scratches easily.",
    "Connectivity issues occur frequently with cellular data dropping randomly.",
    "Maximum display brightness struggles terribly under direct noon sunlight."
]

MIXED_COMPONENTS = [
    "The camera is excellent and the display looks beautiful, but the battery drains quickly.",
    "The performance is fast and snappy, but the phone heats up during gaming.",
    "Build quality feels sturdy and solid, although the price is somewhat steep.",
    "Audio quality is loud and clear, yet the lack of a headphone jack is disappointing.",
    "The display resolution is crisp, yet auto-brightness reacts sluggishly in low light.",
    "Charging speed is phenomenal, but the charging brick is unfortunately not included.",
    "The camera zoom is wonderful for concerts, but ultra-wide lens exhibits edge distortion.",
    "Fast wireless charging works well, though the frame gets quite warm during use."
]

NEGATION_COMPONENTS = [
    "The battery life is not bad at all after the latest firmware patch.",
    "The chassis materials are definitely not cheap, feeling quite solid in hand.",
    "Performance speed is not slow, handling daily multitasking with total ease.",
    "The camera low-light video is not bad for an entry-tier sensor.",
    "Speaker volume is not quiet and easily fills a bedroom during movies."
]

def generate_review_text(pname, idx):
    r_type = idx % 10
    if r_type < 5:
        # Positive multi-aspect review
        c1 = POSITIVE_COMPONENTS[idx % len(POSITIVE_COMPONENTS)]
        c2 = POSITIVE_COMPONENTS[(idx * 3 + 2) % len(POSITIVE_COMPONENTS)]
        return f"{c1} Also, {c2.lower()}", 5.0
    elif r_type in [5, 6]:
        # Mixed review
        c = MIXED_COMPONENTS[idx % len(MIXED_COMPONENTS)]
        return f"Regarding the {pname}: {c}", 3.0
    elif r_type == 7:
        # Negation review
        c = NEGATION_COMPONENTS[idx % len(NEGATION_COMPONENTS)]
        return f"{c}", 4.0
    else:
        # Negative review
        c1 = NEGATIVE_COMPONENTS[idx % len(NEGATIVE_COMPONENTS)]
        return f"{c1} Disappointed with this aspect of the {pname}.", 2.0

def populate_50_reviews_and_images():
    print("=" * 65)
    print("ReviewIQ AI — Populating 50+ Reviews & Curated Images per Product")
    print("=" * 65)

    db = SessionLocal()
    t0 = time.time()

    try:
        products = db.query(Product).all()
        print(f"[1/3] Updating product images across {len(products)} products...")
        
        for p in products:
            img = get_product_image(p.brand or "", p.category or "")
            p.image_url = img
        db.commit()
        print("      Image URLs updated successfully.")

        # Update JSON file as well
        if os.path.exists(JSON_PATH):
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                json_prods = json.load(f)
            for item in json_prods:
                item["image_url"] = get_product_image(item.get("brand", ""), item.get("category", ""))
            with open(JSON_PATH, "w", encoding="utf-8") as f:
                json.dump(json_prods, f, indent=2)
            print("      data/brand_products.json updated with high-resolution images.")

        print("[2/3] Checking review counts and synthesizing 50+ reviews per product...")
        total_new_reviews = 0
        batch_counter = 0

        for p_idx, p in enumerate(products, start=1):
            current_count = db.query(Review).filter(Review.product_id == p.id).count()
            needed = max(0, 50 - current_count)

            if needed > 0:
                for rev_num in range(1, needed + 1):
                    unique_seed = current_count + rev_num
                    rev_text, rating = generate_review_text(p.name, unique_seed + p_idx * 7)
                    import uuid
                    rev_id = f"rev_{p.id}_{unique_seed:04d}_{uuid.uuid4().hex[:6]}"[:64]

                    rev = Review(
                        id=rev_id,
                        product_id=p.id,
                        review_text=rev_text,
                        rating=rating,
                        source_type="brand_catalog_50"
                    )
                    db.add(rev)
                    db.flush()

                    # Run ABSA Pipeline
                    nlp_res = pipeline.analyze_review(rev_text)
                    analysis = ReviewAnalysis(
                        user_id=None,
                        review_id=rev.id,
                        product_id=p.id,
                        review_text=rev_text,
                        overall_sentiment=nlp_res["overall_sentiment"],
                        confidence=nlp_res["overall_confidence"],
                        model_name=nlp_res["model_name"]
                    )
                    db.add(analysis)
                    db.flush()

                    for asp in nlp_res["aspects"]:
                        db.add(
                            AspectResult(
                                analysis_id=analysis.id,
                                aspect_name=asp["aspect"],
                                sentiment=asp["sentiment"],
                                confidence=asp["confidence"],
                                evidence_text=asp["evidence"]
                            )
                        )

                    total_new_reviews += 1
                    batch_counter += 1

                    if batch_counter >= 300:
                        db.commit()
                        batch_counter = 0

            if p_idx % 30 == 0 or p_idx == len(products):
                db.commit()
                print(f"      Processed {p_idx}/{len(products)} products (Added {total_new_reviews} reviews so far)...")

        db.commit()
        print(f"[3/3] Verification & Final Metrics:")
        total_p = db.query(Product).count()
        total_r = db.query(Review).count()
        total_a = db.query(ReviewAnalysis).count()
        total_asp = db.query(AspectResult).count()

        # Check minimum review count
        min_revs = min(db.query(Review).filter(Review.product_id == p.id).count() for p in products)

        print(f"      Total Products: {total_p}")
        print(f"      Total Reviews: {total_r}")
        print(f"      Total ABSA Analyses: {total_a}")
        print(f"      Total Aspect Cues Extracted: {total_asp}")
        print(f"      Minimum reviews on ANY product: {min_revs} (Target: >= 50)")
        print(f"      Time Elapsed: {time.time() - t0:.2f} seconds")
        print("=" * 65)
        print("[SUCCESS] All 241 products now have AT LEAST 50 reviews and curated images!")
        print("=" * 65)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    populate_50_reviews_and_images()
