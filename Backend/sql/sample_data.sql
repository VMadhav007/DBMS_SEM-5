-- ==========================================
-- SAMPLE DATA FOR FITNESS_DB
-- ==========================================
-- Insert sample data for testing and demonstration
-- ==========================================

USE Fitness_DB;

-- ==========================================
-- BRANCHES
-- ==========================================
INSERT INTO branches (id, name, address, city, state, zip_code, phone) VALUES
('b1-uuid-0001', 'Downtown Fitness Hub', '123 Main St', 'Mumbai', 'Maharashtra', '400001', '022-12345678'),
('b2-uuid-0002', 'Suburb Wellness Center', '456 Park Ave', 'Mumbai', 'Maharashtra', '400051', '022-87654321'),
('b3-uuid-0003', 'North Zone Fitness', '789 MG Road', 'Bangalore', 'Karnataka', '560001', '080-11223344'),
('b4-uuid-0004', 'Beach Side Gym', '321 Marine Drive', 'Mumbai', 'Maharashtra', '400020', '022-99887766');

-- ==========================================
-- STUDIOS
-- ==========================================
INSERT INTO studios (id, name, floor, capacity, branch_id) VALUES
('s1-uuid-0001', 'Yoga Studio A', 1, 20, 'b1-uuid-0001'),
('s2-uuid-0002', 'Cardio Zone', 2, 30, 'b1-uuid-0001'),
('s3-uuid-0003', 'Strength Training', 1, 25, 'b1-uuid-0001'),
('s4-uuid-0004', 'Pilates Room', 1, 15, 'b2-uuid-0002'),
('s5-uuid-0005', 'Spin Studio', 2, 20, 'b2-uuid-0002'),
('s6-uuid-0006', 'Zumba Hall', 1, 35, 'b3-uuid-0003'),
('s7-uuid-0007', 'CrossFit Arena', 2, 25, 'b3-uuid-0003'),
('s8-uuid-0008', 'Boxing Ring', 1, 15, 'b4-uuid-0004');

-- ==========================================
-- ACTIVITY TYPES
-- ==========================================
INSERT INTO activity_types (id, name, description, is_active) VALUES
('at1-uuid-0001', 'Yoga', 'Mind and body wellness through yoga poses', 1),
('at2-uuid-0002', 'Cardio', 'High-intensity cardiovascular exercises', 1),
('at3-uuid-0003', 'Weight Training', 'Strength building with weights', 1),
('at4-uuid-0004', 'Pilates', 'Core strengthening and flexibility', 1),
('at5-uuid-0005', 'Spinning', 'Indoor cycling workout', 1),
('at6-uuid-0006', 'Zumba', 'Dance fitness program', 1),
('at7-uuid-0007', 'CrossFit', 'High-intensity functional training', 1),
('at8-uuid-0008', 'Boxing', 'Combat sports training', 1),
('at9-uuid-0009', 'HIIT', 'High-Intensity Interval Training', 1);

-- ==========================================
-- MEMBERSHIP PLANS
-- ==========================================
INSERT INTO membership_plans (id, name, description, price, duration_months, is_active) VALUES
('mp1-uuid-0001', 'Basic Monthly', 'Access to all basic facilities', 999.00, 1, 1),
('mp2-uuid-0002', 'Premium Quarterly', 'All facilities + personal trainer sessions', 2499.00, 3, 1),
('mp3-uuid-0003', 'Elite Annual', 'Unlimited access + nutrition counseling', 8999.00, 12, 1),
('mp4-uuid-0004', 'Student Monthly', 'Discounted plan for students', 699.00, 1, 1),
('mp5-uuid-0005', 'Couple Annual', 'Special plan for couples', 14999.00, 12, 1);

-- ==========================================
-- COUPONS
-- ==========================================
INSERT INTO coupons (id, code, description, discount_type, discount_value, valid_from, valid_to, is_active) VALUES
('c1-uuid-0001', 'NEWYEAR2024', 'New Year Special Discount', 'percent', 20.00, '2024-01-01 00:00:00', '2024-01-31 23:59:59', 1),
('c2-uuid-0002', 'SUMMER50', 'Summer Sale - Flat 50 off', 'flat', 50.00, '2024-05-01 00:00:00', '2024-06-30 23:59:59', 1),
('c3-uuid-0003', 'FIRST100', 'First time user discount', 'flat', 100.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1),
('c4-uuid-0004', 'REFER15', 'Referral discount 15%', 'percent', 15.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1);

