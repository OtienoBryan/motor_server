-- Add loyalty points to KeyAccounts table (10 points per litre sold)
ALTER TABLE KeyAccounts
ADD COLUMN loyalty_points DECIMAL(15,2) NOT NULL DEFAULT 0 AFTER is_active,
ADD INDEX idx_loyalty_points (loyalty_points);

