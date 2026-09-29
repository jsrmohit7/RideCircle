import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine, SessionLocal
from app.models.models import User

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.routers.deps import get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module", autouse=True)
def override_db_dependency():
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@patch("app.routers.auth.id_token.verify_oauth2_token")
def test_google_login_persistence(mock_verify):
    mock_verify.return_value = {
        "email": "googleuser@college.edu",
        "name": "Google User",
        "picture": "https://example.com/google_pic.jpg",
        "email_verified": True
    }
    
    # 1. Google Login (create user)
    response = client.post("/auth/google", json={"credential": "mocked_token"})
    assert response.status_code == 200
    token = response.json()["access_token"]
    
    # 2. Fetch current user
    headers = {"Authorization": f"Bearer {token}"}
    me_response = client.get("/auth/me", headers=headers)
    assert me_response.status_code == 200
    user_data = me_response.json()
    assert user_data["profile_image"] == "https://example.com/google_pic.jpg"
    
    # 3. Logout / Login again (simulate)
    mock_verify.return_value["picture"] = "https://example.com/new_pic.jpg" # Simulate updated pic
    response2 = client.post("/auth/google", json={"credential": "mocked_token2"})
    assert response2.status_code == 200
    token2 = response2.json()["access_token"]
    
    # 4. Fetch current user again
    headers2 = {"Authorization": f"Bearer {token2}"}
    me_response2 = client.get("/auth/me", headers=headers2)
    assert me_response2.status_code == 200
    user_data2 = me_response2.json()
    assert user_data2["profile_image"] == "https://example.com/new_pic.jpg"

    # Multi-user isolation test
    mock_verify.return_value = {
        "email": "user2@college.edu",
        "name": "User Two",
        "picture": "https://example.com/user2.jpg",
        "email_verified": True
    }
    response3 = client.post("/auth/google", json={"credential": "mocked_token3"})
    token3 = response3.json()["access_token"]
    me_response3 = client.get("/auth/me", headers={"Authorization": f"Bearer {token3}"})
    assert me_response3.json()["profile_image"] == "https://example.com/user2.jpg"
