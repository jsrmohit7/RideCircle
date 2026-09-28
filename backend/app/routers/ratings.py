from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.routers.deps import get_db, get_current_user
from app.schemas.schemas import RatingCreate, RatingResponse
from app.models.models import User, Ride, RideStatus, RidePassenger, Rating

router = APIRouter(prefix="/ratings", tags=["ratings"])

@router.post("", response_model=RatingResponse)
def create_rating(rating_in: RatingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if rating_in.to_user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot rate yourself")
        
    ride = db.query(Ride).filter(Ride.id == rating_in.ride_id).first()
    if not ride or ride.status != RideStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Ride must be completed")
        
    # Check participation
    is_rater_participant = (ride.creator_id == current_user.id) or (db.query(RidePassenger).filter_by(ride_id=ride.id, user_id=current_user.id).first() is not None)
    is_rated_participant = (ride.creator_id == rating_in.to_user_id) or (db.query(RidePassenger).filter_by(ride_id=ride.id, user_id=rating_in.to_user_id).first() is not None)
    
    if not is_rater_participant or not is_rated_participant:
        raise HTTPException(status_code=400, detail="Both users must have participated in the ride")
        
    existing = db.query(Rating).filter_by(ride_id=ride.id, from_user_id=current_user.id, to_user_id=rating_in.to_user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already rated this user for this ride")
        
    rating = Rating(
        ride_id=ride.id,
        from_user_id=current_user.id,
        to_user_id=rating_in.to_user_id,
        rating=rating_in.rating,
        feedback=rating_in.feedback
    )
    db.add(rating)
    db.commit()
    db.refresh(rating)
    
    # Update user aggregate rating
    all_ratings = db.query(Rating).filter(Rating.to_user_id == rating_in.to_user_id).all()
    if all_ratings:
        avg = sum([r.rating for r in all_ratings]) / len(all_ratings)
        user_to_update = db.query(User).filter(User.id == rating_in.to_user_id).first()
        user_to_update.rating = avg
        db.commit()
        
    return rating

@router.get("/user/{user_id}", response_model=List[RatingResponse])
def get_user_ratings(user_id: UUID, db: Session = Depends(get_db)):
    ratings = db.query(Rating).filter(Rating.to_user_id == user_id).all()
    return ratings
