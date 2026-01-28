-- Add station_id column to staff table with foreign key to Stations table
-- This migration adds a proper relationship between staff and stations

-- Add station_id column if it doesn't exist
SET @column_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'station_id'
);

SET @sql = IF(@column_exists = 0,
  'ALTER TABLE staff ADD COLUMN station_id INT(11) NULL AFTER department_id',
  'SELECT "Column station_id already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index if it doesn't exist
SET @index_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND INDEX_NAME = 'idx_station_id'
);

SET @sql2 = IF(@index_exists = 0,
  'ALTER TABLE staff ADD INDEX idx_station_id (station_id)',
  'SELECT "Index idx_station_id already exists" AS message'
);

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Add foreign key if it doesn't exist
-- First, find the constraint name if it exists
SET @fk_name = (
  SELECT CONSTRAINT_NAME 
  FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
  WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'staff' 
  AND COLUMN_NAME = 'station_id'
  AND REFERENCED_TABLE_NAME = 'Stations'
  LIMIT 1
);

SET @fk_exists = IF(@fk_name IS NOT NULL, 1, 0);

SET @sql3 = IF(@fk_exists = 0,
  'ALTER TABLE staff ADD CONSTRAINT fk_staff_station FOREIGN KEY (station_id) REFERENCES Stations(id) ON DELETE SET NULL',
  'SELECT "Foreign key already exists" AS message'
);

PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

-- Migrate existing data from designation field to station_id
-- Only update if the parsed station_id exists in the Stations table

-- Handle JSON format: [1] or [2]
UPDATE staff s
INNER JOIN (
  SELECT id, CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(designation, '[', -1), ']', 1) AS UNSIGNED) AS parsed_station_id
  FROM staff
  WHERE designation IS NOT NULL 
  AND designation LIKE '[%]'
  AND designation REGEXP '^\\[([0-9]+)\\]$'
  AND station_id IS NULL
) parsed ON s.id = parsed.id
INNER JOIN Stations st ON st.id = parsed.parsed_station_id
SET s.station_id = parsed.parsed_station_id;

-- Handle comma-separated values (take first one)
UPDATE staff s
INNER JOIN (
  SELECT id, CAST(SUBSTRING_INDEX(designation, ',', 1) AS UNSIGNED) AS parsed_station_id
  FROM staff
  WHERE designation IS NOT NULL 
  AND designation REGEXP '^[0-9]+'
  AND designation NOT LIKE '[%]'
  AND station_id IS NULL
) parsed ON s.id = parsed.id
INNER JOIN Stations st ON st.id = parsed.parsed_station_id
SET s.station_id = parsed.parsed_station_id;

-- Handle single number values
UPDATE staff s
INNER JOIN (
  SELECT id, CAST(designation AS UNSIGNED) AS parsed_station_id
  FROM staff
  WHERE designation IS NOT NULL 
  AND designation REGEXP '^[0-9]+$'
  AND station_id IS NULL
) parsed ON s.id = parsed.id
INNER JOIN Stations st ON st.id = parsed.parsed_station_id
SET s.station_id = parsed.parsed_station_id;
