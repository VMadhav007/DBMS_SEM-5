# Fitness Management System - Complete Setup Guide

## 🚀 Quick Start (5 Minutes Setup)

### Step 1: MySQL Setup
```powershell
# Start MySQL service
net start MySQL80

# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE Fitness_DB;
USE Fitness_DB;

# Exit MySQL
exit
```

### Step 2: Import Database Schema
```powershell
# Navigate to Backend folder
cd "d:\Sem 5\DBMS\App\Backend"

# Import schema (creates tables, triggers, procedures, functions)
mysql -u root -p Fitness_DB < sql\schema.sql

# Import sample data (optional but recommended)
mysql -u root -p Fitness_DB < sql\sample_data.sql
```

### Step 3: Backend Setup
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env file with your MySQL password
# Open .env in notepad and change password
notepad .env
```

**Update .env file:**
```env
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/Fitness_DB
```

### Step 4: Run Backend Server
```powershell
# Make sure virtual environment is activated
uvicorn app.main:app --reload
```

Server will start at: **http://localhost:8000**

### Step 5: Test the API
Open browser and go to: **http://localhost:8000/docs**

You'll see interactive API documentation!

---

## 📋 Complete Feature Checklist

### ✅ Database Features (All Implemented)

#### Triggers (5)
- [x] Auto-update membership status to expired
- [x] Payment success → activate membership  
- [x] Booking cancellation → increment capacity
- [x] Booking confirmation → decrement capacity
- [x] Prevent overbooking capacity check

#### Stored Procedures (7)
- [x] add_user - Register new user
- [x] purchase_membership - Buy membership plan
- [x] book_session - Book fitness session
- [x] cancel_booking - Cancel session booking
- [x] apply_coupon - Apply discount coupon
- [x] checkin_user - Check-in to session
- [x] create_session - Create new session (admin)

#### Functions (4)
- [x] get_discount_amount - Calculate discounts
- [x] is_active_member - Check membership status
- [x] get_user_checkin_count - Get total check-ins
- [x] get_available_spots - Get session availability

#### Complex Queries (20)
- [x] Active users with memberships
- [x] Branch-wise revenue report
- [x] Most popular sessions
- [x] Users who used coupons
- [x] Sessions with available capacity
- [x] Expired memberships per branch
- [x] User activity report (check-ins)
- [x] Revenue by membership plan
- [x] Instructor performance report
- [x] Top spending users
- [x] Studio utilization report
- [x] Activity type popularity
- [x] Payment method analysis
- [x] Users without active membership
- [x] Monthly revenue trend
- [x] Users who booked but never checked in
- [x] Peak hours analysis
- [x] Coupon effectiveness analysis
- [x] User retention analysis
- [x] Cross-branch user activity

### ✅ API Endpoints (All Implemented)

#### User Endpoints (12)
- [x] POST /user/register
- [x] POST /user/login
- [x] GET /user/profile/{user_id}
- [x] GET /user/membership-plans
- [x] POST /user/purchase-membership/{user_id}
- [x] GET /user/my-memberships/{user_id}
- [x] GET /user/sessions
- [x] POST /user/book-session/{user_id}
- [x] GET /user/my-bookings/{user_id}
- [x] PUT /user/cancel-booking/{booking_id}
- [x] POST /user/checkin/{user_id}
- [x] GET /user/my-payments/{user_id}

#### Admin Endpoints (21)
- [x] POST /admin/branches
- [x] GET /admin/branches
- [x] PUT /admin/branches/{id}
- [x] DELETE /admin/branches/{id}
- [x] POST /admin/studios
- [x] GET /admin/studios
- [x] POST /admin/activity-types
- [x] GET /admin/activity-types
- [x] POST /admin/sessions
- [x] GET /admin/sessions
- [x] DELETE /admin/sessions/{id}
- [x] POST /admin/membership-plans
- [x] POST /admin/coupons
- [x] GET /admin/coupons
- [x] GET /admin/reports/revenue
- [x] GET /admin/reports/user-activity
- [x] GET /admin/reports/popular-sessions
- [x] GET /admin/reports/active-members
- [x] GET /admin/reports/top-performing-branch

---

## 🧪 Testing Guide

### Using Swagger UI (Easiest Method)

1. **Start the server**: `uvicorn app.main:app --reload`
2. **Open browser**: http://localhost:8000/docs
3. **Test endpoints**:

#### Test Scenario 1: User Registration & Login
```
1. Click on "POST /user/register"
2. Click "Try it out"
3. Use this sample data:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "date_of_birth": "1995-01-01",
  "gender": "male",
  "phone_number": "9999999999"
}
4. Click "Execute"
5. Copy the user "id" from response

