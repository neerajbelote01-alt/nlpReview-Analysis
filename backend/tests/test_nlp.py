import pytest
from app.nlp.pipeline import pipeline

def test_nlp_multi_aspect_and_mixed_sentiment():
    # Example directly from prompt
    review = "The camera is excellent and the display looks beautiful, but the battery drains quickly and the price is too high."
    res = pipeline.analyze_review(review)
    assert res["overall_sentiment"] == "Mixed"
    
    aspect_map = {a["aspect"]: a["sentiment"] for a in res["aspects"]}
    assert "Camera" in aspect_map
    assert aspect_map["Camera"] == "Positive"
    assert "Display" in aspect_map
    assert aspect_map["Display"] == "Positive"
    assert "Battery" in aspect_map
    assert aspect_map["Battery"] == "Negative"
    assert "Price" in aspect_map
    assert aspect_map["Price"] == "Negative"

def test_nlp_negation_handling():
    # Negated negative should be positive
    res_pos = pipeline.analyze_review("The battery is not bad.")
    assert len(res_pos["aspects"]) >= 1
    assert res_pos["aspects"][0]["aspect"] == "Battery"
    assert res_pos["aspects"][0]["sentiment"] == "Positive"

    # Negated positive should be negative
    res_neg = pipeline.analyze_review("The battery is not good.")
    assert len(res_neg["aspects"]) >= 1
    assert res_neg["aspects"][0]["aspect"] == "Battery"
    assert res_neg["aspects"][0]["sentiment"] == "Negative"

def test_nlp_mixed_aspect():
    res = pipeline.analyze_review("The performance is fast, but the phone heats up during gaming.")
    perf_aspect = next((a for a in res["aspects"] if a["aspect"] == "Performance"), None)
    assert perf_aspect is not None
    assert perf_aspect["sentiment"] == "Mixed"

def test_nlp_empty_input():
    res = pipeline.analyze_review("   ")
    assert res["overall_sentiment"] == "Uncertain"
    assert res["aspects"] == []
