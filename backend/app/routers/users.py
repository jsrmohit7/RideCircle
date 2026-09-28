from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_
from app.routers.deps import get_db, get_current_user
from app.schemas.schemas import UserResponse, RideResponse
from app.models.models import User, BlockedUser, Ride, RidePassenger

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/me/rides", response_model=List[RideResponse])
def get_my_rides(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Rides where user is creator OR passenger
    rides = db.query(Ride).options(selectinload(Ride.creator)).outerjoin(RidePassenger).filter(
        or_(
            Ride.creator_id == current_user.id,
            RidePassenger.user_id == current_user.id
        )
    ).all()
    return rides

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/{user_id}/block", status_code=status.HTTP_201_CREATED)
def block_user(user_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot block yourself")
        
    blocked = db.query(BlockedUser).filter_by(blocker_id=current_user.id, blocked_id=user_id).first()
    if blocked:
        raise HTTPException(status_code=400, detail="User already blocked")
        
    block = BlockedUser(blocker_id=current_user.id, blocked_id=user_id)
    db.add(block)
    db.commit()
    return {"status": "User blocked"}

@router.delete("/{user_id}/block")
def unblock_user(user_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    blocked = db.query(BlockedUser).filter_by(blocker_id=current_user.id, blocked_id=user_id).first()
    if not blocked:
        raise HTTPException(status_code=404, detail="Block record not found")
        
    db.delete(blocked)
    db.commit()
    return {"status": "User unblocked"}
