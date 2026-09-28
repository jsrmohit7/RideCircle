from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from datetime import datetime
from app.routers.deps import get_db, get_current_user
from app.schemas.schemas import RideCreate, RideResponse, RideRequestResponse, MessageCreate, MessageResponse
from app.models.models import User, Ride, RideStatus, RideRequest, RequestStatus, RidePassenger, Message

router = APIRouter(prefix="/rides", tags=["rides"])

@router.post("", response_model=RideResponse)
def create_ride(ride_in: RideCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = Ride(
        **ride_in.model_dump(),
        creator_id=current_user.id,
        available_seats=ride_in.original_seats
    )
    db.add(ride)
    db.commit()
    db.refresh(ride)
    
    # Creator is not automatically a passenger in the passenger table, but they are the creator.
    return ride

@router.get("", response_model=List[RideResponse])
def search_rides(
    from_location: Optional[str] = None,
    to_location: Optional[str] = None,
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Ride).options(selectinload(Ride.creator)).filter(Ride.status == RideStatus.UPCOMING, Ride.available_seats > 0)
    
    if from_location:
        query = query.filter(Ride.from_location.ilike(f"%{from_location}%"))
    if to_location:
        query = query.filter(Ride.to_location.ilike(f"%{to_location}%"))
    
    # We could filter by date here, simplified for MVP
    
    rides = query.order_by(Ride.departure_time.asc()).all()
    return rides

@router.get("/{ride_id}", response_model=RideResponse)
def get_ride(ride_id: UUID, db: Session = Depends(get_db)):
    ride = db.query(Ride).options(
        selectinload(Ride.creator),
        selectinload(Ride.passengers).selectinload(RidePassenger.user),
        selectinload(Ride.requests).selectinload(RideRequest.user)
    ).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride

@router.delete("/{ride_id}")
def cancel_ride(ride_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to cancel this ride")
        
    ride.status = RideStatus.CANCELLED
    db.commit()
    return {"status": "Ride cancelled"}

@router.post("/{ride_id}/complete")
def complete_ride(ride_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to complete this ride")
        
    ride.status = RideStatus.COMPLETED
    db.commit()
    return {"status": "Ride completed"}

@router.post("/{ride_id}/requests", response_model=RideRequestResponse)
def request_ride(ride_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride.creator_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot request your own ride")
    if ride.available_seats <= 0:
        raise HTTPException(status_code=400, detail="Ride is full")
        
    existing = db.query(RideRequest).filter_by(ride_id=ride_id, user_id=current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already requested this ride")
        
    req = RideRequest(ride_id=ride_id, user_id=current_user.id)
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@router.patch("/requests/{request_id}")
def update_request(request_id: UUID, action: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    req = db.query(RideRequest).filter(RideRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    ride = db.query(Ride).filter(Ride.id == req.ride_id).first()
    
    if action == "ACCEPT":
        if ride.creator_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        if ride.available_seats <= 0:
            raise HTTPException(status_code=400, detail="Ride is full")
            
        updated = db.query(Ride).filter(Ride.id == req.ride_id, Ride.available_seats > 0).update({"available_seats": Ride.available_seats - 1})
        if not updated:
            db.rollback()
            raise HTTPException(status_code=400, detail="Ride is full (seats were just taken)")

        req.status = RequestStatus.ACCEPTED
        passenger = RidePassenger(ride_id=ride.id, user_id=req.user_id)
        db.add(passenger)
        db.commit()
        return {"status": "Request accepted"}
        
    elif action == "DECLINE":
        if ride.creator_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        req.status = RequestStatus.DECLINED
        db.commit()
        return {"status": "Request declined"}
        
    elif action == "CANCEL":
        if req.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        req.status = RequestStatus.CANCELLED
        db.commit()
        return {"status": "Request cancelled"}
        
    raise HTTPException(status_code=400, detail="Invalid action")

@router.get("/{ride_id}/messages", response_model=List[MessageResponse])
def get_messages(ride_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check participation
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
         raise HTTPException(status_code=404, detail="Ride not found")
    
    is_passenger = db.query(RidePassenger).filter_by(ride_id=ride_id, user_id=current_user.id).first() is not None
    if ride.creator_id != current_user.id and not is_passenger:
         raise HTTPException(status_code=403, detail="Not participating in this ride")
         
    messages = db.query(Message).filter(Message.ride_id == ride_id).order_by(Message.created_at.asc()).all()
    return messages

@router.post("/{ride_id}/messages", response_model=MessageResponse)
def send_message(ride_id: UUID, message_in: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
         raise HTTPException(status_code=404, detail="Ride not found")
    
    is_passenger = db.query(RidePassenger).filter_by(ride_id=ride_id, user_id=current_user.id).first() is not None
    if ride.creator_id != current_user.id and not is_passenger:
         raise HTTPException(status_code=403, detail="Not participating in this ride")
         
    msg = Message(ride_id=ride_id, sender_id=current_user.id, message=message_in.message)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
