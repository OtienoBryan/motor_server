-- Add scheduling and status fields to conversions table
ALTER TABLE conversions
ADD COLUMN scheduled_date DATETIME NULL AFTER logbook_number,
ADD COLUMN status ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending' AFTER scheduled_date,
ADD COLUMN comment TEXT NULL AFTER status,
ADD INDEX idx_status (status),
ADD INDEX idx_scheduled_date (scheduled_date);

