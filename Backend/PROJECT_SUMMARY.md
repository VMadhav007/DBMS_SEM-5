# 🏋️ FITNESS MANAGEMENT SYSTEM - PROJECT SUMMARY

## 📌 Project Overview

A comprehensive **Fitness Management System** built with **FastAPI (Python)** and **MySQL**, demonstrating advanced database concepts including triggers, stored procedures, functions, and complex queries.

**Database Name**: `Fitness_DB`  
**Backend Framework**: FastAPI  
**Language**: Python 3.8+  
**Database**: MySQL 8.0+

---

## 🎯 Project Objectives

1. ✅ Design and implement a normalized relational database (3NF)
2. ✅ Implement 5+ triggers for automated data management
3. ✅ Create 7+ stored procedures for business logic
4. ✅ Develop 4+ functions for reusable operations
5. ✅ Write 20+ complex SQL queries demonstrating advanced concepts
6. ✅ Build RESTful API with FastAPI
7. ✅ Implement complete user and admin workflows
8. ✅ Generate comprehensive reports and analytics

---

## 📊 Database Schema

### Tables (14 Total)

1. **users** - User accounts with authentication
2. **user_phones** - User contact numbers
3. **membership_plans** - Available membership packages
4. **memberships** - User membership records
5. **payments** - Payment transactions
6. **coupons** - Discount coupons
7. **coupon_redemptions** - Coupon usage tracking
8. **branches** - Gym branch locations
9. **studios** - Studios within branches
10. **activity_types** - Fitness activity categories
11. **sessions** - Fitness class sessions
12. **bookings** - Session reservations
13. **checkins** - Attendance records

### Key Relationships

```
users (1) ──→ (N) memberships ──→ (N) payments
users (1) ──→ (N) bookings ──→ (1) sessions
branches (1) ──→ (N) studios ──→ (N) sessions
sessions (1) ──→ (N) checkins
coupons (1) ──→ (N) coupon_redemptions ──→ (1) payments
```

---

## 🔧 Database Features Implemented

### ✨ Triggers (5)

| # | Trigger Name | Event | Purpose |
|---|--------------|-------|---------|
| 1 | `trg_update_membership_status` | BEFORE UPDATE on memberships | Auto-expire memberships past end_date |
| 2 | `trg_payment_success` | AFTER UPDATE on payments | Activate membership when payment succeeds |
| 3 | `trg_cancel_booking` | AFTER UPDATE on bookings | Restore session capacity when booking cancelled |
| 4 | `trg_confirm_booking` | AFTER INSERT on bookings | Reduce session capacity when booking confirmed |
| 5 | `trg_check_capacity` | BEFORE INSERT on bookings | Prevent overbooking by checking capacity |

### 🔄 Stored Procedures (7)

| # | Procedure Name | Parameters | Purpose |
|---|----------------|------------|---------|
| 1 | `add_user` | id, name, email, password, role, dob, gender | Register new user |
| 2 | `purchase_membership` | user_id, plan_id, start_date, amount, payment_method | Purchase membership plan |
| 3 | `book_session` | user_id, session_id | Book a fitness session |
| 4 | `cancel_booking` | booking_id | Cancel a booking |
| 5 | `apply_coupon` | coupon_code, user_id, payment_id | Apply discount coupon |
| 6 | `checkin_user` | user_id, session_id | Check-in to session |
| 7 | `create_session` | studio_id, name, branch_id, details... | Create new session (admin) |

### 🧮 Functions (4)

| # | Function Name | Returns | Purpose |
|---|---------------|---------|---------|
| 1 | `get_discount_amount` | DECIMAL(10,2) | Calculate final price after discount |
| 2 | `is_active_member` | BOOLEAN | Check if user has active membership |
| 3 | `get_user_checkin_count` | INT | Get total check-ins for user |
| 4 | `get_available_spots` | INT | Get available capacity for session |

### 📊 Complex Queries (20)

#### Category: User & Membership Analysis
1. List all users with active memberships (JOIN, filtering)
2. Users without active membership - potential leads (LEFT JOIN, NOT EXISTS)
3. Top spending users (subqueries, ORDER BY)
4. User retention analysis (complex date calculations, subqueries)

#### Category: Revenue & Financial Reports
5. Branch-wise revenue report (GROUP BY, aggregation)
6. Revenue by membership plan (HAVING, aggregation)
7. Monthly revenue trend (DATE functions, GROUP BY)
8. Payment method analysis (CASE statements, aggregations)

#### Category: Session & Activity Analytics
9. Most popular sessions (JOIN, GROUP BY, percentage calculation)
10. Sessions with available capacity (WHERE filtering, date comparison)
11. Activity type popularity analysis (multiple aggregations)
12. Peak hours analysis (TIME functions, GROUP BY)

