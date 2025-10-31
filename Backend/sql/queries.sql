-- ==========================================
-- COMPLEX SQL QUERIES FOR FITNESS_DB
-- ==========================================
-- These queries demonstrate various SQL concepts:
-- JOINs, GROUP BY, HAVING, Subqueries, Aggregations
-- ==========================================

USE Fitness_DB;

-- ==========================================
-- QUERY 1: List all users with active memberships
-- Demonstrates: INNER JOIN, Multiple table joins
-- ==========================================
SELECT 
    u.id AS user_id,
    u.name,
    u.email,
    m.status AS membership_status,
    mp.name AS plan_name,
    mp.price,
    m.start_date,
    m.end_date,
    DATEDIFF(m.end_date, CURDATE()) AS days_remaining
FROM users u
INNER JOIN memberships m ON u.id = m.user_id
INNER JOIN membership_plans mp ON mp.id = m.membership_plan_id
WHERE m.status = 'active'
ORDER BY m.end_date ASC;


-- ==========================================
-- QUERY 2: Branch-wise revenue report
-- Demonstrates: LEFT JOIN, GROUP BY, Aggregation
-- ==========================================
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
ORDER BY total_revenue DESC;


-- ==========================================
-- QUERY 3: Most popular sessions (most booked)
-- Demonstrates: JOIN, GROUP BY, ORDER BY, LIMIT
-- ==========================================
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
LIMIT 10;


-- ==========================================
-- QUERY 4: Users who have used coupons
-- Demonstrates: Multiple JOINs, Date formatting
-- ==========================================
SELECT 
    u.name AS user_name,
    u.email,
    c.code AS coupon_code,
    c.discount_type,
    c.discount_value,
    cr.redemption_time,
    p.amount AS final_amount
FROM coupon_redemptions cr
INNER JOIN users u ON cr.user_id = u.id
INNER JOIN coupons c ON cr.coupon_id = c.id
INNER JOIN payments p ON cr.payment_id = p.id
ORDER BY cr.redemption_time DESC;


-- ==========================================
-- QUERY 5: Sessions with available capacity
-- Demonstrates: WHERE clause with date filtering
-- ==========================================
SELECT 
    s.name AS session_name,
    s.start_time,
    s.end_time,
    at.name AS activity_type,
    s.instructor,
    b.name AS branch_name,
    st.name AS studio_name,
    s.capacity AS available_spots
FROM sessions s
INNER JOIN activity_types at ON s.activity_type_id = at.id
INNER JOIN branches b ON s.branch_id = b.id
INNER JOIN studios st ON s.studio_id = st.id
WHERE s.capacity > 0 
  AND s.start_time > NOW()
ORDER BY s.start_time ASC;


-- ==========================================
-- QUERY 6: Expired memberships count per branch
-- Demonstrates: Complex JOIN through multiple tables, GROUP BY
-- ==========================================
SELECT 
    b.name AS branch_name,
    COUNT(DISTINCT m.id) AS expired_memberships_count,
    COUNT(DISTINCT u.id) AS unique_users
FROM branches b
INNER JOIN sessions s ON b.id = s.branch_id
INNER JOIN bookings bk ON s.id = bk.session_id
INNER JOIN users u ON bk.user_id = u.id
INNER JOIN memberships m ON u.id = m.user_id
WHERE m.status = 'expired'
GROUP BY b.id, b.name
ORDER BY expired_memberships_count DESC;


-- ==========================================
-- QUERY 7: User activity report (check-ins per user)
-- Demonstrates: Subquery, Aggregation
-- ==========================================
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
ORDER BY total_checkins DESC;


-- ==========================================
-- QUERY 8: Revenue by membership plan
-- Demonstrates: GROUP BY, HAVING, Aggregation
-- ==========================================
SELECT 
    mp.name AS plan_name,
    mp.price AS plan_price,
    mp.duration_months,
    COUNT(m.id) AS total_sold,
    SUM(p.amount) AS total_revenue,
    AVG(p.amount) AS avg_payment
FROM membership_plans mp
INNER JOIN memberships m ON mp.id = m.membership_plan_id
INNER JOIN payments p ON m.id = p.membership_id
WHERE p.status = 'success'
GROUP BY mp.id, mp.name, mp.price, mp.duration_months
HAVING total_sold > 0
ORDER BY total_revenue DESC;


-- ==========================================
-- QUERY 9: Instructor performance report
-- Demonstrates: GROUP BY, Multiple aggregations
-- ==========================================
SELECT 
    s.instructor,
    COUNT(DISTINCT s.id) AS sessions_conducted,
    COUNT(DISTINCT bk.id) AS total_bookings,
    COUNT(DISTINCT c.id) AS total_checkins,
    ROUND((COUNT(DISTINCT c.id) / COUNT(DISTINCT bk.id)) * 100, 2) AS attendance_rate,
    COUNT(DISTINCT bk.user_id) AS unique_students