6. Click on "POST /user/login"
7. Use:
{
  "email": "test@example.com",
  "password": "password123"
}
8. Click "Execute"
```

#### Test Scenario 2: Purchase Membership
```
1. GET /user/membership-plans - See available plans
2. Copy a plan "id"
3. POST /user/purchase-membership/{user_id}
   - Use user_id from registration
   - Body:
   {
     "plan_id": "COPIED_PLAN_ID",
     "payment_method": "upi",
     "coupon_code": "FIRST100"
   }
4. Check membership activated!
```

#### Test Scenario 3: Book & Check-in Session
```
1. GET /user/sessions - See available sessions
2. Copy a session "id"
3. POST /user/book-session/{user_id}
   Body: {"session_id": "COPIED_SESSION_ID"}
4. POST /user/checkin/{user_id}
   Body: {"session_id": "SAME_SESSION_ID"}
5. Session completed!
```

### Using Sample Data

If you imported `sample_data.sql`, use these test accounts:

**User Account:**
- Email: `rahul@example.com`
- Password: `password123`
- Has active membership

**Admin Account:**
- Email: `admin@fitness.com`
- Password: `password123`
- Full admin access

---

## 📊 Running Complex Queries

### Method 1: MySQL Workbench
```sql
USE Fitness_DB;

-- Test Query 1: Branch Revenue
SELECT 
    b.name AS branch_name,
    COUNT(DISTINCT s.id) AS total_sessions,
    COALESCE(SUM(p.amount), 0) AS total_revenue
FROM branches b
LEFT JOIN sessions s ON b.id = s.branch_id
LEFT JOIN bookings bk ON s.id = bk.session_id
LEFT JOIN payments p ON bk.id = p.booking_id AND p.status = 'success'
GROUP BY b.id, b.name
ORDER BY total_revenue DESC;
```

### Method 2: Run All Queries File
```powershell
mysql -u root -p Fitness_DB < sql\queries.sql
```

---

## 🎯 Project Demo Flow

### For Professor/Presentation:

1. **Show Database Schema**
   ```sql
   SHOW TABLES;
   DESC users;
   DESC memberships;
   ```

2. **Show Triggers**
   ```sql
   SHOW TRIGGERS;
   ```

3. **Show Stored Procedures**
   ```sql
   SHOW PROCEDURE STATUS WHERE Db = 'Fitness_DB';
   ```

4. **Show Functions**
   ```sql
   SHOW FUNCTION STATUS WHERE Db = 'Fitness_DB';
   ```

5. **Demo API**: Open http://localhost:8000/docs

6. **Test User Flow**:
   - Register → Login → Buy Membership → Book Session → Check-in

7. **Test Admin Flow**:
   - Create Branch → Create Studio → Create Session → View Reports

8. **Show Complex Queries**: Run from queries.sql

---

## 🐛 Troubleshooting

### Issue: Can't connect to MySQL
**Solution:**
```powershell
# Check if MySQL is running
net start MySQL80

# Check MySQL port
netstat -an | findstr 3306
```

### Issue: Import schema fails
**Solution:**
```powershell
# Make sure you're in Fitness_DB
mysql -u root -p

# Inside MySQL:
USE Fitness_DB;
source d:/Sem 5/DBMS/App/Backend/sql/schema.sql
```

### Issue: Python package installation fails
**Solution:**
```powershell
# Update pip first
python -m pip install --upgrade pip

