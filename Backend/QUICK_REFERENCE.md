# 🚀 QUICK REFERENCE CARD - FITNESS MANAGEMENT SYSTEM

## ⚡ Quick Setup (5 Minutes)

```powershell
# 1. Create Database
mysql -u root -p
CREATE DATABASE Fitness_DB;
exit

# 2. Import Schema
mysql -u root -p Fitness_DB < sql\schema.sql
mysql -u root -p Fitness_DB < sql\sample_data.sql

# 3. Setup Backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# 4. Configure .env
copy .env.example .env
# Edit DATABASE_URL in .env

# 5. Run Server
uvicorn app.main:app --reload
```

**API Docs**: http://localhost:8000/docs

---

## 📊 Database Quick Facts

| Item | Count | Details |
|------|-------|---------|
| Tables | 14 | Normalized to 3NF |
| Triggers | 5 | Auto capacity, payment, expiration |
| Procedures | 7 | User, booking, payment flows |
| Functions | 4 | Discounts, membership checks |
| Queries | 20 | Revenue, activity, performance |
| Endpoints | 33 | 12 user + 19 admin + 2 general |

---

## 🔑 Test Accounts (Sample Data)

**Regular User**
- Email: `rahul@example.com`
- Password: `password123`
- Status: Has active membership

**Admin User**
- Email: `admin@fitness.com`
- Password: `password123`
- Role: Full admin access

---

## 📝 Common SQL Commands

```sql
-- Show all tables
USE Fitness_DB;
SHOW TABLES;

-- Show triggers
SHOW TRIGGERS;

-- Show procedures
SHOW PROCEDURE STATUS WHERE Db = 'Fitness_DB';

-- Show functions
SHOW FUNCTION STATUS WHERE Db = 'Fitness_DB';

-- Test trigger (expire membership)
UPDATE memberships SET end_date = '2023-01-01' WHERE id = 'm1-uuid-0001';

-- Test procedure (book session)
CALL book_session('u1-uuid-0001', 'sess-0004', @booking_id);
SELECT @booking_id;

-- Test function (check active member)
SELECT is_active_member('u1-uuid-0001');

-- Run complex query (revenue report)
SELECT b.name, SUM(p.amount) FROM branches b
JOIN sessions s ON b.id = s.branch_id
JOIN bookings bk ON s.id = bk.session_id
JOIN payments p ON bk.id = p.booking_id
WHERE p.status = 'success'
GROUP BY b.id;
```

---

## 🌐 API Quick Reference

### User Endpoints (Base: `/user`)

```http
POST   /register                          # Register new user
POST   /login                             # User login
GET    /profile/{user_id}                 # Get profile + stats
GET    /membership-plans                  # List plans
POST   /purchase-membership/{user_id}     # Buy membership
GET    /my-memberships/{user_id}          # View memberships
GET    /sessions                          # Available sessions
POST   /book-session/{user_id}            # Book session
GET    /my-bookings/{user_id}             # View bookings
PUT    /cancel-booking/{booking_id}       # Cancel booking
POST   /checkin/{user_id}                 # Check-in
GET    /my-payments/{user_id}             # Payment history
```

### Admin Endpoints (Base: `/admin`)

```http
# Branches
POST   /branches                    # Create
GET    /branches                    # List all
PUT    /branches/{id}               # Update
DELETE /branches/{id}               # Delete

# Studios
POST   /studios                     # Create
GET    /studios                     # List all

# Activity Types
POST   /activity-types              # Create
GET    /activity-types              # List all

# Sessions
POST   /sessions                    # Create
GET    /sessions                    # List all
DELETE /sessions/{id}               # Delete

# Membership Plans
POST   /membership-plans            # Create

# Coupons
POST   /coupons                     # Create
GET    /coupons                     # List all

# Reports
GET    /reports/revenue             # Branch revenue
GET    /reports/user-activity       # User activity
GET    /reports/popular-sessions    # Popular sessions
GET    /reports/active-members      # Active count
GET    /reports/top-performing-branch  # Top branch
```

---

## 🧪 Quick Test Workflow

### 1. User Registration
```json
POST /user/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "date_of_birth": "1995-01-01",
  "gender": "male",
  "phone_number": "9999999999"
}
```

### 2. Purchase Membership
```json
POST /user/purchase-membership/{user_id}
{
  "plan_id": "mp1-uuid-0001",
  "payment_method": "upi",
  "coupon_code": "FIRST100"
}
```

### 3. Book Session
```json
POST /user/book-session/{user_id}
{
  "session_id": "sess-0004"
}
```

### 4. Check-in
```json
POST /user/checkin/{user_id}
{
  "session_id": "sess-0004"
}
```

---

## 🎯 Demo Script (For Presentation)

### Part 1: Database (5 mins)
```sql
-- 1. Show schema
SHOW TABLES;

-- 2. Show relationships
DESC memberships;
SHOW CREATE TABLE memberships;

-- 3. Demo trigger
UPDATE payments SET status = 'success' WHERE id = 'p1-uuid-0001';
SELECT * FROM memberships WHERE id = 'm1-uuid-0001';

-- 4. Demo procedure
CALL book_session('u2-uuid-0002', 'sess-0007', @bid);

-- 5. Demo function
SELECT is_active_member('u1-uuid-0001');

-- 6. Demo complex query
SELECT b.name, COUNT(*) as sessions, SUM(p.amount) as revenue
FROM branches b
JOIN sessions s ON b.id = s.branch_id
JOIN bookings bk ON s.id = bk.session_id
JOIN payments p ON bk.id = p.booking_id
WHERE p.status = 'success'
GROUP BY b.id;
```

