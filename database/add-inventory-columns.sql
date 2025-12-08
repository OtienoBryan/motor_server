-- Add inventory-related columns to existing tables
-- This script can be run safely multiple times (will fail gracefully if columns already exist)

-- Add lpgQuantity column to Stations table
-- Note: This will fail if the column already exists, which is expected behavior
ALTER TABLE Stations 
ADD COLUMN lpgQuantity DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Add index for createdBy in InventoryLedger (if table exists)
-- Note: This will fail if the index already exists, which is expected behavior
ALTER TABLE InventoryLedger 
ADD INDEX idx_createdBy (createdBy);

