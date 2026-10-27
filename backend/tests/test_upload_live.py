import httpx

def test_live_upload():
    csv_bytes = b"review_text,rating\n\"The camera is gorgeous and charging is fast.\",5\n\"Terrible battery life and screen is dim.\",2\n"
    files = {"file": ("test.csv", csv_bytes, "text/csv")}
    r = httpx.post("http://127.0.0.1:8000/api/dataset/upload?product_id=prod_nova_x", files=files)
    assert r.status_code == 200, f"Upload error: {r.text}"
    data = r.json()
    assert data["status"] == "success"
    assert data["imported_count"] == 2
    print(f"[OK] Live dataset upload succeeded: {data}")

if __name__ == "__main__":
    test_live_upload()
