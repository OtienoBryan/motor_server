-- Add 'completed' status to conversions table
ALTER TABLE conversions
MODIFY COLUMN status ENUM('pending', 'approved', 'declined', 'completed') NOT NULL DEFAULT 'pending';

-- Add conversion_description column for completed conversion details
ALTER TABLE conversions
ADD COLUMN conversion_description TEXT NULL AFTER comment;

-- Add conversion_date column for when the conversion was completed
ALTER TABLE conversions
ADD COLUMN conversion_date DATE NULL AFTER conversion_description,
ADD INDEX idx_conversion_date (conversion_date);

