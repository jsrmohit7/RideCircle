from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from app.models.models import RideStatus, RequestStatus, ReportStatus, ReportReason

# Users
class UserBase(BaseModel):
    name: str
    email: EmailStr
    college_id: Optional[UUID] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: UUID
    rating: float
    total_rides: int
    verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[UUID] = None

class GoogleLoginRequest(BaseModel):
    credential: str

# Rides
class RideBase(BaseModel):
    from_location: str
    to_location: str
    departure_time: datetime
    vehicle_type: str
    original_seats: int
    contribution: float
    notes: Optional[str] = None
    from_lat: Optional[float] = None
    from_lng: Optional[float] = None
    to_lat: Optional[float] = None
    to_lng: Optional[float] = None

class RideCreate(RideBase):
    pass

class RideRequestWithUserResponse(BaseModel):
    id: UUID
    status: RequestStatus
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

class RidePassengerResponse(BaseModel):
    id: UUID
    joined_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

class RideResponse(RideBase):
    id: UUID
    creator_id: UUID
    creator: Optional[UserResponse] = None
    available_seats: int
    status: RideStatus
    created_at: datetime
    requests: Optional[List[RideRequestWithUserResponse]] = []
    passengers: Optional[List[RidePassengerResponse]] = []
    
    class Config:
        from_attributes = True

# Requests
class RideRequestResponse(BaseModel):
    id: UUID
    ride_id: UUID
    user_id: UUID
    status: RequestStatus
    created_at: datetime

    class Config:
        from_attributes = True

# Messages
class MessageCreate(BaseModel):
    message: str

class MessageResponse(MessageCreate):
    id: UUID
    ride_id: UUID
    sender_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Ratings
class RatingCreate(BaseModel):
    ride_id: UUID
    to_user_id: UUID
    rating: int = Field(..., ge=1, le=5)
    feedback: Optional[str] = None

class RatingResponse(RatingCreate):
    id: UUID
    from_user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# Reports
class ReportCreate(BaseModel):
    reported_user_id: UUID
    ride_id: Optional[UUID] = None
    reason: ReportReason
    description: Optional[str] = None

class ReportResponse(ReportCreate):
    id: UUID
    reporter_id: UUID
    status: ReportStatus
    created_at: datetime

    class Config:
        from_attributes = True