FROM sessions s
LEFT JOIN bookings bk ON s.id = bk.session_id AND bk.status IN ('confirmed', 'completed')
LEFT JOIN checkins c ON s.id = c.session_id
WHERE s.instructor IS NOT NULL AND s.start_time < NOW()
GROUP BY s.instructor
HAVING sessions_conducted > 0
ORDER BY attendance_rate DESC;


-- ==========================================
-- QUERY 10: Top spending users
-- Demonstrates: Subquery, ORDER BY, LIMIT
-- ==========================================
SELECT 
    u.name,
    u.email,
    COUNT(DISTINCT p.id) AS total_transactions,
    SUM(p.amount) AS total_spent,
    (SELECT COUNT(*) FROM bookings WHERE user_id = u.id) AS total_bookings,
    (SELECT COUNT(*) FROM memberships WHERE user_id = u.id AND status = 'active') AS active_memberships
FROM users u
INNER JOIN payments p ON u.id = p.user_id
WHERE p.status = 'success'
GROUP BY u.id, u.name, u.email
ORDER BY total_spent DESC
LIMIT 10;


-- ==========================================
-- QUERY 11: Studio utilization report
-- Demonstrates: Complex calculation, Multiple JOINs
-- ==========================================
SELECT 
    b.name AS branch_name,
    st.name AS studio_name,
    st.floor,
    st.capacity AS studio_capacity,
    COUNT(DISTINCT s.id) AS sessions_scheduled,
    COUNT(DISTINCT bk.id) AS total_bookings,
    ROUND(COUNT(DISTINCT bk.id) / COUNT(DISTINCT s.id), 2) AS avg_bookings_per_session
FROM studios st
INNER JOIN branches b ON st.branch_id = b.id
LEFT JOIN sessions s ON st.id = s.studio_id
LEFT JOIN bookings bk ON s.id = bk.session_id AND bk.status IN ('confirmed', 'completed')
GROUP BY st.id, b.name, st.name, st.floor, st.capacity
ORDER BY avg_bookings_per_session DESC;


-- ==========================================
-- QUERY 12: Activity type popularity analysis
-- Demonstrates: Multiple aggregations, percentage calculation
-- ==========================================
SELECT 
    at.name AS activity_type,
    COUNT(DISTINCT s.id) AS total_sessions,
    COUNT(DISTINCT bk.id) AS total_bookings,
    COUNT(DISTINCT bk.user_id) AS unique_participants,
    ROUND(AVG(s.capacity), 0) AS avg_session_capacity,
    ROUND((COUNT(DISTINCT bk.id) / COUNT(DISTINCT s.id)), 2) AS avg_bookings_per_session
FROM activity_types at
LEFT JOIN sessions s ON at.id = s.activity_type_id
LEFT JOIN bookings bk ON s.id = bk.session_id AND bk.status IN ('confirmed', 'completed')
WHERE at.is_active = 1
GROUP BY at.id, at.name
ORDER BY total_bookings DESC;


