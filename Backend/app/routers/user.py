"""
User routes - Registration, Login, Profile, Memberships, Bookings, Check-ins
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import uuid
from datetime import datetime

from ..database import get_db
from ..schemas import (
    UserRegister, UserLogin, UserResponse, UserWithStats,
    MembershipPurchase, MembershipResponse, MessageResponse,
    SessionResponse, BookingCreate, BookingResponse,
    CheckinCreate, CheckinResponse, PaymentResponse,
    MembershipPlanResponse
)
from ..auth import hash_password, verify_password

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/register", response_model=UserResponse)
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    try:
        print(f"[REGISTER] Raw request received")
        print(f"[REGISTER] User object: {user}")
        print(f"[REGISTER] Attempting to register user: {user.email}, role: {user.role}, role type: {type(user.role)}")
        user_id = str(uuid.uuid4())
        hashed_pwd = hash_password(user.password)
        
        # Call stored procedure to add user
        query = text("""
            CALL add_user(:id, :name, :email, :password_hash, :role, :dob, :gender)
        """)
        
        # Get role as string - simplified handling
        role_value = 'user'  # default
        if user.role:
            if isinstance(user.role, str):
                role_value = user.role.lower()
            elif hasattr(user.role, 'value'):
                role_value = user.role.value.lower()
        
        print(f"[REGISTER] Final role_value: {role_value}")
        
        print(f"[REGISTER] Executing stored procedure with params: id={user_id}, name={user.name}, email={user.email}, role={role_value}, dob={user.date_of_birth}, gender={user.gender}")
        
        try:
            db.execute(query, {
                'id': user_id,
                'name': user.name,
                'email': user.email,
                'password_hash': hashed_pwd,
                'role': role_value,
                'dob': user.date_of_birth,
                'gender': user.gender
            })
            print(f"[REGISTER] User inserted successfully")
        except Exception as e:
            print(f"[REGISTER] Error inserting user: {str(e)}")
            raise
        
        # Add phone if provided
        if user.phone_number:
            try:
                phone_query = text("""
                    INSERT INTO user_phones (id, phone_number, user_id, type, verified)
                    VALUES (:id, :phone, :user_id, 'mobile', 0)
                """)
                db.execute(phone_query, {
                    'id': str(uuid.uuid4()),
                    'phone': user.phone_number,
                    'user_id': user_id
                })
                print(f"[REGISTER] Phone number added successfully")
            except Exception as e:
                print(f"[REGISTER] Error adding phone: {str(e)}")
                raise
        
        db.commit()
        print(f"[REGISTER] Transaction committed successfully")
        
        # Fetch and return user
        result = db.execute(
            text("SELECT * FROM users WHERE id = :id"),
            {'id': user_id}
        ).fetchone()
        
        return UserResponse(
            id=result[0],
            name=result[1],
            email=result[2],
            role=result[4],
            date_of_birth=result[5],
            gender=result[6],
            created_at=result[7]
        )
        
    except Exception as e:
        db.rollback()
        print(f"[REGISTER] Exception caught: {type(e).__name__}: {str(e)}")
        if "Duplicate entry" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login")
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return user info
    """
    try:
        print(f"[LOGIN] Attempting to login user: {credentials.email}")
        # Get user by email
        query = text("SELECT * FROM users WHERE email = :email")
        result = db.execute(query, {'email': credentials.email}).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(credentials.password, result[3]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        return {
            "message": "Login successful",
            "user": {
                "id": result[0],
                "name": result[1],
                "email": result[2],
                "role": result[4]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/profile/{user_id}", response_model=UserWithStats)
def get_user_profile(user_id: str, db: Session = Depends(get_db)):
    """
    Get user profile with statistics
    """
    try:
        query = text("""
            SELECT 
                u.*,
                get_user_checkin_count(u.id) as total_checkins,
                is_active_member(u.id) as active_membership
            FROM users u
            WHERE u.id = :user_id
        """)
        
        result = db.execute(query, {'user_id': user_id}).fetchone()
        
        if not result:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserWithStats(
            id=result[0],
            name=result[1],
            email=result[2],
            role=result[4],
            date_of_birth=result[5],
            gender=result[6],
            created_at=result[7],
            total_checkins=result[9],
            active_membership=bool(result[10])
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch profile: {str(e)}"
        )


@router.get("/coupons", response_model=List[dict])
def get_active_coupons(db: Session = Depends(get_db)):
    """
    Get all active and valid coupons
    """
    try:
        query = text("""
            SELECT id, code, description, discount_type, discount_value, 
                   valid_from, valid_to, is_active
            FROM coupons 
            WHERE is_active = 1 
            AND valid_from <= NOW() 
            AND valid_to >= NOW()
            ORDER BY code ASC
        """)
        
        results = db.execute(query).fetchall()
        
        return [
            {
                "id": row[0],
                "code": row[1],
                "description": row[2],
                "discount_type": row[3],
                "discount_value": float(row[4]),
                "valid_from": row[5].isoformat() if row[5] else None,
                "valid_to": row[6].isoformat() if row[6] else None,
                "is_active": bool(row[7])
            }
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch coupons: {str(e)}"
        )


@router.get("/membership-plans", response_model=List[MembershipPlanResponse])
def get_membership_plans(db: Session = Depends(get_db)):
    """
    Get all active membership plans
    """
    try:
        query = text("""
            SELECT * FROM membership_plans 
            WHERE is_active = 1 
            ORDER BY price ASC
        """)
        
        results = db.execute(query).fetchall()
        
        return [
            MembershipPlanResponse(
                id=row[0],
                name=row[1],
                description=row[2],
                price=float(row[3]),
                duration_months=row[4],
                is_active=bool(row[5]),
                created_at=row[6]
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch plans: {str(e)}"
        )


@router.post("/purchase-membership/{user_id}")
def purchase_membership(
    user_id: str,
    purchase: MembershipPurchase,
    db: Session = Depends(get_db)
):
    """
    Purchase a membership plan
    """
    try:
        # Get plan details
        plan_query = text("SELECT price FROM membership_plans WHERE id = :plan_id")
        plan = db.execute(plan_query, {'plan_id': purchase.plan_id}).fetchone()
        
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Membership plan not found"
            )
        
        amount = float(plan[0])
        
        # Call stored procedure
        query = text("""
            CALL purchase_membership(
                :user_id, :plan_id, CURDATE(), :amount, :payment_method,
                @membership_id, @payment_id
            )
        """)
        
        db.execute(query, {
            'user_id': user_id,
            'plan_id': purchase.plan_id,
            'amount': amount,
            'payment_method': purchase.payment_method.value
        })
        
        # Get output variables
        result = db.execute(text("SELECT @membership_id, @payment_id")).fetchone()
        membership_id, payment_id = result[0], result[1]
        
        discount_amount = 0
        coupon_message = ""
        final_amount = amount
        
        # Apply coupon if provided
        if purchase.coupon_code:
            try:
                coupon_query = text("""
                    CALL apply_coupon(:code, :user_id, :payment_id, @discount)
                """)
                db.execute(coupon_query, {
                    'code': purchase.coupon_code,
                    'user_id': user_id,
                    'payment_id': payment_id
                })
                db.commit()  # Commit coupon application
                
                # Get the updated payment amount after coupon
                updated_payment = db.execute(
                    text("SELECT amount FROM payments WHERE id = :id"),
                    {'id': payment_id}
                ).fetchone()
                
                final_amount = float(updated_payment[0]) if updated_payment else amount
                discount_amount = amount - final_amount
                
                if discount_amount > 0:
                    coupon_message = f" Coupon '{purchase.coupon_code}' applied! Saved ₹{discount_amount:.2f}"
                else:
                    coupon_message = f" Note: Coupon '{purchase.coupon_code}' was applied but no discount given"
                    
            except Exception as coupon_error:
                # Log the error but don't fail the purchase - continue without coupon
                error_msg = str(coupon_error)
                
                # Extract meaningful error message from MySQL error
                if "Invalid or inactive coupon" in error_msg:
                    coupon_message = f" Note: Coupon '{purchase.coupon_code}' is invalid or inactive"
                elif "not valid at this time" in error_msg:
                    coupon_message = f" Note: Coupon '{purchase.coupon_code}' is expired"
                else:
                    coupon_message = f" Note: Coupon could not be applied"
                
                print(f"Coupon error: {coupon_error}")
                # Don't rollback the entire transaction, just continue without coupon
        
        # Mark payment as success
        db.execute(
            text("UPDATE payments SET status = 'success' WHERE id = :id"),
            {'id': payment_id}
        )
        
        db.commit()
        
        return {
            "message": f"Membership purchased successfully!{coupon_message}",
            "membership_id": membership_id,
            "payment_id": payment_id,
            "final_amount": final_amount,
            "discount_applied": discount_amount
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Purchase failed: {str(e)}"
        )


@router.get("/my-memberships/{user_id}", response_model=List[MembershipResponse])
def get_user_memberships(user_id: str, db: Session = Depends(get_db)):
    """
    Get all memberships for a user
    """
    try:
        query = text("""
            SELECT 
                m.id, m.user_id, m.start_date, m.end_date, m.status,
                mp.name as plan_name, mp.price as plan_price
            FROM memberships m
            JOIN membership_plans mp ON m.membership_plan_id = mp.id
            WHERE m.user_id = :user_id
            ORDER BY m.created_at DESC
        """)
        
        results = db.execute(query, {'user_id': user_id}).fetchall()
        
        return [
            MembershipResponse(
                id=row[0],
                user_id=row[1],
                start_date=row[2],
                end_date=row[3],
                status=row[4],
                plan_name=row[5],
                plan_price=float(row[6])
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch memberships: {str(e)}"
        )


@router.get("/sessions", response_model=List[SessionResponse])
def get_available_sessions(db: Session = Depends(get_db)):
    """
    Get all available sessions (future sessions with capacity)
    """
    try:
        query = text("""
            SELECT 
                s.id, s.studio_id, s.name, s.branch_id, s.description,
                s.start_time, s.end_time, s.activity_type_id, s.instructor, s.capacity,
                b.name as branch_name,
                at.name as activity_type_name,
                get_available_spots(s.id) as available_spots
            FROM sessions s
            JOIN branches b ON s.branch_id = b.id
            JOIN activity_types at ON s.activity_type_id = at.id
            WHERE s.capacity > 0 AND s.start_time > NOW()
            ORDER BY s.start_time ASC
        """)
        
        print(f"[USER SESSIONS] Current time: {datetime.now()}")
        print(f"[USER SESSIONS] Fetching sessions with start_time > NOW() and capacity > 0")
        
        results = db.execute(query).fetchall()
        
        print(f"[USER SESSIONS] Found {len(results)} available sessions")
        if len(results) > 0:
            print(f"[USER SESSIONS] First session: {results[0][2]} at {results[0][5]}")
        
        return [
            SessionResponse(
                id=row[0],
                studio_id=row[1],
                name=row[2],
                branch_id=row[3],
                description=row[4],
                start_time=row[5],
                end_time=row[6],
                activity_type_id=row[7],
                instructor=row[8],
                capacity=row[9],
                branch_name=row[10],
                activity_type_name=row[11],
                available_spots=row[12]
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch sessions: {str(e)}"
        )


@router.post("/book-session/{user_id}")
def book_session(
    user_id: str,
    booking: BookingCreate,
    db: Session = Depends(get_db)
):
    """
    Book a session
    """
    try:
        # Call stored procedure
        query = text("""
            CALL book_session(:user_id, :session_id, @booking_id)
        """)
        
        db.execute(query, {
            'user_id': user_id,
            'session_id': booking.session_id
        })
        
        # Get output variable
        result = db.execute(text("SELECT @booking_id")).fetchone()
        booking_id = result[0]
        
        db.commit()
        
        return {
            "message": "Session booked successfully!",
            "booking_id": booking_id
        }
        
    except Exception as e:
        db.rollback()
        error_msg = str(e)
        if "must have an active membership" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You must have an active membership to book sessions"
            )
        elif "fully booked" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Session is fully booked"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Booking failed: {error_msg}"
        )


@router.get("/my-bookings/{user_id}")
def get_user_bookings(user_id: str, db: Session = Depends(get_db)):
    """
    Get all bookings for a user
    """
    try:
        query = text("""
            SELECT 
                b.id, b.user_id, b.session_id, b.status, b.booking_time,
                s.name as session_name, s.start_time as session_date,
                s.instructor, at.name as activity_type,
                br.name as branch_name, st.name as studio_name
            FROM bookings b
            JOIN sessions s ON b.session_id = s.id
            LEFT JOIN activity_types at ON s.activity_type_id = at.id
            LEFT JOIN branches br ON s.branch_id = br.id
            LEFT JOIN studios st ON s.studio_id = st.id
            WHERE b.user_id = :user_id
            ORDER BY s.start_time DESC
        """)
        
        results = db.execute(query, {'user_id': user_id}).fetchall()
        
        return [
            {
                "id": row[0],
                "user_id": row[1],
                "session_id": row[2],
                "booking_status": row[3],
                "booking_date": row[4],
                "session_name": row[5],
                "session_date": row[6],
                "instructor_name": row[7],
                "activity_type": row[8],
                "branch_name": row[9],
                "studio_name": row[10]
            }
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch bookings: {str(e)}"
        )


@router.put("/cancel-booking/{booking_id}", response_model=MessageResponse)
def cancel_booking(booking_id: str, db: Session = Depends(get_db)):
    """
    Cancel a booking
    """
    try:
        query = text("CALL cancel_booking(:booking_id)")
        db.execute(query, {'booking_id': booking_id})
        db.commit()
        
        return MessageResponse(message="Booking cancelled successfully")
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cancellation failed: {str(e)}"
        )


@router.post("/checkin/{user_id}")
def checkin_user(
    user_id: str,
    checkin: CheckinCreate,
    db: Session = Depends(get_db)
):
    """
    Check-in user for a session
    """
    try:
        query = text("""
            CALL checkin_user(:user_id, :session_id, @checkin_id)
        """)
        
        db.execute(query, {
            'user_id': user_id,
            'session_id': checkin.session_id
        })
        
        result = db.execute(text("SELECT @checkin_id")).fetchone()
        checkin_id = result[0]
        
        db.commit()
        
        return {
            "message": "Check-in successful! Enjoy your session!",
            "checkin_id": checkin_id
        }
        
    except Exception as e:
        db.rollback()
        error_msg = str(e)
        if "No confirmed booking" in error_msg:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No confirmed booking found for this session"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Check-in failed: {error_msg}"
        )


@router.get("/my-payments/{user_id}")
def get_user_payments(user_id: str, db: Session = Depends(get_db)):
    """
    Get payment history for a user
    """
    try:
        query = text("""
            SELECT 
                p.id as payment_id,
                p.amount,
                p.payment_method,
                p.payment_time as payment_date,
                p.status as payment_status,
                mp.name as membership_name,
                cr.id as has_coupon
            FROM payments p
            LEFT JOIN memberships m ON p.membership_id = m.id
            LEFT JOIN membership_plans mp ON m.membership_plan_id = mp.id
            LEFT JOIN coupon_redemptions cr ON p.id = cr.payment_id
            WHERE p.user_id = :user_id
            ORDER BY p.payment_time DESC
        """)
        
        results = db.execute(query, {'user_id': user_id}).fetchall()
        
        return [
            {
                "payment_id": row[0],
                "amount": float(row[1]),
                "payment_method": row[2],
                "payment_date": row[3],
                "payment_status": row[4],
                "membership_name": row[5],
                "discount_applied": 0,
                "coupon_code": None
            }
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch payments: {str(e)}"
        )
