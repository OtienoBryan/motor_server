-- Add missing columns to staff table to match the entity definition
-- This migration adds business_email, department_email, salary, employment_type, gender, and avatar_url columns

-- Add business_email column if it doesn't exist
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'business_email'
);

SET @sql = IF(@column_exists = 0,
  'ALTER TABLE staff ADD COLUMN business_email VARCHAR(255) NULL AFTER department_id',
  'SELECT "Column business_email already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add department_email column if it doesn't exist
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'department_email'
);

SET @sql = IF(@column_exists = 0,
  'ALTER TABLE staff ADD COLUMN department_email VARCHAR(255) NULL AFTER business_email',
  'SELECT "Column department_email already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add salary column if it doesn't exist
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'salary'
);

SET @sql = IF(@column_exists = 0,
  'ALTER TABLE staff ADD COLUMN salary DECIMAL(11,2) NULL AFTER department_email',
  'SELECT "Column salary already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add employment_type column if it doesn't exist
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'employment_type'
);

SET @sql = IF(@column_exists = 0,
  'ALTER TABLE staff ADD COLUMN employment_type VARCHAR(100) NOT NULL DEFAULT "Contract" AFTER salary',
  'SELECT "Column employment_type already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add gender column if it doesn't exist
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'gender'
);

SET @sql = IF(@column_exists = 0,
  'ALTER TABLE staff ADD COLUMN gender ENUM("Male", "Female", "Other") NOT NULL DEFAULT "Male" AFTER employment_type',
  'SELECT "Column gender already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add avatar_url column if it doesn't exist
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'avatar_url'
);

SET @sql = IF(@column_exists = 0,
  'ALTER TABLE staff ADD COLUMN avatar_url VARCHAR(200) NOT NULL DEFAULT "https://via.placeholder.com/150" AFTER is_active',
  'SELECT "Column avatar_url already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add status column if it doesn't exist
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'status'
);

SET @sql = IF(@column_exists = 0,
  'ALTER TABLE staff ADD COLUMN status INT NOT NULL DEFAULT 1 AFTER avatar_url',
  'SELECT "Column status already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing rows to have default values where needed
UPDATE staff 
SET employment_type = 'Contract' 
WHERE employment_type IS NULL OR employment_type = '';

UPDATE staff 
SET gender = 'Male' 
WHERE gender IS NULL OR gender = '';

UPDATE staff 
SET avatar_url = 'https://via.placeholder.com/150' 
WHERE avatar_url IS NULL OR avatar_url = '';

UPDATE staff 
SET status = 1 
WHERE status IS NULL;
