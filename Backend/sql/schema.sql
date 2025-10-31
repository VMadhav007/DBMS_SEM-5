-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed
    role ENUM('user', 'admin') DEFAULT 'user',
    date_of_birth DATE,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ==========================================
-- USER PHONES TABLE
-- ==========================================
CREATE TABLE user_phones (
    id CHAR(36) PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(20),
    verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id CHAR(36) NOT NULL,
    CONSTRAINT fk_user_phones_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- MEMBERSHIP PLANS TABLE
-- ==========================================
CREATE TABLE membership_plans (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration_months INT NOT NULL CHECK (duration_months > 0),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================
-- MEMBERSHIPS TABLE
-- ==========================================
CREATE TABLE memberships (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active','expired','cancelled','pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    membership_plan_id CHAR(36) NOT NULL,
    CONSTRAINT fk_memberships_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_memberships_plan
        FOREIGN KEY (membership_plan_id)
        REFERENCES membership_plans(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- PAYMENTS TABLE
-- ==========================================
CREATE TABLE payments (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    membership_id CHAR(36),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(50) CHECK (payment_method IN ('card','cash','upi','wallet','netbanking')),
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('success','failed','pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    booking_id CHAR(36),
    CONSTRAINT fk_payments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_payments_membership
        FOREIGN KEY (membership_id)
        REFERENCES memberships(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- COUPONS TABLE
-- ==========================================
CREATE TABLE coupons (
    id CHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(10) CHECK (discount_type IN ('percent','flat')),
    discount_value DECIMAL(10,2) CHECK (discount_value >= 0),
    valid_from DATETIME,
    valid_to DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================
-- COUPON REDEMPTIONS TABLE
-- ==========================================
CREATE TABLE coupon_redemptions (
    id CHAR(36) PRIMARY KEY,
    coupon_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    redemption_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_id CHAR(36),
    CONSTRAINT fk_coupon_redemptions_coupon
        FOREIGN KEY (coupon_id)
        REFERENCES coupons(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_coupon_redemptions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_coupon_redemptions_payment
        FOREIGN KEY (payment_id)
        REFERENCES payments(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- BRANCHES TABLE
-- ==========================================
CREATE TABLE branches (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================
-- STUDIOS TABLE
-- ==========================================
CREATE TABLE studios (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    floor INT,
    capacity INT CHECK (capacity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    branch_id CHAR(36) NOT NULL,
    CONSTRAINT fk_studios_branch
        FOREIGN KEY (branch_id)
        REFERENCES branches(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- ACTIVITY TYPES TABLE
-- ==========================================
CREATE TABLE activity_types (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==========================================
-- SESSIONS TABLE
-- ==========================================
CREATE TABLE sessions (
    id CHAR(36) PRIMARY KEY,
    studio_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    branch_id CHAR(36) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    activity_type_id CHAR(36) NOT NULL,
    instructor VARCHAR(100),
    capacity INT CHECK (capacity >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_studio
        FOREIGN KEY (studio_id)
        REFERENCES studios(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_sessions_branch
        FOREIGN KEY (branch_id)
        REFERENCES branches(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_sessions_activity_type
        FOREIGN KEY (activity_type_id)
        REFERENCES activity_types(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- BOOKINGS TABLE
-- ==========================================
CREATE TABLE bookings (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('confirmed','cancelled','completed','pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id CHAR(36) NOT NULL,
    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_bookings_session
        FOREIGN KEY (session_id)
        REFERENCES sessions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- CHECKINS TABLE
-- ==========================================
CREATE TABLE checkins (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    session_id CHAR(36) NOT NULL,
    branch_id CHAR(36) NOT NULL,
    checkin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_checkins_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_checkins_session
        FOREIGN KEY (session_id)
        REFERENCES sessions(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_checkins_branch
        FOREIGN KEY (branch_id)
        REFERENCES branches(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_memberships_user_status ON memberships(user_id, status);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_session ON bookings(session_id);
CREATE INDEX idx_sessions_branch ON sessions(branch_id);
CREATE INDEX idx_sessions_datetime ON sessions(start_time, end_time);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_checkins_user ON checkins(user_id);

-- ==========================================
-- TRIGGERS
-- ==========================================

DELIMITER $$

-- Trigger 1: Auto-update membership status to expired
CREATE TRIGGER trg_update_membership_status
BEFORE UPDATE ON memberships
FOR EACH ROW
BEGIN
    IF NEW.end_date < CURDATE() AND OLD.status = 'active' THEN
        SET NEW.status = 'expired';
    END IF;
END$$

-- Trigger 2: Payment success → activate membership
CREATE TRIGGER trg_payment_success
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'success' AND OLD.status != 'success' AND NEW.membership_id IS NOT NULL THEN
        UPDATE memberships
        SET status = 'active'
        WHERE id = NEW.membership_id;
    END IF;
END$$

-- Trigger 3: Booking cancellation → increment session capacity
CREATE TRIGGER trg_cancel_booking
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE sessions
        SET capacity = capacity + 1
        WHERE id = NEW.session_id;
    END IF;
END$$

-- Trigger 4: Booking confirmation → decrement session capacity
CREATE TRIGGER trg_confirm_booking
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' THEN
        UPDATE sessions
        SET capacity = capacity - 1
        WHERE id = NEW.session_id;
    END IF;
END$$

-- Trigger 5: Prevent overbooking - check capacity before booking
CREATE TRIGGER trg_check_capacity
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE available_capacity INT;
    SELECT capacity INTO available_capacity FROM sessions WHERE id = NEW.session_id;
    
    IF available_capacity <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Session is fully booked. No capacity available.';
    END IF;
END$$

DELIMITER ;

-- ==========================================
-- STORED PROCEDURES
-- ==========================================

DELIMITER $$

-- Procedure 1: Add new user
CREATE PROCEDURE add_user(
    IN p_id CHAR(36),
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255),
    IN p_role VARCHAR(10),
    IN p_dob DATE,
    IN p_gender VARCHAR(10)
)
BEGIN
    INSERT INTO users (id, name, email, password_hash, role, date_of_birth, gender)
    VALUES (p_id, p_name, p_email, p_password_hash, p_role, p_dob, p_gender);
END$$

-- Procedure 2: Purchase Membership
CREATE PROCEDURE purchase_membership(
    IN p_user_id CHAR(36),
    IN p_plan_id CHAR(36),
    IN p_start DATE,
    IN p_amount DECIMAL(10,2),
    IN p_payment_method VARCHAR(50),
    OUT p_membership_id CHAR(36),
    OUT p_payment_id CHAR(36)
)
BEGIN
    DECLARE v_duration INT;
    DECLARE v_end DATE;
    
    -- Get plan duration
    SELECT duration_months INTO v_duration FROM membership_plans WHERE id = p_plan_id;
    SET v_end = DATE_ADD(p_start, INTERVAL v_duration MONTH);
    
    -- Generate IDs
    SET p_membership_id = UUID();
    SET p_payment_id = UUID();
    
    -- Create membership
    INSERT INTO memberships (id, user_id, start_date, end_date, status, membership_plan_id)
    VALUES (p_membership_id, p_user_id, p_start, v_end, 'pending', p_plan_id);
    
    -- Create payment
    INSERT INTO payments (id, user_id, membership_id, amount, payment_method, status)
    VALUES (p_payment_id, p_user_id, p_membership_id, p_amount, p_payment_method, 'pending');
END$$

-- Procedure 3: Book Session
CREATE PROCEDURE book_session(
    IN p_user_id CHAR(36),
    IN p_session_id CHAR(36),
    OUT p_booking_id CHAR(36)
)
BEGIN
    DECLARE v_capacity INT;
    DECLARE v_has_active_membership BOOLEAN;
    
    -- Check if user has active membership
    SET v_has_active_membership = is_active_member(p_user_id);
    
    IF NOT v_has_active_membership THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User must have an active membership to book sessions.';
    END IF;
    
    -- Check capacity
    SELECT capacity INTO v_capacity FROM sessions WHERE id = p_session_id;
    
    IF v_capacity <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Session is fully booked.';
    END IF;
    
    -- Create booking
    SET p_booking_id = UUID();
    INSERT INTO bookings (id, user_id, session_id, status)
    VALUES (p_booking_id, p_user_id, p_session_id, 'confirmed');
END$$

-- Procedure 4: Cancel Booking
CREATE PROCEDURE cancel_booking(
    IN p_booking_id CHAR(36)
)
BEGIN
    UPDATE bookings
    SET status = 'cancelled'
    WHERE id = p_booking_id AND status = 'confirmed';
END$$

-- Procedure 5: Apply Coupon
CREATE PROCEDURE apply_coupon(
    IN p_coupon_code VARCHAR(50),
    IN p_user_id CHAR(36),
    IN p_payment_id CHAR(36),
    OUT p_discount_amount DECIMAL(10,2)
)
BEGIN
    DECLARE v_coupon_id CHAR(36);
    DECLARE v_discount_type VARCHAR(10);
    DECLARE v_discount_value DECIMAL(10,2);
    DECLARE v_payment_amount DECIMAL(10,2);
    DECLARE v_valid_from DATETIME;
    DECLARE v_valid_to DATETIME;
    
    -- Get coupon details
    SELECT id, discount_type, discount_value, valid_from, valid_to
    INTO v_coupon_id, v_discount_type, v_discount_value, v_valid_from, v_valid_to
    FROM coupons
    WHERE code = p_coupon_code AND is_active = 1;
    
    IF v_coupon_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid or inactive coupon code.';
    END IF;
    
    -- Check validity period
    IF NOW() < v_valid_from OR NOW() > v_valid_to THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Coupon is not valid at this time.';
    END IF;
    
    -- Get payment amount
    SELECT amount INTO v_payment_amount FROM payments WHERE id = p_payment_id;
    
    -- Calculate discount
    SET p_discount_amount = v_payment_amount - get_discount_amount(v_payment_amount, v_discount_type, v_discount_value);
    
    -- Update payment amount
    UPDATE payments
    SET amount = amount - p_discount_amount
    WHERE id = p_payment_id;
    
    -- Record redemption
    INSERT INTO coupon_redemptions (id, coupon_id, user_id, payment_id)
    VALUES (UUID(), v_coupon_id, p_user_id, p_payment_id);
END$$

-- Procedure 6: User Check-in
CREATE PROCEDURE checkin_user(
    IN p_user_id CHAR(36),
    IN p_session_id CHAR(36),
    OUT p_checkin_id CHAR(36)
)
BEGIN
    DECLARE v_booking_exists INT;
    DECLARE v_branch_id CHAR(36);
    
    -- Check if user has a confirmed booking for this session
    SELECT COUNT(*) INTO v_booking_exists
    FROM bookings
    WHERE user_id = p_user_id AND session_id = p_session_id AND status = 'confirmed';
    
    IF v_booking_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No confirmed booking found for this session.';
    END IF;
    
    -- Get branch_id from session
    SELECT branch_id INTO v_branch_id FROM sessions WHERE id = p_session_id;
    
    -- Create check-in
    SET p_checkin_id = UUID();
    INSERT INTO checkins (id, user_id, session_id, branch_id)
    VALUES (p_checkin_id, p_user_id, p_session_id, v_branch_id);
    
    -- Update booking status to completed
    UPDATE bookings
    SET status = 'completed'
    WHERE user_id = p_user_id AND session_id = p_session_id;
END$$

-- Procedure 7: Create Session (Admin)
CREATE PROCEDURE create_session(
    IN p_studio_id CHAR(36),
    IN p_name VARCHAR(100),
    IN p_branch_id CHAR(36),
    IN p_description TEXT,
    IN p_start_time DATETIME,
    IN p_end_time DATETIME,
    IN p_activity_type_id CHAR(36),
    IN p_instructor VARCHAR(100),
    IN p_capacity INT,
    OUT p_session_id CHAR(36)
)
BEGIN
    SET p_session_id = UUID();
    INSERT INTO sessions (id, studio_id, name, branch_id, description, start_time, end_time, activity_type_id, instructor, capacity)
    VALUES (p_session_id, p_studio_id, p_name, p_branch_id, p_description, p_start_time, p_end_time, p_activity_type_id, p_instructor, p_capacity);
END$$

DELIMITER ;

-- ==========================================
-- FUNCTIONS
-- ==========================================

DELIMITER $$

-- Function 1: Calculate Discount Amount
CREATE FUNCTION get_discount_amount(
    p_price DECIMAL(10,2),
    p_discount_type VARCHAR(10),
    p_discount_value DECIMAL(10,2)
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE final_price DECIMAL(10,2);
    
    IF p_discount_type = 'percent' THEN
        SET final_price = p_price - (p_price * p_discount_value / 100);
    ELSE
        SET final_price = p_price - p_discount_value;
    END IF;
    
    -- Ensure price doesn't go below 0
    IF final_price < 0 THEN
        SET final_price = 0;
    END IF;
    
    RETURN final_price;
END$$

-- Function 2: Check if user has active membership
CREATE FUNCTION is_active_member(p_user_id CHAR(36))
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE active_count INT;
    
    SELECT COUNT(*) INTO active_count
    FROM memberships
    WHERE user_id = p_user_id 
      AND status = 'active'
      AND end_date >= CURDATE();
    
    RETURN active_count > 0;
END$$

-- Function 3: Get user's total check-ins
CREATE FUNCTION get_user_checkin_count(p_user_id CHAR(36))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE checkin_count INT;
    
    SELECT COUNT(*) INTO checkin_count
    FROM checkins
    WHERE user_id = p_user_id;
    
    RETURN checkin_count;
END$$

-- Function 4: Get available spots for a session
CREATE FUNCTION get_available_spots(p_session_id CHAR(36))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE available INT;
    
    SELECT capacity INTO available
    FROM sessions
    WHERE id = p_session_id;
    
    RETURN COALESCE(available, 0);
END$$

DELIMITER ;