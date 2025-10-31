-- Quick script to reload sample data with updated dates

USE Fitness_DB;

-- Clear existing data (in reverse order due to foreign keys)
DELETE FROM coupon_redemptions;
DELETE FROM checkins;
DELETE FROM bookings;
DELETE FROM payments;
DELETE FROM memberships;
DELETE FROM user_phones;
DELETE FROM sessions;
DELETE FROM coupons;
DELETE FROM membership_plans;
DELETE FROM activity_types;
DELETE FROM studios;
DELETE FROM branches;
DELETE FROM users;

-- Now run the sample_data.sql file
SOURCE sample_data.sql;
