-- Create InventoryLedger table
CREATE TABLE IF NOT EXISTS InventoryLedger (
  id INT(11) NOT NULL AUTO_INCREMENT,
  stationId INT(11) NOT NULL,
  transactionType ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  previousQuantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  newQuantity DECIMAL(10,2) NOT NULL,
  referenceNumber VARCHAR(255) NULL,
  notes TEXT NULL,
  createdBy INT(11) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_stationId (stationId),
  INDEX idx_created_at (created_at),
  INDEX idx_transactionType (transactionType),
  INDEX idx_createdBy (createdBy),
  FOREIGN KEY (stationId) REFERENCES Stations(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add lpgQuantity column to Stations table
-- Check if column exists before adding (MySQL doesn't support IF NOT EXISTS for ALTER TABLE)
-- Run this query to check: SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Stations' AND COLUMN_NAME = 'lpgQuantity';
-- If the query returns no rows, then run the ALTER TABLE statement below:
ALTER TABLE Stations ADD COLUMN lpgQuantity DECIMAL(10,2) NOT NULL DEFAULT 0;

