import requests
import time

BASE_URL = "http://localhost:8080"

def test_flow():
    print("1. Registering User A (Driver)")
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "driver4@example.com",
        "password": "password",
        "name": "Alice Driver"
    })
    
    # Try logging in
    res = requests.post(f"{BASE_URL}/auth/login", data={
        "username": "driver4@example.com",
        "password": "password"
    })
    token_a = res.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    print("2. Registering User B (Passenger)")
    requests.post(f"{BASE_URL}/auth/register", json={
        "email": "passenger4@example.com",
        "password": "password",
        "name": "Bob Passenger"
    })
    res = requests.post(f"{BASE_URL}/auth/login", data={
        "username": "passenger4@example.com",
        "password": "password"
    })
    token_b = res.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    print("3. User A offers a ride")
    res = requests.post(f"{BASE_URL}/rides/", headers=headers_a, json={
        "from_location": "BIT Mesra",
        "to_location": "Airport",
        "departure_time": "2026-10-01T10:00:00Z",
        "vehicle_type": "CAR",
        "original_seats": 3,
        "contribution": 150
    })
    ride_id = res.json()["id"]
    print(f"Ride created: {ride_id}")

    print("4. User B searches and requests the ride")
    res = requests.get(f"{BASE_URL}/rides", headers=headers_b)
    assert len(res.json()) > 0
    
    res = requests.post(f"{BASE_URL}/rides/{ride_id}/requests", headers=headers_b)
    print("Request sent")

    print("5. User A accepts the request")
    # Fetch ride to get request id
    res = requests.get(f"{BASE_URL}/rides/{ride_id}", headers=headers_a)
    ride_data = res.json()
    reqs = ride_data.get("requests", [])
    if not reqs:
        raise Exception("No requests found in ride_data: " + str(ride_data))
    req_id = reqs[0]["id"]
    
    res = requests.patch(f"{BASE_URL}/rides/requests/{req_id}", headers=headers_a, params={"action": "ACCEPT"})
    print("Request accepted")

    print("6. Both chat")
    requests.post(f"{BASE_URL}/rides/{ride_id}/messages", headers=headers_a, json={"message": "Hi, I will pick you up at gate 1."})
    requests.post(f"{BASE_URL}/rides/{ride_id}/messages", headers=headers_b, json={"message": "Awesome, see you there!"})
    
    res = requests.get(f"{BASE_URL}/rides/{ride_id}/messages", headers=headers_b)
    print(f"Messages: {len(res.json())}")

    print("7. User A completes the ride")
    requests.post(f"{BASE_URL}/rides/{ride_id}/complete", headers=headers_a)
    print("Ride completed")

    print("8. User B rates User A")
    creator_id = ride_data["creator_id"]
    requests.post(f"{BASE_URL}/ratings/", headers=headers_b, json={
        "ride_id": ride_id,
        "to_user_id": creator_id,
        "rating": 5,
        "feedback": "Great driver!"
    })
    print("Rating submitted")
    
    print("ALL TESTS PASSED")

if __name__ == "__main__":
    test_flow()
