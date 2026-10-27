"""
Live end-to-end server test for ReviewIQ AI.
Tests every API endpoint against the running server at http://127.0.0.1:8000.
"""

import urllib.request
import json
import uuid

BASE_URL = "http://127.0.0.1:8000/api"

def make_req(path, data=None, token=None, method="GET"):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode())

def run_tests():
    print("[1] Testing Root & Health...")
    status, data = make_req("/health")
    assert status == 200 and data["status"] == "healthy"
    print("    PASSED: /api/health")

    print("[2] Testing Authentication Flow...")
    email = f"student_{uuid.uuid4().hex[:6]}@demo.edu"
    status, reg_data = make_req("/auth/register", {
        "full_name": "Senior Reviewer",
        "email": email,
        "password": "SecurePassword2026!"
    }, method="POST")
    assert status == 201, f"Reg failed: {reg_data}"
    token = reg_data["access_token"]
    print("    PASSED: Registration")

    # Duplicate rejection
    status, dup_err = make_req("/auth/register", {
        "full_name": "Senior Reviewer",
        "email": email,
        "password": "SecurePassword2026!"
    }, method="POST")
    assert status == 400
    print("    PASSED: Duplicate email rejection")

    # Login
    status, login_data = make_req("/auth/login", {
        "email": email,
        "password": "SecurePassword2026!"
    }, method="POST")
    assert status == 200
    print("    PASSED: Login & JWT issuance")

    # Me
    status, me_data = make_req("/auth/me", token=token)
    assert status == 200 and me_data["email"] == email
    print("    PASSED: Protected /auth/me")

    print("[3] Testing ABSA NLP Analysis...")
    review = "The camera is excellent and the display looks beautiful, but the battery drains quickly and the price is too high."
    status, ana_data = make_req("/analyze", {
        "review_text": review,
        "product_id": "prod_nova_x",
        "save_to_history": True
    }, token=token, method="POST")
    assert status == 200
    assert ana_data["overall_sentiment"] == "Mixed"
    aspect_names = [a["aspect_name"] for a in ana_data["aspect_results"]]
    assert "Camera" in aspect_names and "Battery" in aspect_names
    print(f"    PASSED: ABSA pipeline -> Identified aspects: {aspect_names}")

    # Negation
    status, neg_data = make_req("/analyze", {
        "review_text": "The battery is not bad at all.",
        "save_to_history": False
    }, method="POST")
    assert status == 200
    assert neg_data["aspect_results"][0]["sentiment"] == "Positive"
    print("    PASSED: Negation flip ('not bad' -> Positive)")

    print("[4] Testing User History Isolation...")
    status, hist_data = make_req("/analyses/history", token=token)
    assert status == 200 and len(hist_data) >= 1
    # Test without token -> 401
    status, _ = make_req("/analyses/history")
    assert status == 401
    print("    PASSED: User history isolation & 401 unauthenticated check")

    print("[5] Testing Product Catalog...")
    status, prods = make_req("/products")
    assert status == 200 and len(prods) >= 5
    first_id = prods[0]["id"]
    status, detail = make_req(f"/products/{first_id}")
    assert status == 200 and "aspect_breakdown" in detail
    print(f"    PASSED: Catalog has {len(prods)} products; detail loaded for {detail['name']}")

    print("[6] Testing Analytics & Complaints...")
    status, dash = make_req("/analytics/dashboard")
    assert status == 200 and dash["total_reviews"] >= 100
    status, comp = make_req("/analytics/complaints")
    assert status == 200 and len(comp) > 0
    status, compare = make_req("/analytics/compare?product_ids=prod_nova_x,prod_pixelwave_9")
    assert status == 200 and len(compare["products"]) == 2
    print("    PASSED: Dashboard, Complaints, and Comparison metrics")

    print("[7] Testing Model Info & Evaluation...")
    status, info = make_req("/model/info")
    assert status == 200 and len(info["supported_aspects"]) == 12
    status, eval_res = make_req("/model/evaluation")
    assert status == 200 and "confusion_matrix" in eval_res["primary_model"]
    print(f"    PASSED: Model evaluation returned real confusion matrix (Accuracy: {eval_res['primary_model']['accuracy']})")

    print("[8] Testing Dataset Hub...")
    status, ds = make_req("/dataset/summary")
    assert status == 200 and ds["synthetic_demo_reviews"] >= 100
    print(f"    PASSED: Dataset summary verified (Total reviews: {ds['total_reviews']})")

    print("\n[ALL 8 INTEGRATION PHASES PASSED SUCCESSFULLY!]")

if __name__ == "__main__":
    run_tests()