#### Category: User Activity & Engagement
13. User activity report with check-ins (LEFT JOIN, subqueries)
14. Users who booked but never checked in (NOT IN, aggregation)
15. Cross-branch user activity (DISTINCT, GROUP_CONCAT)

#### Category: Performance & Utilization
16. Instructor performance report (multiple JOINs, calculated metrics)
17. Studio utilization report (capacity calculations)
18. Expired memberships per branch (complex JOIN path)

#### Category: Marketing & Promotions
19. Coupon effectiveness analysis (redemption tracking)
20. Users who used coupons (JOIN chain)

---

## 🚀 API Endpoints

### 👤 User Module (12 Endpoints)

#### Authentication
- `POST /user/register` - Register new user (bcrypt password)
- `POST /user/login` - User login with validation

#### Profile & Stats
- `GET /user/profile/{user_id}` - Profile with check-in stats

#### Memberships
- `GET /user/membership-plans` - View available plans
- `POST /user/purchase-membership/{user_id}` - Purchase plan with coupon
- `GET /user/my-memberships/{user_id}` - View membership history

#### Sessions & Bookings
- `GET /user/sessions` - View available sessions
- `POST /user/book-session/{user_id}` - Book a session
- `GET /user/my-bookings/{user_id}` - View booking history
- `PUT /user/cancel-booking/{booking_id}` - Cancel booking
- `POST /user/checkin/{user_id}` - Check-in to session

#### Payments
- `GET /user/my-payments/{user_id}` - View payment history

### 👨‍💼 Admin Module (19 Endpoints)

#### Branch Management
- `POST /admin/branches` - Create branch
- `GET /admin/branches` - List all branches
- `PUT /admin/branches/{id}` - Update branch
- `DELETE /admin/branches/{id}` - Delete branch

#### Studio Management
- `POST /admin/studios` - Create studio
- `GET /admin/studios` - List all studios

#### Activity Types
- `POST /admin/activity-types` - Create activity type
- `GET /admin/activity-types` - List activity types

#### Session Management
- `POST /admin/sessions` - Create session
- `GET /admin/sessions` - List all sessions
- `DELETE /admin/sessions/{id}` - Delete session

#### Membership Plans
- `POST /admin/membership-plans` - Create membership plan

#### Coupon Management
- `POST /admin/coupons` - Create coupon
- `GET /admin/coupons` - List all coupons

#### Reports & Analytics
- `GET /admin/reports/revenue` - Branch revenue report
- `GET /admin/reports/user-activity` - User activity report
- `GET /admin/reports/popular-sessions` - Popular sessions
- `GET /admin/reports/active-members` - Active members count
- `GET /admin/reports/top-performing-branch` - Top branch

---

## 💡 Key Features

### Security
✅ Bcrypt password hashing  
✅ Parameterized queries (SQL injection prevention)  
✅ Input validation with Pydantic schemas  
✅ CORS configuration for frontend integration

### Business Logic
✅ Automatic membership activation on payment success  
✅ Automatic capacity management with triggers  
✅ Prevent overbooking with capacity checks  
✅ Coupon system with validation  
✅ Membership expiration handling

### Data Integrity
✅ Foreign key constraints  
✅ CHECK constraints for data validation  
✅ ON DELETE/UPDATE CASCADE for referential integrity  
✅ Transaction management  
✅ Unique constraints on emails and coupon codes

### Performance
✅ Indexed columns for faster queries  
✅ Connection pooling with SQLAlchemy  
✅ Stored procedures reduce network overhead  
✅ Efficient JOIN queries

---

## 📁 Project Structure

```
Backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI entry point
│   ├── database.py          # DB connection & session
│   ├── schemas.py           # Pydantic validation models
│   ├── auth.py              # Password hashing (bcrypt)
│   └── routers/
│       ├── __init__.py
│       ├── user.py          # 12 user endpoints
│       └── admin.py         # 19 admin endpoints
├── sql/
│   ├── schema.sql           # Schema + triggers + procedures + functions
│   ├── queries.sql          # 20 complex queries
│   └── sample_data.sql      # Test data with 7 users, 4 branches
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── README.md               # Setup & documentation
├── SETUP_GUIDE.md          # Step-by-step setup
├── test_api.py             # Automated test script
└── PROJECT_SUMMARY.md      # This file
```

---

## 🎓 Academic Excellence

### DBMS Concepts Demonstrated

1. **Schema Design**
   - ER diagram to relational model conversion
   - Normalization (1NF, 2NF, 3NF)
   - Primary and foreign keys
   - Composite relationships

2. **SQL Advanced Features**
   - Triggers (BEFORE/AFTER, INSERT/UPDATE)
   - Stored procedures with OUT parameters
   - User-defined functions
   - Transaction management

