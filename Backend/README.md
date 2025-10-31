# Fitness Management System - Backend

A comprehensive Fitness Management System built with **FastAPI** and **MySQL**, featuring advanced database operations including triggers, stored procedures, functions, and complex queries.

## 🏗️ Project Structure

```
Backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── database.py          # Database connection & session management
│   ├── schemas.py           # Pydantic models for validation
│   ├── auth.py              # Authentication utilities (bcrypt)
│   └── routers/
│       ├── __init__.py
│       ├── user.py          # User endpoints
│       └── admin.py         # Admin endpoints
├── sql/
│   ├── schema.sql           # Database schema with triggers, procedures, functions
│   └── queries.sql          # 20 complex SQL queries
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## 🚀 Features

### Database Features (MySQL)

#### ✅ **5 Triggers**
1. Auto-update membership status to expired
2. Payment success → activate membership
3. Booking cancellation → increment session capacity
4. Booking confirmation → decrement session capacity
5. Prevent overbooking - check capacity before booking

#### ✅ **7 Stored Procedures**
1. `add_user` - Register new user
2. `purchase_membership` - Purchase membership plan
3. `book_session` - Book a fitness session
4. `cancel_booking` - Cancel a booking
5. `apply_coupon` - Apply discount coupon
6. `checkin_user` - Check-in for a session
7. `create_session` - Create new session (admin)

#### ✅ **4 Functions**
1. `get_discount_amount` - Calculate discount on price
2. `is_active_member` - Check if user has active membership
3. `get_user_checkin_count` - Get total check-ins for user
4. `get_available_spots` - Get available spots for session

#### ✅ **20 Complex SQL Queries**
- Branch-wise revenue reports
- User activity analysis
- Session popularity rankings
- Coupon effectiveness
- Instructor performance
- Studio utilization
- Payment method analysis
- User retention rates
- Peak hours analysis
- And more...

### API Endpoints

#### 👤 **User Endpoints** (`/user`)
- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/profile/{user_id}` - Get user profile with stats
- `GET /user/membership-plans` - View all membership plans
- `POST /user/purchase-membership/{user_id}` - Purchase membership
- `GET /user/my-memberships/{user_id}` - View user memberships
- `GET /user/sessions` - View available sessions
- `POST /user/book-session/{user_id}` - Book a session
- `GET /user/my-bookings/{user_id}` - View user bookings
- `PUT /user/cancel-booking/{booking_id}` - Cancel booking
- `POST /user/checkin/{user_id}` - Check-in to session
- `GET /user/my-payments/{user_id}` - View payment history

#### 👨‍💼 **Admin Endpoints** (`/admin`)
- `POST /admin/branches` - Create branch
- `GET /admin/branches` - List all branches
- `PUT /admin/branches/{id}` - Update branch
- `DELETE /admin/branches/{id}` - Delete branch
- `POST /admin/studios` - Create studio
- `GET /admin/studios` - List all studios
- `POST /admin/activity-types` - Create activity type
- `GET /admin/activity-types` - List activity types
- `POST /admin/sessions` - Create session
- `GET /admin/sessions` - List all sessions
- `DELETE /admin/sessions/{id}` - Delete session
- `POST /admin/membership-plans` - Create membership plan
- `POST /admin/coupons` - Create coupon
- `GET /admin/coupons` - List all coupons
- `GET /admin/reports/revenue` - Branch revenue report
- `GET /admin/reports/user-activity` - User activity report
- `GET /admin/reports/popular-sessions` - Popular sessions report
- `GET /admin/reports/active-members` - Active members count
- `GET /admin/reports/top-performing-branch` - Top branch by revenue

## 📋 Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
cd Backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
# Activate on Windows
venv\Scripts\activate
# Activate on Linux/Mac
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Setup MySQL Database

#### Create Database
```sql
CREATE DATABASE Fitness_DB;
USE Fitness_DB;
```

#### Run Schema
```bash
mysql -u root -p Fitness_DB < sql/schema.sql
```

This will create:
- All 14 tables with proper relationships
- 5 triggers
- 7 stored procedures
- 4 functions
- Indexes for performance

### 5. Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your MySQL credentials
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/Fitness_DB
```

### 6. Run the Application
```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## 📊 Testing the API

