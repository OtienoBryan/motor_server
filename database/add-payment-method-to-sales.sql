-- Add payment_method column to sales table
ALTER TABLE sales 
ADD COLUMN payment_method ENUM('cash', 'card', 'mobile_money', 'credit', 'other') NULL 
AFTER total_amount;

-- Add index for payment_method
CREATE INDEX idx_payment_method ON sales(payment_method);
