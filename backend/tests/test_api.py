from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine, get_db
import pytest

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_register_and_login():
    # Register
    import uuid
    test_email = f"test_{uuid.uuid4()}@example.com"
    user_data = {
        "name": "Test User",
        "email": test_email,
        "password": "password123"
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 200
    assert response.json()["email"] == test_email
    
    # Login
    login_data = {
        "username": test_email,
        "password": "password123"
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    
    token = response.json()["access_token"]
    
    # Get Me
    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == test_email

def test_ride_flow():
    import uuid
    test_email = f"ride_{uuid.uuid4()}@example.com"
    client.post("/auth/register", json={"name": "Driver", "email": test_email, "password": "password123"})
    
    # Login
    login_data = {
        "username": test_email,
        "password": "password123"
    }
    response = client.post("/auth/login", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Ride
    ride_data = {
        "from_location": "Hostel 1",
        "to_location": "Airport",
        "departure_time": "2024-12-31T10:00:00Z",
        "vehicle_type": "Cab",
        "original_seats": 3,
        "contribution": 200.0
    }
    response = client.post("/rides", json=ride_data, headers=headers)
    assert response.status_code == 200
    ride_id = response.json()["id"]
    
    # Search Ride
    response = client.get("/rides")
    assert response.status_code == 200
    rides = response.json()
    assert len(rides) > 0
    assert any(r["id"] == ride_id for r in rides)