-- ==========================================
-- USERS (Password: 'password123' hashed with bcrypt)
-- ==========================================
INSERT INTO users (id, name, email, password_hash, role, date_of_birth, gender) VALUES
('u1-uuid-0001', 'Rahul Sharma', 'rahul@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LPBgnxV5K9rQdPYqS', 'user', '1995-03-15', 'male'),
('u2-uuid-0002', 'Priya Patel', 'priya@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LPBgnxV5K9rQdPYqS', 'user', '1998-07-22', 'female'),
('u3-uuid-0003', 'Amit Kumar', 'amit@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LPBgnxV5K9rQdPYqS', 'user', '1992-11-10', 'male'),
('u4-uuid-0004', 'Sneha Reddy', 'sneha@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LPBgnxV5K9rQdPYqS', 'user', '1997-05-18', 'female'),
('u5-uuid-0005', 'Admin User', 'admin@fitness.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LPBgnxV5K9rQdPYqS', 'admin', '1990-01-01', 'male'),
('u6-uuid-0006', 'Vikram Singh', 'vikram@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LPBgnxV5K9rQdPYqS', 'user', '1994-09-25', 'male'),
('u7-uuid-0007', 'Anjali Gupta', 'anjali@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LPBgnxV5K9rQdPYqS', 'user', '1999-12-08', 'female');

-- ==========================================
-- USER PHONES
-- ==========================================
INSERT INTO user_phones (id, phone_number, type, verified, user_id) VALUES
('ph1-uuid-0001', '9876543210', 'mobile', 1, 'u1-uuid-0001'),
('ph2-uuid-0002', '9123456789', 'mobile', 1, 'u2-uuid-0002'),
('ph3-uuid-0003', '9988776655', 'mobile', 0, 'u3-uuid-0003'),
('ph4-uuid-0004', '9555666777', 'mobile', 1, 'u4-uuid-0004');

-- ==========================================
-- MEMBERSHIPS
-- ==========================================
INSERT INTO memberships (id, user_id, start_date, end_date, status, membership_plan_id) VALUES
('m1-uuid-0001', 'u1-uuid-0001', '2024-10-01', '2024-11-01', 'active', 'mp1-uuid-0001'),
('m2-uuid-0002', 'u2-uuid-0002', '2024-09-01', '2024-12-01', 'active', 'mp2-uuid-0002'),
('m3-uuid-0003', 'u3-uuid-0003', '2024-01-01', '2025-01-01', 'active', 'mp3-uuid-0003'),
('m4-uuid-0004', 'u4-uuid-0004', '2024-08-01', '2024-09-01', 'expired', 'mp1-uuid-0001'),
('m5-uuid-0005', 'u6-uuid-0006', '2024-10-15', '2024-11-15', 'active', 'mp4-uuid-0004');

-- ==========================================
-- PAYMENTS
-- ==========================================
INSERT INTO payments (id, user_id, membership_id, amount, payment_method, status) VALUES
('p1-uuid-0001', 'u1-uuid-0001', 'm1-uuid-0001', 999.00, 'upi', 'success'),
('p2-uuid-0002', 'u2-uuid-0002', 'm2-uuid-0002', 2499.00, 'card', 'success'),
('p3-uuid-0003', 'u3-uuid-0003', 'm3-uuid-0003', 8999.00, 'netbanking', 'success'),
('p4-uuid-0004', 'u4-uuid-0004', 'm4-uuid-0004', 999.00, 'cash', 'success'),
('p5-uuid-0005', 'u6-uuid-0006', 'm5-uuid-0005', 699.00, 'upi', 'success');

-- ==========================================
-- SESSIONS (Various times for testing)
-- ==========================================
INSERT INTO sessions (id, studio_id, name, branch_id, description, start_time, end_time, activity_type_id, instructor, capacity) VALUES
-- Today's sessions
('sess-0001', 's1-uuid-0001', 'Morning Yoga Flow', 'b1-uuid-0001', 'Gentle yoga to start your day', '2024-10-30 07:00:00', '2024-10-30 08:00:00', 'at1-uuid-0001', 'Priya Sharma', 20),
('sess-0002', 's2-uuid-0002', 'HIIT Cardio Blast', 'b1-uuid-0001', 'High intensity cardio workout', '2024-10-30 09:00:00', '2024-10-30 10:00:00', 'at2-uuid-0002', 'Rohit Kumar', 30),
('sess-0003', 's3-uuid-0003', 'Strength & Power', 'b1-uuid-0001', 'Build muscle and strength', '2024-10-30 11:00:00', '2024-10-30 12:00:00', 'at3-uuid-0003', 'Vikram Singh', 25),

-- Future sessions
('sess-0004', 's4-uuid-0004', 'Pilates Core', 'b2-uuid-0002', 'Core strengthening pilates', '2024-10-31 08:00:00', '2024-10-31 09:00:00', 'at4-uuid-0004', 'Anjali Gupta', 15),
('sess-0005', 's5-uuid-0005', 'Spin Class Pro', 'b2-uuid-0002', 'Advanced spinning workout', '2024-10-31 10:00:00', '2024-10-31 11:00:00', 'at5-uuid-0005', 'Amit Verma', 20),
('sess-0006', 's6-uuid-0006', 'Zumba Party', 'b3-uuid-0003', 'Dance your way to fitness', '2024-10-31 18:00:00', '2024-10-31 19:00:00', 'at6-uuid-0006', 'Sneha Reddy', 35),
('sess-0007', 's7-uuid-0007', 'CrossFit WOD', 'b3-uuid-0003', 'Workout of the day', '2024-11-01 06:00:00', '2024-11-01 07:00:00', 'at7-uuid-0007', 'John Doe', 25),
('sess-0008', 's8-uuid-0008', 'Boxing Basics', 'b4-uuid-0004', 'Learn boxing fundamentals', '2024-11-01 17:00:00', '2024-11-01 18:00:00', 'at8-uuid-0008', 'Mike Tyson Jr', 15),

