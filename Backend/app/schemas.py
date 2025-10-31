"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime, date
from enum import Enum


# Enums
class UserRole(str, Enum):
    user = "user"
    admin = "admin"


class MembershipStatus(str, Enum):
    active = "active"
    expired = "expired"
    cancelled = "cancelled"
    pending = "pending"


class BookingStatus(str, Enum):
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"
    pending = "pending"


class PaymentStatus(str, Enum):
    success = "success"
    failed = "failed"
    pending = "pending"


class PaymentMethod(str, Enum):
    card = "card"
    cash = "cash"
    upi = "upi"
    wallet = "wallet"
    netbanking = "netbanking"


class DiscountType(str, Enum):
    percent = "percent"
    flat = "flat"


# User Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[UserRole] = UserRole.user  # Default to 'user' if not provided
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, max_length=10)
    phone_number: Optional[str] = Field(None, max_length=20)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    date_of_birth: Optional[date]
    gender: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UserWithStats(UserResponse):
    total_checkins: int
    active_membership: bool


# Membership Plan Schemas
class MembershipPlanCreate(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    duration_months: int = Field(..., gt=0)


class MembershipPlanResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price: float
    duration_months: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Membership Schemas
class MembershipPurchase(BaseModel):
    plan_id: str
    payment_method: PaymentMethod
    coupon_code: Optional[str] = None


class MembershipResponse(BaseModel):
    id: str
    user_id: str
    start_date: date
    end_date: date
    status: MembershipStatus
    plan_name: str
    plan_price: float

    class Config:
        from_attributes = True


# Session Schemas
class SessionCreate(BaseModel):
    studio_id: str
    name: str = Field(..., max_length=100)
    branch_id: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime
    activity_type_id: str
    instructor: Optional[str] = Field(None, max_length=100)
    capacity: int = Field(..., gt=0)

    @validator('end_time')
    def end_after_start(cls, v, values):
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError('end_time must be after start_time')
        return v


class SessionResponse(BaseModel):
    id: str
    studio_id: str
    name: str
    branch_id: str
    branch_name: Optional[str]
    description: Optional[str]
    start_time: datetime
    end_time: datetime
    activity_type_id: str
    activity_type_name: Optional[str]
    instructor: Optional[str]
    capacity: int
    available_spots: int

    class Config:
        from_attributes = True


# Booking Schemas
class BookingCreate(BaseModel):
    session_id: str


class BookingResponse(BaseModel):
    id: str
    user_id: str
    session_id: str
    session_name: Optional[str]
    start_time: Optional[datetime]
    status: BookingStatus
    booking_time: datetime

    class Config:
        from_attributes = True


# Payment Schemas
class PaymentCreate(BaseModel):
    amount: float = Field(..., gt=0)
    payment_method: PaymentMethod
    membership_id: Optional[str] = None
    booking_id: Optional[str] = None


class PaymentResponse(BaseModel):
    id: str
    user_id: str
    amount: float
    payment_method: PaymentMethod
    payment_time: datetime
    status: PaymentStatus

    class Config:
        from_attributes = True


# Coupon Schemas
class CouponCreate(BaseModel):
    code: str = Field(..., max_length=50)
    description: Optional[str] = None
    discount_type: DiscountType
    discount_value: float = Field(..., gt=0)
    valid_from: datetime
    valid_to: datetime

    @validator('valid_to')
    def valid_to_after_from(cls, v, values):
        if 'valid_from' in values and v <= values['valid_from']:
            raise ValueError('valid_to must be after valid_from')
        return v


class CouponResponse(BaseModel):
    id: str
    code: str
    description: Optional[str]
    discount_type: DiscountType
    discount_value: float
    valid_from: datetime
    valid_to: datetime
    is_active: bool

    class Config:
        from_attributes = True


class ApplyCoupon(BaseModel):
    coupon_code: str
    payment_id: str


# Branch Schemas
class BranchCreate(BaseModel):
    name: str = Field(..., max_length=100)
    address: Optional[str] = None
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    zip_code: Optional[str] = Field(None, max_length=20)
    phone: Optional[str] = Field(None, max_length=20)


class BranchResponse(BaseModel):
    id: str
    name: str
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    phone: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Studio Schemas
class StudioCreate(BaseModel):
    name: str = Field(..., max_length=100)
    floor: Optional[int] = None
    capacity: int = Field(..., gt=0)
    branch_id: str


class StudioResponse(BaseModel):
    id: str
    name: str
    floor: Optional[int]
    capacity: int
    branch_id: str
    branch_name: Optional[str]

    class Config:
        from_attributes = True


# Activity Type Schemas
class ActivityTypeCreate(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None


class ActivityTypeResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Check-in Schemas
class CheckinCreate(BaseModel):
    session_id: str


class CheckinResponse(BaseModel):
    id: str
    user_id: str
    session_id: str
    branch_id: str
    checkin_time: datetime

    class Config:
        from_attributes = True


# Report Schemas
class RevenueReport(BaseModel):
    branch_name: str
    city: Optional[str]
    total_sessions: int
    total_bookings: int
    total_revenue: float


class UserActivityReport(BaseModel):
    name: str
    email: str
    total_checkins: int
    branches_visited: int
    first_checkin: Optional[datetime]
    last_checkin: Optional[datetime]
    cancelled_bookings: int


class SessionPopularityReport(BaseModel):
    session_name: str
    instructor: Optional[str]
    activity_type: str
    branch_name: str
    total_bookings: int
    max_capacity: int
    booking_percentage: float


# Generic Response
class MessageResponse(BaseModel):
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    detail: str
    success: bool = False
