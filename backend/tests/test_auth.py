import pytest
import uuid

def test_user_registration_and_login(client):
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    reg_payload = {
        "full_name": "Test User",
        "email": unique_email,
        "password": "Password123!"
    }
    # 1. Register
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == unique_email

    # 2. Duplicate registration rejected
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 400
    assert "already exists" in dup_res.json()["detail"].lower()

    # 3. Login with correct password
    login_res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "Password123!"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # 4. Login with invalid password
    bad_login = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 5. Access protected /api/auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == unique_email

    # 6. Reject unauthenticated access
    unauth_res = client.get("/api/auth/me")
    assert unauth_res.status_code == 401

def test_user_history_isolation(client):
    # Create User A
    email_a = f"usera_{uuid.uuid4().hex[:6]}@example.com"
    reg_a = client.post("/api/auth/register", json={
        "full_name": "User A",
        "email": email_a,
        "password": "Password123!"
    }).json()
    token_a = reg_a["access_token"]

    # Create User B
    email_b = f"userb_{uuid.uuid4().hex[:6]}@example.com"
    reg_b = client.post("/api/auth/register", json={
        "full_name": "User B",
        "email": email_b,
        "password": "Password123!"
    }).json()
    token_b = reg_b["access_token"]

    # User A analyzes a private review with save_to_history=True
    client.post(
        "/api/analyze",
        json={
            "review_text": "User A private review: Fantastic camera and stunning display.",
            "save_to_history": True
        },
        headers={"Authorization": f"Bearer {token_a}"}
    )

    # Check User A history: contains the review
    history_a = client.get(
        "/api/analyses/history",
        headers={"Authorization": f"Bearer {token_a}"}
    ).json()
    assert len(history_a) >= 1
    assert any("User A private review" in item["review_text"] for item in history_a)

    # Check User B history: must NOT contain User A's review!
    history_b = client.get(
        "/api/analyses/history",
        headers={"Authorization": f"Bearer {token_b}"}
    ).json()
    assert not any("User A private review" in item["review_text"] for item in history_b)
