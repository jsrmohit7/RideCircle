import uuid
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Enum, UniqueConstraint, CheckConstraint, Uuid
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.database import Base

class RideStatus(str, enum.Enum):
    UPCOMING = "UPCOMING"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    DECLINED = "DECLINED"
    CANCELLED = "CANCELLED"

class ReportStatus(str, enum.Enum):
    OPEN = "OPEN"
    REVIEWING = "REVIEWING"
    RESOLVED = "RESOLVED"
    DISMISSED = "DISMISSED"

class ReportReason(str, enum.Enum):
    HARASSMENT = "HARASSMENT"
    MISCONDUCT = "MISCONDUCT"
    FAKE_PROFILE = "FAKE_PROFILE"
    UNSAFE_BEHAVIOR = "UNSAFE_BEHAVIOR"
    SPAM = "SPAM"
    OTHER = "OTHER"

class College(Base):
    __tablename__ = "colleges"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    college_id = Column(Uuid(as_uuid=True), ForeignKey("colleges.id"))
    profile_image = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    rating = Column(Float, default=5.0)
    total_rides = Column(Integer, default=0)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    college = relationship("College")
    created_rides = relationship("Ride", back_populates="creator")

class Ride(Base):
    __tablename__ = "rides"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    from_location = Column(String, nullable=False)
    to_location = Column(String, nullable=False)
    from_lat = Column(Float, nullable=True)
    from_lng = Column(Float, nullable=True)
    to_lat = Column(Float, nullable=True)
    to_lng = Column(Float, nullable=True)
    departure_time = Column(DateTime(timezone=True), nullable=False)
    vehicle_type = Column(String, nullable=False)
    original_seats = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)
    contribution = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(Enum(RideStatus), default=RideStatus.UPCOMING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    creator = relationship("User", back_populates="created_rides")
    requests = relationship("RideRequest", back_populates="ride")
    passengers = relationship("RidePassenger", back_populates="ride")
    messages = relationship("Message", back_populates="ride")

class RideRequest(Base):
    __tablename__ = "ride_requests"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(Uuid(as_uuid=True), ForeignKey("rides.id"), nullable=False)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    ride = relationship("Ride", back_populates="requests")
    user = relationship("User")

    __table_args__ = (UniqueConstraint('ride_id', 'user_id', name='uq_ride_user_request'),)

class RidePassenger(Base):
    __tablename__ = "ride_passengers"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(Uuid(as_uuid=True), ForeignKey("rides.id"), nullable=False)
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    ride = relationship("Ride", back_populates="passengers")
    user = relationship("User")

    __table_args__ = (UniqueConstraint('ride_id', 'user_id', name='uq_ride_user_passenger'),)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(Uuid(as_uuid=True), ForeignKey("rides.id"), nullable=False)
    sender_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    ride = relationship("Ride", back_populates="messages")
    sender = relationship("User")

class Rating(Base):
    __tablename__ = "ratings"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id = Column(Uuid(as_uuid=True), ForeignKey("rides.id"), nullable=False)
    from_user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    to_user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
        UniqueConstraint('ride_id', 'from_user_id', 'to_user_id', name='uq_ride_from_to_rating'),
    )

class Report(Base):
    __tablename__ = "reports"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reported_user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    ride_id = Column(Uuid(as_uuid=True), ForeignKey("rides.id"), nullable=True)
    reason = Column(Enum(ReportReason), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ReportStatus), default=ReportStatus.OPEN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BlockedUser(Base):
    __tablename__ = "blocked_users"
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    blocker_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    blocked_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (UniqueConstraint('blocker_id', 'blocked_id', name='uq_blocker_blocked'),)