### Using Swagger UI (Recommended)
1. Navigate to http://localhost:8000/docs
2. All endpoints are listed with Try it out buttons
3. Test each endpoint directly from the browser

### Sample API Calls

#### Register User
```bash
curl -X POST "http://localhost:8000/user/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "date_of_birth": "1995-05-15",
    "gender": "male",
    "phone_number": "1234567890"
  }'
```

#### Login
```bash
curl -X POST "http://localhost:8000/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Membership Plans
```bash
curl "http://localhost:8000/user/membership-plans"
```

## 🗄️ Database Schema Overview

### Core Tables
- **users** - User accounts (with bcrypt hashed passwords)
- **user_phones** - User phone numbers
- **membership_plans** - Available membership plans
- **memberships** - User membership records
- **payments** - Payment transactions
- **coupons** - Discount coupons
- **coupon_redemptions** - Coupon usage tracking
- **branches** - Gym branches/locations
- **studios** - Studios within branches
- **activity_types** - Types of fitness activities
- **sessions** - Fitness sessions/classes
- **bookings** - Session bookings
- **checkins** - Session attendance

### Key Relationships
- Users → Memberships (1:N)
- Memberships → Payments (1:N)
- Branches → Studios → Sessions (1:N:N)
- Sessions → Bookings → Check-ins (1:N:N)
- Coupons → Redemptions → Payments (1:N:1)

## 🧪 Testing Complex Queries

All 20 complex queries are available in `sql/queries.sql`. You can run them directly:

```bash
mysql -u root -p Fitness_DB < sql/queries.sql
```

Or execute specific queries:
```sql
-- Get branch-wise revenue
SELECT b.name, SUM(p.amount) as revenue
FROM branches b
JOIN sessions s ON b.id = s.branch_id
JOIN bookings bk ON s.id = bk.session_id
JOIN payments p ON bk.id = p.booking_id
WHERE p.status = 'success'
GROUP BY b.id;
```

## 🔐 Security Features

- ✅ Bcrypt password hashing
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation with Pydantic
- ✅ CORS middleware configuration
- ✅ Database constraints and foreign keys
- ✅ Transaction management

## 📈 Performance Optimizations

- Indexed columns for faster queries
- Connection pooling with SQLAlchemy
- Stored procedures reduce network overhead
- Triggers for automatic data consistency
- Efficient JOIN queries

## 🎯 Project Highlights for Report

1. **Complete CRUD Operations** on all entities
2. **Advanced SQL Features**: Triggers, Procedures, Functions
3. **20 Complex Queries** demonstrating:
   - Multiple JOINs
   - GROUP BY with HAVING
   - Subqueries
   - Aggregations
   - Date functions
   - Window functions
4. **RESTful API Design** with proper HTTP methods
5. **Proper Error Handling** with meaningful messages
6. **Data Validation** using Pydantic schemas
7. **Database Normalization** (3NF)
8. **Real-world Business Logic**

## 📝 For Project Report

### Screenshots to Include:
1. API Documentation (Swagger UI)
2. Database schema diagram
3. Sample API responses
4. Complex query results
5. Trigger/Procedure execution
6. Admin dashboard data
7. Revenue reports
8. User activity reports

### Queries to Showcase:
- Most popular sessions
- Branch revenue comparison
- User retention analysis
- Peak hours analysis
- Instructor performance
- Coupon effectiveness

## 🚀 Future Enhancements

- JWT authentication with tokens
- Email notifications (SMTP)
- Payment gateway integration
- Real-time notifications (WebSockets)
- File uploads for profile pictures
- Advanced analytics dashboards
- Mobile app integration
- Attendance QR codes

## 🤝 Contributing

This is an academic project for DBMS + WebTech course demonstration.

## 📄 License

Educational purposes only - Semester 5 DBMS Project

## 👨‍💻 Author

VMadhav007

## 📞 Support

For issues or questions, please check:
1. API documentation at `/docs`
2. SQL schema in `sql/schema.sql`
3. Complex queries in `sql/queries.sql`

---

**Database**: Fitness_DB  
**Framework**: FastAPI  
**Language**: Python 3.8+  
**DBMS**: MySQL 8.0+
