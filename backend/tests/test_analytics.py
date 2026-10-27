import pytest

def test_dashboard_endpoint(client):
    res = client.get("/api/analytics/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert data["total_products"] >= 5
    assert data["total_reviews"] >= 100
    assert "sentiment_distribution" in data
    dist = data["sentiment_distribution"]
    assert dist["positive"] + dist["negative"] + dist["neutral"] + dist["mixed"] > 0
    assert len(data["most_frequent_aspects"]) > 0

def test_aspects_analytics_endpoint(client):
    res = client.get("/api/analytics/aspects")
    assert res.status_code == 200
    data = res.json()
    assert "aspects" in data
    assert len(data["aspects"]) > 0
    first = data["aspects"][0]
    assert "aspect_name" in first
    assert "total_mentions" in first
    assert "sentiments" in first

def test_complaints_endpoint(client):
    res = client.get("/api/analytics/complaints")
    assert res.status_code == 200
    complaints = res.json()
    assert isinstance(complaints, list)
    assert len(complaints) > 0
    first_c = complaints[0]
    assert "aspect_name" in first_c
    assert "problem_count" in first_c
    assert "representative_excerpts" in first_c

def test_compare_endpoint(client):
    res = client.get("/api/analytics/compare?product_ids=prod_nova_x,prod_pixelwave_9")
    assert res.status_code == 200
    data = res.json()
    assert "products" in data
    assert len(data["products"]) == 2
    p1 = data["products"][0]
    assert p1["id"] in ["prod_nova_x", "prod_pixelwave_9"]
    assert "aspects" in p1
