import uuid
from datetime import datetime, timedelta
from app.db.database import SessionLocal
from app.models.models import User, College, Ride, RideStatus, RidePassenger, RideRequest, RequestStatus, Message, Rating, Report, ReportReason, ReportStatus
from app.core.security import get_password_hash

def seed_data():
    db = SessionLocal()
    
    # Check if already seeded
    if db.query(College).first():
        print("Database already seeded")
        return
        
    print("Seeding database...")
    
    # Create Colleges
    college1 = College(name="IIT Delhi", city="New Delhi", state="Delhi", domain="iitd.ac.in")
    college2 = College(name="NIT Trichy", city="Tiruchirappalli", state="Tamil Nadu", domain="nitt.edu")
    college3 = College(name="BITS Pilani", city="Pilani", state="Rajasthan", domain="bits-pilani.ac.in")
    db.add_all([college1, college2, college3])
    db.commit()
    
    # Create Users
    user1 = User(name="Mohit Kumar", email="mohit@iitd.ac.in", password_hash=get_password_hash("password123"), college_id=college1.id, verified=True, rating=4.8, total_rides=12)
    user2 = User(name="Rahul Sharma", email="rahul@nitt.edu", password_hash=get_password_hash("password123"), college_id=college2.id, verified=True, rating=4.5, total_rides=5)
    user3 = User(name="Priya Singh", email="priya@bits-pilani.ac.in", password_hash=get_password_hash("password123"), college_id=college3.id, verified=True, rating=5.0, total_rides=2)
    user4 = User(name="Aman Gupta", email="aman@iitd.ac.in", password_hash=get_password_hash("password123"), college_id=college1.id, verified=False, rating=4.0, total_rides=1)
    user5 = User(name="Ananya Verma", email="ananya@iitd.ac.in", password_hash=get_password_hash("password123"), college_id=college1.id, verified=True, rating=4.9, total_rides=8)
    db.add_all([user1, user2, user3, user4, user5])
    db.commit()
    
    # Create Rides
    now = datetime.utcnow()
    ride1 = Ride(creator_id=user1.id, from_location="IIT Delhi Main Gate", to_location="New Delhi Railway Station", departure_time=now + timedelta(days=1, hours=2), vehicle_type="Uber Go", original_seats=3, available_seats=2, contribution=150, status=RideStatus.UPCOMING)
    ride2 = Ride(creator_id=user2.id, from_location="NIT Trichy", to_location="Chennai Airport", departure_time=now + timedelta(days=3), vehicle_type="Personal Car", original_seats=4, available_seats=4, contribution=800, status=RideStatus.UPCOMING)
    ride3 = Ride(creator_id=user5.id, from_location="Connaught Place", to_location="IIT Delhi", departure_time=now - timedelta(days=1), vehicle_type="Auto", original_seats=2, available_seats=0, contribution=80, status=RideStatus.COMPLETED)
    db.add_all([ride1, ride2, ride3])
    db.commit()
    
    # Create Passengers
    pass1 = RidePassenger(ride_id=ride1.id, user_id=user4.id)
    pass2 = RidePassenger(ride_id=ride3.id, user_id=user1.id)
    db.add_all([pass1, pass2])
    db.commit()
    
    # Create Requests
    req1 = RideRequest(ride_id=ride1.id, user_id=user4.id, status=RequestStatus.ACCEPTED)
    req2 = RideRequest(ride_id=ride2.id, user_id=user3.id, status=RequestStatus.PENDING)
    db.add_all([req1, req2])
    db.commit()
    
    # Create Messages
    msg1 = Message(ride_id=ride1.id, sender_id=user1.id, message="Hey Aman, I'll be at the main gate by 5 PM.")
    msg2 = Message(ride_id=ride1.id, sender_id=user4.id, message="Perfect, see you there!")
    db.add_all([msg1, msg2])
    db.commit()
    
    # Create Ratings
    rate1 = Rating(ride_id=ride3.id, from_user_id=user1.id, to_user_id=user5.id, rating=5, feedback="Great ride, very punctual.")
    db.add(rate1)
    db.commit()
    
    print("Seeding complete.")

if __name__ == "__main__":
    seed_data()