-- More future sessions
('sess-0009', 's1-uuid-0001', 'Evening Yoga Relax', 'b1-uuid-0001', 'Unwind with evening yoga', '2024-11-02 18:00:00', '2024-11-02 19:00:00', 'at1-uuid-0001', 'Priya Sharma', 20),
('sess-0010', 's2-uuid-0002', 'Cardio Boot Camp', 'b1-uuid-0001', 'Military-style cardio training', '2024-11-02 07:00:00', '2024-11-02 08:00:00', 'at9-uuid-0009', 'Rahul Dravid', 30);

-- ==========================================
-- BOOKINGS
-- ==========================================
INSERT INTO bookings (id, user_id, session_id, status) VALUES
('bk-0001', 'u1-uuid-0001', 'sess-0001', 'confirmed'),
('bk-0002', 'u2-uuid-0002', 'sess-0001', 'confirmed'),
('bk-0003', 'u3-uuid-0003', 'sess-0002', 'confirmed'),
('bk-0004', 'u1-uuid-0001', 'sess-0004', 'confirmed'),
('bk-0005', 'u2-uuid-0002', 'sess-0005', 'confirmed'),
('bk-0006', 'u4-uuid-0004', 'sess-0006', 'cancelled'),
('bk-0007', 'u6-uuid-0006', 'sess-0007', 'confirmed'),
('bk-0008', 'u3-uuid-0003', 'sess-0008', 'confirmed'),
('bk-0009', 'u1-uuid-0001', 'sess-0009', 'confirmed'),
('bk-0010', 'u2-uuid-0002', 'sess-0010', 'confirmed');

-- ==========================================
-- CHECKINS
-- ==========================================
INSERT INTO checkins (id, user_id, session_id, branch_id) VALUES
('ci-0001', 'u1-uuid-0001', 'sess-0001', 'b1-uuid-0001'),
('ci-0002', 'u2-uuid-0002', 'sess-0001', 'b1-uuid-0001'),
('ci-0003', 'u3-uuid-0003', 'sess-0002', 'b1-uuid-0001');

-- ==========================================
-- COUPON REDEMPTIONS
-- ==========================================
INSERT INTO coupon_redemptions (id, coupon_id, user_id, payment_id) VALUES
('cr-0001', 'c3-uuid-0003', 'u1-uuid-0001', 'p1-uuid-0001'),
('cr-0002', 'c4-uuid-0004', 'u2-uuid-0002', 'p2-uuid-0002');

-- ==========================================
-- UPDATE SESSION CAPACITIES (after bookings)
-- ==========================================
UPDATE sessions SET capacity = 18 WHERE id = 'sess-0001'; -- 2 bookings
UPDATE sessions SET capacity = 29 WHERE id = 'sess-0002'; -- 1 booking
UPDATE sessions SET capacity = 14 WHERE id = 'sess-0004'; -- 1 booking
UPDATE sessions SET capacity = 19 WHERE id = 'sess-0005'; -- 1 booking
UPDATE sessions SET capacity = 35 WHERE id = 'sess-0006'; -- was cancelled, so back to full
UPDATE sessions SET capacity = 24 WHERE id = 'sess-0007'; -- 1 booking
UPDATE sessions SET capacity = 14 WHERE id = 'sess-0008'; -- 1 booking
UPDATE sessions SET capacity = 19 WHERE id = 'sess-0009'; -- 1 booking
UPDATE sessions SET capacity = 29 WHERE id = 'sess-0010'; -- 1 booking

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

SELECT '=== BRANCHES ===' as Info;
SELECT id, name, city FROM branches;

SELECT '=== MEMBERSHIP PLANS ===' as Info;
SELECT name, price, duration_months FROM membership_plans;

SELECT '=== USERS ===' as Info;
SELECT name, email, role FROM users;

SELECT '=== ACTIVE MEMBERSHIPS ===' as Info;
SELECT u.name, mp.name as plan, m.status, m.end_date 
FROM memberships m
JOIN users u ON m.user_id = u.id
JOIN membership_plans mp ON m.membership_plan_id = mp.id;

SELECT '=== UPCOMING SESSIONS ===' as Info;
SELECT s.name, s.start_time, b.name as branch, at.name as activity
FROM sessions s
JOIN branches b ON s.branch_id = b.id
JOIN activity_types at ON s.activity_type_id = at.id
WHERE s.start_time > NOW()
ORDER BY s.start_time;

SELECT '=== USER BOOKINGS ===' as Info;
SELECT u.name as user, s.name as session, b.status, s.start_time
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN sessions s ON b.session_id = s.id
ORDER BY s.start_time;

SELECT 'Sample data inserted successfully!' as Status;
