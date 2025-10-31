"""
Admin routes - Manage branches, studios, sessions, plans, coupons, reports
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import uuid

from ..database import get_db
from ..schemas import (
    BranchCreate, BranchResponse,
    StudioCreate, StudioResponse,
    ActivityTypeCreate, ActivityTypeResponse,
    SessionCreate, SessionResponse,
    MembershipPlanCreate, MembershipPlanResponse,
    CouponCreate, CouponResponse,
    MessageResponse,
    RevenueReport, UserActivityReport, SessionPopularityReport
)

router = APIRouter(prefix="/admin", tags=["Admin"])


# ==========================================
# BRANCH MANAGEMENT
# ==========================================

@router.post("/branches", response_model=BranchResponse)
def create_branch(branch: BranchCreate, db: Session = Depends(get_db)):
    """
    Create a new branch
    """
    try:
        branch_id = str(uuid.uuid4())
        query = text("""
            INSERT INTO branches (id, name, address, city, state, zip_code, phone)
            VALUES (:id, :name, :address, :city, :state, :zip, :phone)
        """)
        
        db.execute(query, {
            'id': branch_id,
            'name': branch.name,
            'address': branch.address,
            'city': branch.city,
            'state': branch.state,
            'zip': branch.zip_code,
            'phone': branch.phone
        })
        db.commit()
        
        result = db.execute(
            text("SELECT * FROM branches WHERE id = :id"),
            {'id': branch_id}
        ).fetchone()
        
        return BranchResponse(
            id=result[0],
            name=result[1],
            address=result[2],
            city=result[3],
            state=result[4],
            zip_code=result[5],
            phone=result[6],
            created_at=result[7]
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create branch: {str(e)}"
        )


@router.get("/branches", response_model=List[BranchResponse])
def get_all_branches(db: Session = Depends(get_db)):
    """
    Get all branches
    """
    try:
        query = text("SELECT * FROM branches ORDER BY name ASC")
        results = db.execute(query).fetchall()
        
        return [
            BranchResponse(
                id=row[0],
                name=row[1],
                address=row[2],
                city=row[3],
                state=row[4],
                zip_code=row[5],
                phone=row[6],
                created_at=row[7]
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch branches: {str(e)}"
        )


@router.put("/branches/{branch_id}", response_model=MessageResponse)
def update_branch(branch_id: str, branch: BranchCreate, db: Session = Depends(get_db)):
    """
    Update a branch
    """
    try:
        query = text("""
            UPDATE branches 
            SET name = :name, address = :address, city = :city,
                state = :state, zip_code = :zip, phone = :phone
            WHERE id = :id
        """)
        
        db.execute(query, {
            'id': branch_id,
            'name': branch.name,
            'address': branch.address,
            'city': branch.city,
            'state': branch.state,
            'zip': branch.zip_code,
            'phone': branch.phone
        })
        db.commit()
        
        return MessageResponse(message="Branch updated successfully")
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update branch: {str(e)}"
        )


@router.delete("/branches/{branch_id}", response_model=MessageResponse)
def delete_branch(branch_id: str, db: Session = Depends(get_db)):
    """
    Delete a branch
    """
    try:
        query = text("DELETE FROM branches WHERE id = :id")
        db.execute(query, {'id': branch_id})
        db.commit()
        
        return MessageResponse(message="Branch deleted successfully")
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete branch: {str(e)}"
        )


# ==========================================
# STUDIO MANAGEMENT
# ==========================================

@router.post("/studios", response_model=StudioResponse)
def create_studio(studio: StudioCreate, db: Session = Depends(get_db)):
    """
    Create a new studio
    """
    try:
        studio_id = str(uuid.uuid4())
        query = text("""
            INSERT INTO studios (id, name, floor, capacity, branch_id)
            VALUES (:id, :name, :floor, :capacity, :branch_id)
        """)
        
        db.execute(query, {
            'id': studio_id,
            'name': studio.name,
            'floor': studio.floor,
            'capacity': studio.capacity,
            'branch_id': studio.branch_id
        })
        db.commit()
        
        # Fetch with branch name
        result = db.execute(
            text("""
                SELECT s.*, b.name as branch_name
                FROM studios s
                JOIN branches b ON s.branch_id = b.id
                WHERE s.id = :id
            """),
            {'id': studio_id}
        ).fetchone()
        
        return StudioResponse(
            id=result[0],
            name=result[1],
            floor=result[2],
            capacity=result[3],
            branch_id=result[5],
            branch_name=result[6]
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create studio: {str(e)}"
        )


@router.get("/studios", response_model=List[StudioResponse])
def get_all_studios(db: Session = Depends(get_db)):
    """
    Get all studios
    """
    try:
        query = text("""
            SELECT s.*, b.name as branch_name
            FROM studios s
            JOIN branches b ON s.branch_id = b.id
            ORDER BY b.name, s.name
        """)
        results = db.execute(query).fetchall()
        
        return [
            StudioResponse(
                id=row[0],
                name=row[1],
                floor=row[2],
                capacity=row[3],
                branch_id=row[5],
                branch_name=row[6]
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch studios: {str(e)}"
        )


# ==========================================
# ACTIVITY TYPE MANAGEMENT
# ==========================================

@router.post("/activity-types", response_model=ActivityTypeResponse)
def create_activity_type(activity: ActivityTypeCreate, db: Session = Depends(get_db)):
    """
    Create a new activity type
    """
    try:
        activity_id = str(uuid.uuid4())
        query = text("""
            INSERT INTO activity_types (id, name, description, is_active)
            VALUES (:id, :name, :description, 1)
        """)
        
        db.execute(query, {
            'id': activity_id,
            'name': activity.name,
            'description': activity.description
        })
        db.commit()
        
        result = db.execute(
            text("SELECT * FROM activity_types WHERE id = :id"),
            {'id': activity_id}
        ).fetchone()
        
        return ActivityTypeResponse(
            id=result[0],
            name=result[1],
            description=result[2],
            is_active=bool(result[3]),
            created_at=result[4]
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create activity type: {str(e)}"
        )


@router.get("/activity-types", response_model=List[ActivityTypeResponse])
def get_all_activity_types(db: Session = Depends(get_db)):
    """
    Get all activity types
    """
    try:
        query = text("SELECT * FROM activity_types ORDER BY name ASC")
        results = db.execute(query).fetchall()
        
        return [
            ActivityTypeResponse(
                id=row[0],
                name=row[1],
                description=row[2],
                is_active=bool(row[3]),
                created_at=row[4]
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch activity types: {str(e)}"
        )


# ==========================================
# SESSION MANAGEMENT
# ==========================================

@router.post("/sessions")
def create_session(session: SessionCreate, db: Session = Depends(get_db)):
    """
    Create a new session
    """
    try:
        query = text("""
            CALL create_session(
                :studio_id, :name, :branch_id, :description,
                :start_time, :end_time, :activity_type_id,
                :instructor, :capacity, @session_id
            )
        """)
        
        db.execute(query, {
            'studio_id': session.studio_id,
            'name': session.name,
            'branch_id': session.branch_id,
            'description': session.description,
            'start_time': session.start_time,
            'end_time': session.end_time,
            'activity_type_id': session.activity_type_id,
            'instructor': session.instructor,
            'capacity': session.capacity
        })
        
        result = db.execute(text("SELECT @session_id")).fetchone()
        session_id = result[0]
        
        db.commit()
        
        return {
            "message": "Session created successfully",
            "session_id": session_id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create session: {str(e)}"
        )


@router.get("/sessions", response_model=List[SessionResponse])
def get_all_sessions(db: Session = Depends(get_db)):
    """
    Get all sessions (including past ones)
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
            ORDER BY s.start_time DESC
        """)
        
        results = db.execute(query).fetchall()
        
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


@router.delete("/sessions/{session_id}", response_model=MessageResponse)
def delete_session(session_id: str, db: Session = Depends(get_db)):
    """
    Delete a session
    """
    try:
        query = text("DELETE FROM sessions WHERE id = :id")
        db.execute(query, {'id': session_id})
        db.commit()
        
        return MessageResponse(message="Session deleted successfully")
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete session: {str(e)}"
        )


# ==========================================
# MEMBERSHIP PLAN MANAGEMENT
# ==========================================

@router.post("/membership-plans", response_model=MembershipPlanResponse)
def create_membership_plan(plan: MembershipPlanCreate, db: Session = Depends(get_db)):
    """
    Create a new membership plan
    """
    try:
        plan_id = str(uuid.uuid4())
        query = text("""
            INSERT INTO membership_plans (id, name, description, price, duration_months, is_active)
            VALUES (:id, :name, :description, :price, :duration, 1)
        """)
        
        db.execute(query, {
            'id': plan_id,
            'name': plan.name,
            'description': plan.description,
            'price': plan.price,
            'duration': plan.duration_months
        })
        db.commit()
        
        result = db.execute(
            text("SELECT * FROM membership_plans WHERE id = :id"),
            {'id': plan_id}
        ).fetchone()
        
        return MembershipPlanResponse(
            id=result[0],
            name=result[1],
            description=result[2],
            price=float(result[3]),
            duration_months=result[4],
            is_active=bool(result[5]),
            created_at=result[6]
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create membership plan: {str(e)}"
        )


# ==========================================
# COUPON MANAGEMENT
# ==========================================

@router.post("/coupons", response_model=CouponResponse)
def create_coupon(coupon: CouponCreate, db: Session = Depends(get_db)):
    """
    Create a new coupon
    """
    try:
        coupon_id = str(uuid.uuid4())
        query = text("""
            INSERT INTO coupons (id, code, description, discount_type, discount_value, valid_from, valid_to, is_active)
            VALUES (:id, :code, :description, :type, :value, :from, :to, 1)
        """)
        
        db.execute(query, {
            'id': coupon_id,
            'code': coupon.code.upper(),
            'description': coupon.description,
            'type': coupon.discount_type.value,
            'value': coupon.discount_value,
            'from': coupon.valid_from,
            'to': coupon.valid_to
        })
        db.commit()
        
        result = db.execute(
            text("SELECT * FROM coupons WHERE id = :id"),
            {'id': coupon_id}
        ).fetchone()
        
        return CouponResponse(
            id=result[0],
            code=result[1],
            description=result[2],
            discount_type=result[3],
            discount_value=float(result[4]),
            valid_from=result[5],
            valid_to=result[6],
            is_active=bool(result[7])
        )
        
    except Exception as e:
        db.rollback()
        if "Duplicate entry" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Coupon code already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create coupon: {str(e)}"
        )


@router.get("/coupons", response_model=List[CouponResponse])
def get_all_coupons(db: Session = Depends(get_db)):
    """
    Get all coupons
    """
    try:
        query = text("SELECT * FROM coupons ORDER BY created_at DESC")
        results = db.execute(query).fetchall()
        
        return [
            CouponResponse(
                id=row[0],
                code=row[1],
                description=row[2],
                discount_type=row[3],
                discount_value=float(row[4]),
                valid_from=row[5],
                valid_to=row[6],
                is_active=bool(row[7])
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch coupons: {str(e)}"
        )


# ==========================================
# REPORTS & ANALYTICS
# ==========================================

@router.get("/reports/revenue", response_model=List[RevenueReport])
def get_revenue_report(db: Session = Depends(get_db)):
    """
    Get branch-wise revenue report
    """
    try:
        query = text("""
            SELECT 
                b.name AS branch_name,
                b.city,
                COUNT(DISTINCT s.id) AS total_sessions,
                COUNT(DISTINCT bk.id) AS total_bookings,
                COALESCE(SUM(p.amount), 0) AS total_revenue
            FROM branches b
            LEFT JOIN sessions s ON b.id = s.branch_id
            LEFT JOIN bookings bk ON s.id = bk.session_id
            LEFT JOIN payments p ON bk.id = p.booking_id AND p.status = 'success'
            GROUP BY b.id, b.name, b.city
            ORDER BY total_revenue DESC
        """)
        
        results = db.execute(query).fetchall()
        
        return [
            RevenueReport(
                branch_name=row[0],
                city=row[1],
                total_sessions=row[2],
                total_bookings=row[3],
                total_revenue=float(row[4])
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate revenue report: {str(e)}"
        )


@router.get("/reports/user-activity", response_model=List[UserActivityReport])
def get_user_activity_report(db: Session = Depends(get_db)):
    """
    Get user activity report with check-ins
    """
    try:
        query = text("""
            SELECT 
                u.name,
                u.email,
                COUNT(c.id) AS total_checkins,
                COUNT(DISTINCT c.branch_id) AS branches_visited,
                MIN(c.checkin_time) AS first_checkin,
                MAX(c.checkin_time) AS last_checkin,
                (SELECT COUNT(*) FROM bookings WHERE user_id = u.id AND status = 'cancelled') AS cancelled_bookings
            FROM users u
            LEFT JOIN checkins c ON u.id = c.user_id
            GROUP BY u.id, u.name, u.email
            HAVING COUNT(c.id) > 0
            ORDER BY total_checkins DESC
            LIMIT 50
        """)
        
        results = db.execute(query).fetchall()
        
        return [
            UserActivityReport(
                name=row[0],
                email=row[1],
                total_checkins=row[2],
                branches_visited=row[3],
                first_checkin=row[4],
                last_checkin=row[5],
                cancelled_bookings=row[6]
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate user activity report: {str(e)}"
        )


@router.get("/reports/popular-sessions", response_model=List[SessionPopularityReport])
def get_popular_sessions_report(db: Session = Depends(get_db)):
    """
    Get most popular sessions report
    """
    try:
        query = text("""
            SELECT 
                s.name AS session_name,
                s.instructor,
                at.name AS activity_type,
                b.name AS branch_name,
                COUNT(bk.id) AS total_bookings,
                s.capacity AS max_capacity,
                ROUND((COUNT(bk.id) / s.capacity) * 100, 2) AS booking_percentage
            FROM sessions s
            INNER JOIN bookings bk ON s.id = bk.session_id
            INNER JOIN activity_types at ON s.activity_type_id = at.id
            INNER JOIN branches b ON s.branch_id = b.id
            WHERE bk.status IN ('confirmed', 'completed')
            GROUP BY s.id, s.name, s.instructor, at.name, b.name, s.capacity
            HAVING COUNT(bk.id) > 0
            ORDER BY total_bookings DESC
            LIMIT 20
        """)
        
        results = db.execute(query).fetchall()
        
        return [
            SessionPopularityReport(
                session_name=row[0],
                instructor=row[1],
                activity_type=row[2],
                branch_name=row[3],
                total_bookings=row[4],
                max_capacity=row[5],
                booking_percentage=float(row[6])
            )
            for row in results
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate session popularity report: {str(e)}"
        )


@router.get("/reports/active-members")
def get_active_members_count(db: Session = Depends(get_db)):
    """
    Get count of active members
    """
    try:
        query = text("""
            SELECT COUNT(DISTINCT user_id) as active_members
            FROM memberships
            WHERE status = 'active' AND end_date >= CURDATE()
        """)
        
        result = db.execute(query).fetchone()
        
        return {
            "active_members": result[0]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get active members count: {str(e)}"
        )


@router.get("/reports/top-performing-branch")
def get_top_performing_branch(db: Session = Depends(get_db)):
    """
    Get top performing branch by revenue
    """
    try:
        query = text("""
            SELECT 
                b.name AS branch_name,
                b.city,
                COUNT(DISTINCT bk.id) AS total_bookings,
                COALESCE(SUM(p.amount), 0) AS total_revenue
            FROM branches b
            LEFT JOIN sessions s ON b.id = s.branch_id
            LEFT JOIN bookings bk ON s.id = bk.session_id
            LEFT JOIN payments p ON bk.id = p.booking_id AND p.status = 'success'
            GROUP BY b.id, b.name, b.city
            ORDER BY total_revenue DESC
            LIMIT 1
        """)
        
        result = db.execute(query).fetchone()
        
        if result:
            return {
                "branch_name": result[0],
                "city": result[1],
                "total_bookings": result[2],
                "total_revenue": float(result[3])
            }
        else:
            return {"message": "No data available"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get top performing branch: {str(e)}"
        )