# Then install requirements
pip install -r requirements.txt
```

### Issue: "Access denied" error
**Solution:**
Update `.env` file with correct MySQL password:
```env
DATABASE_URL=mysql+pymysql://root:YOUR_ACTUAL_PASSWORD@localhost:3306/Fitness_DB
```

---

## 📸 Screenshots for Report

### Must-Have Screenshots:

1. **Database Schema**
   - Show all tables in MySQL Workbench
   - ER Diagram (use MySQL Workbench: Database → Reverse Engineer)

2. **Triggers & Procedures**
   ```sql
   SHOW TRIGGERS;
   SHOW PROCEDURES;
   ```

3. **API Documentation**
   - Screenshot of http://localhost:8000/docs

4. **API Response Examples**
   - User registration response
   - Login response
   - Purchase membership response
   - Booking confirmation

5. **Complex Query Results**
   - Branch revenue report
   - User activity report
   - Popular sessions report

6. **Sample Data**
   ```sql
   SELECT * FROM memberships LIMIT 5;
   SELECT * FROM bookings LIMIT 5;
   ```

---

## 📝 Report Structure

### Suggested Sections:

1. **Introduction**
   - Problem statement
   - Objectives

2. **System Design**
   - ER Diagram
   - Schema diagram
   - Normalization (explain 1NF, 2NF, 3NF)

3. **Database Implementation**
   - Tables with descriptions
   - Relationships & Foreign Keys
   - Triggers (code + explanation)
   - Stored Procedures (code + explanation)
   - Functions (code + explanation)

4. **API Implementation**
   - FastAPI architecture
   - Endpoint documentation
   - Request/Response examples

5. **Complex Queries**
   - List all 20 queries
   - Explain 5-6 in detail
   - Show output screenshots

6. **Testing & Results**
   - API testing screenshots
   - Query output screenshots
   - Performance analysis

7. **Conclusion**
   - Features implemented
   - Challenges faced
   - Future enhancements

8. **Appendix**
   - Full source code
   - Installation guide
   - User manual

---

## 🎓 Key Points for Viva

### Questions You Might Be Asked:

**Q: Why FastAPI instead of Express?**
A: FastAPI is modern, provides automatic API documentation, built-in data validation with Pydantic, better performance, and type safety.

**Q: Explain a trigger**
A: Show `trg_payment_success` - When payment status becomes 'success', it automatically activates the membership. This maintains data consistency without manual intervention.

**Q: Explain normalization**
A: Database is in 3NF:
- 1NF: Atomic values, no repeating groups
- 2NF: No partial dependencies
- 3NF: No transitive dependencies
- Example: user_phones table separated from users table

**Q: What's the most complex query?**
A: User retention analysis (Query 19) - Uses subqueries, date calculations, EXISTS clause, and multiple aggregations to track user retention over time.

**Q: How do you prevent SQL injection?**
A: Use parameterized queries with SQLAlchemy. All queries use `:parameter` syntax instead of string concatenation.

**Q: Explain the booking flow**
A: 
1. Check active membership (function)
2. Check capacity (trigger prevents if full)
3. Create booking (procedure)
4. Decrement capacity (trigger)
5. User checks in (procedure)
6. Mark booking complete (update)

---

## 🚀 Optional Enhancements

If you have extra time:

1. **Add Indexes**
   ```sql
   CREATE INDEX idx_sessions_start_time ON sessions(start_time);
   ```

2. **Add Views**
   ```sql
   CREATE VIEW active_users AS
   SELECT u.*, m.end_date
   FROM users u
   JOIN memberships m ON u.id = m.user_id
   WHERE m.status = 'active';
   ```

3. **Add Events** (Auto-cleanup)
   ```sql
   CREATE EVENT expire_old_memberships
   ON SCHEDULE EVERY 1 DAY
   DO
   UPDATE memberships 
   SET status = 'expired' 
   WHERE end_date < CURDATE() AND status = 'active';
   ```

---

## 📞 Support & Resources

- **API Docs**: http://localhost:8000/docs
- **Schema File**: `sql/schema.sql`
- **Queries File**: `sql/queries.sql`
- **Sample Data**: `sql/sample_data.sql`

---

**Remember**: The goal is to demonstrate comprehensive DBMS knowledge with real-world application. Focus on explaining the WHY behind design decisions, not just WHAT was implemented.

Good luck with your project! 🎉
