-- Update the coupon code from NEWYEAR2024 to NEWYEAR2025 if it exists
-- This ensures consistency with the frontend expectations

USE Fitness_DB;

-- Update the coupon code if NEWYEAR2024 exists
UPDATE coupons 
SET code = 'NEWYEAR2025'
WHERE code = 'NEWYEAR2024';

-- Verify the update
SELECT * FROM coupons WHERE code LIKE 'NEWYEAR%';
