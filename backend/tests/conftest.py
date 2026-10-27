import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.core.database import SessionLocal, Base, engine

@pytest.fixture(scope="session")
def client():
    # Make sure tables exist
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