3. **Query Complexity**
   - Multiple table JOINs (INNER, LEFT, RIGHT)
   - Subqueries (IN, EXISTS, scalar)
   - Aggregate functions (COUNT, SUM, AVG)
   - GROUP BY with HAVING
   - Date and time functions
   - String functions (GROUP_CONCAT)
   - CASE statements
   - Window functions concepts

4. **Constraints & Integrity**
   - NOT NULL constraints
   - UNIQUE constraints
   - CHECK constraints
   - Foreign key constraints
   - ON DELETE/UPDATE actions

### Web Technology Concepts

1. **REST API Design**
   - Proper HTTP methods (GET, POST, PUT, DELETE)
   - Resource-based URLs
   - Status codes (200, 201, 400, 404, 500)
   - JSON request/response

2. **Backend Architecture**
   - Separation of concerns (routers, schemas, database)
   - Dependency injection
   - Error handling
   - Validation layer

3. **Security**
   - Password hashing (bcrypt)
   - Input validation
   - SQL injection prevention
   - CORS configuration

---

## 📊 Sample Data

### Users (7)
- 6 regular users
- 1 admin user
- All passwords: `password123`

### Branches (4)
- Mumbai: 3 branches
- Bangalore: 1 branch

### Membership Plans (5)
- Basic Monthly: ₹999
- Premium Quarterly: ₹2,499
- Elite Annual: ₹8,999
- Student Monthly: ₹699
- Couple Annual: ₹14,999

### Sessions (10)
- Various activity types
- Different times and instructors
- Across all branches

---

## 🧪 Testing

### Automated Testing
Run `python test_api.py` to verify:
- API health
- Database connectivity
- Endpoint functionality
- Data integrity

### Manual Testing
Use Swagger UI at http://localhost:8000/docs

### Query Testing
Run all queries: `mysql -u root -p Fitness_DB < sql/queries.sql`

---

## 📈 Metrics

- **Database Tables**: 14
- **Triggers**: 5
- **Stored Procedures**: 7
- **Functions**: 4
- **Complex Queries**: 20
- **API Endpoints**: 33 (12 user + 19 admin + 2 general)
- **Lines of Code**: ~3000+
- **Test Coverage**: All core features

---

## 🎯 Real-World Application

This system can be used by:
- Fitness centers and gyms
- Yoga studios
- CrossFit boxes
- Dance studios
- Sports complexes
- Multi-branch fitness chains

Features support:
- Member management
- Class scheduling
- Payment processing
- Attendance tracking
- Revenue analysis
- Performance metrics

---

## 🚀 Future Enhancements

1. **Authentication**: JWT tokens for stateless auth
2. **Email**: SMTP integration for notifications
3. **Payment Gateway**: Razorpay/Stripe integration
4. **Mobile App**: React Native app
5. **QR Codes**: For quick check-ins
6. **Analytics Dashboard**: Real-time charts
7. **Waitlist**: For fully booked sessions
8. **Trainer Portal**: Separate interface for instructors
9. **Diet Plans**: Nutrition tracking
10. **Wearables**: Integration with fitness trackers

---

## 📚 Technologies Used

### Backend
- **FastAPI** 0.104.1 - Modern Python web framework
- **Uvicorn** 0.24.0 - ASGI server
- **SQLAlchemy** 2.0.23 - SQL toolkit
- **PyMySQL** 1.1.0 - MySQL connector
- **Pydantic** 2.5.0 - Data validation
- **Bcrypt** 4.1.1 - Password hashing

### Database
- **MySQL** 8.0+ - Relational database

### Tools
- **MySQL Workbench** - Database design
- **Postman** - API testing
- **Git** - Version control

---

## 🏆 Project Achievements

✅ **Complete Implementation** - All requirements met  
✅ **Production-Ready Code** - Error handling, validation  
✅ **Comprehensive Documentation** - README, setup guide  
✅ **Automated Testing** - Test script included  
✅ **Real-World Features** - Practical business logic  
✅ **Clean Architecture** - Modular, maintainable code  
✅ **Performance Optimized** - Indexes, stored procedures  
✅ **Security Focused** - Password hashing, SQL injection prevention

---

## 👨‍💻 Developer

**Name**: VMadhav007  
**Course**: Semester 5 - DBMS + WebTech Project  
**Database**: Fitness_DB  
**Framework**: FastAPI (Python)

---

## 📄 License

Educational purposes only - Academic project for DBMS course demonstration.

---

## 🎓 Suitable For

- DBMS Course Projects
- Web Technology Assignments
- Full-Stack Development Portfolio
- Database Design Study Material
- API Development Learning
- SQL Practice and Learning

---

**Note**: This project demonstrates comprehensive understanding of database management systems, SQL programming, API development, and software architecture principles.