### Part 2: API (5 mins)
1. Open http://localhost:8000/docs
2. Test POST /user/register
3. Test POST /user/login
4. Test GET /user/membership-plans
5. Test POST /user/purchase-membership
6. Test GET /admin/reports/revenue

---

## 📸 Screenshots Checklist

For your project report, capture these:

### Database Screenshots
- [ ] All tables (SHOW TABLES)
- [ ] Sample table structure (DESC users)
- [ ] Triggers list (SHOW TRIGGERS)
- [ ] Procedures list (SHOW PROCEDURE STATUS)
- [ ] ER Diagram (MySQL Workbench)
- [ ] Sample query results

### API Screenshots
- [ ] Swagger UI homepage (http://localhost:8000/docs)
- [ ] User registration request/response
- [ ] Login response
- [ ] Purchase membership response
- [ ] Revenue report response
- [ ] Popular sessions report

### Application Screenshots
- [ ] Server running in terminal
- [ ] Sample data in tables
- [ ] Complex query execution
- [ ] Trigger in action

---

## 🐛 Troubleshooting Quick Fixes

**Problem**: Can't connect to MySQL  
**Fix**: `net start MySQL80`

**Problem**: Database doesn't exist  
**Fix**: `CREATE DATABASE Fitness_DB;`

**Problem**: Tables not found  
**Fix**: `mysql -u root -p Fitness_DB < sql\schema.sql`

**Problem**: API errors  
**Fix**: Check `.env` file, update DATABASE_URL

**Problem**: Import package errors  
**Fix**: `pip install -r requirements.txt`

**Problem**: Permission denied  
**Fix**: Check MySQL user permissions

---

## 📊 Key Metrics to Highlight

- **14 tables** with proper relationships
- **5 triggers** for automation
- **7 procedures** for business logic
- **4 functions** for reusable operations
- **20 complex queries** with JOINs, subqueries
- **33 API endpoints** fully functional
- **3NF normalization** achieved
- **Bcrypt security** for passwords
- **ACID properties** maintained
- **Foreign key constraints** enforced

---

## 🎓 Viva Questions - Quick Answers

**Q**: Why FastAPI?  
**A**: Modern, fast, automatic docs, type safety, async support

**Q**: Explain normalization  
**A**: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies)

**Q**: How do triggers work?  
**A**: Automatic execution on events (BEFORE/AFTER INSERT/UPDATE/DELETE)

**Q**: Advantage of stored procedures?  
**A**: Reduce network traffic, reusable code, better security, pre-compiled

**Q**: Most complex query?  
**A**: User retention analysis - subqueries, date calculations, EXISTS clause

**Q**: How prevent SQL injection?  
**A**: Parameterized queries with `:parameter` syntax, no string concatenation

---

## 📁 File Locations

| File | Location | Purpose |
|------|----------|---------|
| Schema | `sql/schema.sql` | Tables + triggers + procedures + functions |
| Queries | `sql/queries.sql` | 20 complex queries |
| Sample Data | `sql/sample_data.sql` | Test data |
| Main API | `app/main.py` | FastAPI app |
| User Routes | `app/routers/user.py` | User endpoints |
| Admin Routes | `app/routers/admin.py` | Admin endpoints |
| Schemas | `app/schemas.py` | Pydantic models |
| Database | `app/database.py` | DB connection |
| Auth | `app/auth.py` | Password hashing |

---

## ⚡ One-Line Commands

```powershell
# Full setup
mysql -u root -p -e "CREATE DATABASE Fitness_DB"; mysql -u root -p Fitness_DB < sql\schema.sql; mysql -u root -p Fitness_DB < sql\sample_data.sql; python -m venv venv; .\venv\Scripts\activate; pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Test API
python test_api.py

# Run all queries
mysql -u root -p Fitness_DB < sql\queries.sql

# Check database
mysql -u root -p -e "USE Fitness_DB; SHOW TABLES; SELECT COUNT(*) FROM users;"
```

---

## 🎯 Project Completion Status

✅ Database design (ER diagram, schema)  
✅ Normalization (3NF)  
✅ Triggers (5 implemented)  
✅ Stored procedures (7 implemented)  
✅ Functions (4 implemented)  
✅ Complex queries (20 implemented)  
✅ API endpoints (33 implemented)  
✅ Authentication (bcrypt)  
✅ Data validation (Pydantic)  
✅ Error handling  
✅ Documentation (README, setup guide)  
✅ Sample data  
✅ Test script  

**Status**: 100% Complete ✅

---

## 📞 Quick Help

**API Docs**: http://localhost:8000/docs  
**Health Check**: http://localhost:8000/health  
**Test Script**: `python test_api.py`

---

**Remember**: This is a complete, production-ready system demonstrating professional-level database design and API development! 🎉
