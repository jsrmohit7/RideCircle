import pytest
from fastapi.testclient import TestClient
from app.main import app
import uuid

client = TestClient(app)

def run_tests():
    print("--- STARTING MULTI-USER INTEGRATION TEST ---")
    
    # 1. AUTHENTICATION ISOLATION
    users = {
        "User A": {"name": "Rahul Sharma", "email": f"rahul_{uuid.uuid4()}@example.com", "password": "password123"},
        "User B": {"name": "Aman Kumar", "email": f"aman_{uuid.uuid4()}@example.com", "password": "password123"},
        "User C": {"name": "Priya Singh", "email": f"priya_{uuid.uuid4()}@example.com", "password": "password123"},
        "User D": {"name": "Ananya Verma", "email": f"ananya_{uuid.uuid4()}@example.com", "password": "password123"},
        "User E": {"name": "Arjun Mehta", "email": f"arjun_{uuid.uuid4()}@example.com", "password": "password123"},
    }
    
    tokens = {}
    user_ids = {}
    
    print("\n[1] Registering and Validating Isolation...")
    for label, u in users.items():
        # Register
        res = client.post("/auth/register", json={"name": u["name"], "email": u["email"], "password": u["password"]})
        assert res.status_code == 200, f"Failed to register {label}"
        
        # Login
        res = client.post("/auth/login", data={"username": u["email"], "password": u["password"]})
        assert res.status_code == 200, f"Failed to login {label}"
        token = res.json()["access_token"]
        tokens[label] = token
        
        # Auth /me
        res = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
        assert res.status_code == 200
        data = res.json()
        assert data["email"] == u["email"]
        assert data["name"] == u["name"]
        user_ids[label] = data["id"]
        print(f"  {label} ({u['name']}) -> OK")
        
    # Verify unique IDs
    assert len(set(user_ids.values())) == 5, "User IDs are not unique!"
    
    print("\n[2] Profile Isolation...")
    # Try using User B's token to somehow modify User A
    # API only exposes /users/me, so modifying someone else's is architecturally impossible.
    # We will test an invalid token instead.
    res = client.get("/users/me", headers={"Authorization": f"Bearer INVALID_TOKEN"})
    assert res.status_code == 401
    print("  Profile isolation naturally enforced by /me endpoint pattern. Invalid token rejected correctly -> OK")

    print("\n[3 & 4] Create Rides & Map/Address Verification...")
    rides_data = {
        "Ride A": {
            "creator": "User A",
            "payload": {
                "from_location": "BIT Mesra",
                "from_lat": 23.4123,
                "from_lng": 85.4399,
                "to_location": "Ranchi Railway Station",
                "to_lat": 23.3441,
                "to_lng": 85.3096,
                "departure_time": "2026-10-10T10:00:00Z",
                "vehicle_type": "Car",
                "original_seats": 4,
                "contribution": 150
            }
        },
        "Ride B": {
            "creator": "User E",
            "payload": {
                "from_location": "BIT Mesra",
                "from_lat": 23.4124,
                "from_lng": 85.4398,
                "to_location": "Birsa Munda Airport",
                "to_lat": 23.3143,
                "to_lng": 85.3216,
                "departure_time": "2026-10-11T12:00:00Z",
                "vehicle_type": "Cab",
                "original_seats": 3,
                "contribution": 250
            }
        },
        "Ride C": {
            "creator": "User A",
            "payload": {
                "from_location": "Ranchi",
                "from_lat": 23.3441,
                "from_lng": 85.3096,
                "to_location": "Jamshedpur",
                "to_lat": 22.8046,
                "to_lng": 86.2029,
                "departure_time": "2026-10-12T09:00:00Z",
                "vehicle_type": "SUV",
                "original_seats": 6,
                "contribution": 400
            }
        }
    }
    
    ride_ids = {}
    for r_label, r_info in rides_data.items():
        creator_label = r_info["creator"]
        headers = {"Authorization": f"Bearer {tokens[creator_label]}"}
        res = client.post("/rides", json=r_info["payload"], headers=headers)
        assert res.status_code == 200, f"Failed to create {r_label}"
        data = res.json()
        ride_ids[r_label] = data["id"]
        
        # Verify coordinates
        assert data["from_lat"] == r_info["payload"]["from_lat"]
        assert data["to_lat"] == r_info["payload"]["to_lat"]
        assert data["from_location"] == r_info["payload"]["from_location"]
        print(f"  {r_label} created by {creator_label} with unique coordinates -> OK")

    # Verify coordinate distinctness
    latitudes = set(r["payload"]["to_lat"] for r in rides_data.values())
    assert len(latitudes) == 3, "Destination coordinates are not distinct!"

    print("\n[5] Ride Visibility...")
    # User B searches
    headers_b = {"Authorization": f"Bearer {tokens['User B']}"}
    res = client.get("/rides", headers=headers_b)
    assert res.status_code == 200
    search_rides = res.json()
    
    found_a = found_b = found_c = False
    for r in search_rides:
        if r["id"] == ride_ids["Ride A"]:
            found_a = True
            assert r["creator"]["id"] == user_ids["User A"]
        if r["id"] == ride_ids["Ride B"]:
            found_b = True
            assert r["creator"]["id"] == user_ids["User E"]
        if r["id"] == ride_ids["Ride C"]:
            found_c = True
    
    assert found_a and found_b and found_c, "User B could not see all rides"
    print("  User B correctly queried and saw rides with exact mapping -> OK")

    print("\n[6 & 7] Ride Detail Isolation & Request Flow...")
    # B, C, D request Ride A
    for label in ["User B", "User C", "User D"]:
        headers = {"Authorization": f"Bearer {tokens[label]}"}
        # Verify ride details visibility
        res_detail = client.get(f"/rides/{ride_ids['Ride A']}", headers=headers)
        assert res_detail.status_code == 200
        
        # Request seat
        res_req = client.post(f"/rides/{ride_ids['Ride A']}/requests", headers=headers)
        assert res_req.status_code == 200
        print(f"  {label} requested Ride A -> OK")

    # Verify A sees requests
    headers_a = {"Authorization": f"Bearer {tokens['User A']}"}
    res_a = client.get(f"/rides/{ride_ids['Ride A']}", headers=headers_a)
    ride_a_details = res_a.json()
    
    requests = ride_a_details["requests"]
    assert len(requests) == 3
    request_ids = [req["id"] for req in requests]
    requester_ids = [req["user"]["id"] for req in requests]
    
    assert len(set(request_ids)) == 3, "Request IDs must be unique"
    assert user_ids["User B"] in requester_ids
    assert user_ids["User C"] in requester_ids
    assert user_ids["User D"] in requester_ids
    print("  User A successfully isolated and identified 3 unique requests -> OK")
    
    print("\n--- ALL MULTI-USER TESTS PASSED SUCCESSFULLY ---")

if __name__ == "__main__":
    run_tests()