-- ==========================================
-- QUERY 13: Payment method analysis
-- Demonstrates: GROUP BY, CASE statement
-- ==========================================
SELECT 
    p.payment_method,
    COUNT(*) AS transaction_count,
    SUM(p.amount) AS total_amount,
    AVG(p.amount) AS avg_transaction_value,
    SUM(CASE WHEN p.status = 'success' THEN 1 ELSE 0 END) AS successful_payments,
    SUM(CASE WHEN p.status = 'failed' THEN 1 ELSE 0 END) AS failed_payments,
    ROUND((SUM(CASE WHEN p.status = 'success' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS success_rate
FROM payments p
GROUP BY p.payment_method
ORDER BY total_amount DESC;


-- ==========================================
-- QUERY 14: Users without active membership (potential leads)
-- Demonstrates: LEFT JOIN with NULL check, NOT EXISTS
-- ==========================================
SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at AS registration_date,
    COUNT(DISTINCT m.id) AS past_memberships,
    MAX(m.end_date) AS last_membership_end_date,
    DATEDIFF(CURDATE(), MAX(m.end_date)) AS days_since_last_membership
FROM users u
LEFT JOIN memberships m ON u.id = m.user_id
WHERE NOT EXISTS (
    SELECT 1 FROM memberships 
    WHERE user_id = u.id 
    AND status = 'active' 
    AND end_date >= CURDATE()
)
AND u.role = 'user'
GROUP BY u.id, u.name, u.email, u.created_at
ORDER BY days_since_last_membership DESC;


-- ==========================================
-- QUERY 15: Monthly revenue trend
-- Demonstrates: DATE functions, GROUP BY with dates
-- ==========================================
SELECT 
    DATE_FORMAT(p.payment_time, '%Y-%m') AS month,
    COUNT(DISTINCT p.id) AS total_transactions,
    SUM(CASE WHEN p.membership_id IS NOT NULL THEN p.amount ELSE 0 END) AS membership_revenue,
    SUM(CASE WHEN p.booking_id IS NOT NULL THEN p.amount ELSE 0 END) AS booking_revenue,
    SUM(p.amount) AS total_revenue,
    COUNT(DISTINCT p.user_id) AS unique_customers
FROM payments p
WHERE p.status = 'success'
  AND p.payment_time >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(p.payment_time, '%Y-%m')
ORDER BY month DESC;


-- ==========================================
-- QUERY 16: Find users who booked but never checked in
-- Demonstrates: LEFT JOIN with NULL, NOT IN
-- ==========================================
SELECT 
    u.name,
    u.email,
    COUNT(bk.id) AS total_bookings,
    SUM(CASE WHEN bk.status = 'confirmed' THEN 1 ELSE 0 END) AS confirmed_bookings,
    SUM(CASE WHEN bk.status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_bookings
FROM users u
INNER JOIN bookings bk ON u.id = bk.user_id
WHERE u.id NOT IN (SELECT DISTINCT user_id FROM checkins)
GROUP BY u.id, u.name, u.email
HAVING confirmed_bookings > 0
ORDER BY confirmed_bookings DESC;


-- ==========================================
-- QUERY 17: Peak hours analysis
-- Demonstrates: TIME functions, GROUP BY with time
-- ==========================================
SELECT 
    HOUR(s.start_time) AS hour_of_day,
    COUNT(DISTINCT s.id) AS sessions_count,
    COUNT(DISTINCT bk.id) AS total_bookings,
    ROUND(COUNT(DISTINCT bk.id) / COUNT(DISTINCT s.id), 2) AS avg_bookings_per_session,
    GROUP_CONCAT(DISTINCT at.name) AS activity_types
FROM sessions s
LEFT JOIN bookings bk ON s.id = bk.session_id AND bk.status IN ('confirmed', 'completed')
LEFT JOIN activity_types at ON s.activity_type_id = at.id
GROUP BY HOUR(s.start_time)
ORDER BY hour_of_day;


-- ==========================================
-- QUERY 18: Coupon effectiveness analysis
-- Demonstrates: Complex JOIN, Aggregation, Subquery
-- ==========================================
SELECT 
    c.code,
    c.discount_type,
    c.discount_value,
    COUNT(cr.id) AS times_used,
    COUNT(DISTINCT cr.user_id) AS unique_users,
    SUM(p.amount) AS total_revenue_after_discount,
    AVG(p.amount) AS avg_transaction_value,
    c.valid_from,
    c.valid_to
FROM coupons c
LEFT JOIN coupon_redemptions cr ON c.id = cr.coupon_id
LEFT JOIN payments p ON cr.payment_id = p.id
WHERE c.is_active = 1
GROUP BY c.id, c.code, c.discount_type, c.discount_value, c.valid_from, c.valid_to
ORDER BY times_used DESC;


-- ==========================================
-- QUERY 19: User retention analysis
-- Demonstrates: Complex date calculations, Multiple subqueries
-- ==========================================
SELECT 
    DATE_FORMAT(u.created_at, '%Y-%m') AS signup_month,
    COUNT(DISTINCT u.id) AS users_signed_up,
    SUM(CASE 
        WHEN EXISTS (
            SELECT 1 FROM memberships m 
            WHERE m.user_id = u.id 
            AND m.created_at > DATE_ADD(u.created_at, INTERVAL 1 MONTH)
        ) THEN 1 ELSE 0 
    END) AS retained_after_1_month,
    ROUND((SUM(CASE 
        WHEN EXISTS (
            SELECT 1 FROM memberships m 
            WHERE m.user_id = u.id 
            AND m.created_at > DATE_ADD(u.created_at, INTERVAL 1 MONTH)
        ) THEN 1 ELSE 0 
    END) / COUNT(DISTINCT u.id)) * 100, 2) AS retention_rate
FROM users u
WHERE u.role = 'user'
  AND u.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(u.created_at, '%Y-%m')
ORDER BY signup_month DESC;


-- ==========================================
-- QUERY 20: Cross-branch user activity
-- Demonstrates: Multiple JOINs, DISTINCT, GROUP BY
-- ==========================================
SELECT 
    u.name,
    u.email,
    COUNT(DISTINCT c.branch_id) AS branches_visited,
    GROUP_CONCAT(DISTINCT b.name ORDER BY b.name) AS branch_names,
    COUNT(c.id) AS total_checkins,
    MIN(c.checkin_time) AS first_visit,
    MAX(c.checkin_time) AS last_visit
FROM users u
INNER JOIN checkins c ON u.id = c.user_id
INNER JOIN branches b ON c.branch_id = b.id
GROUP BY u.id, u.name, u.email
HAVING branches_visited > 1
ORDER BY branches_visited DESC, total_checkins DESC;
