-- Create KeyAccountFuelPrices table for tracking fuel price history per key account
CREATE TABLE IF NOT EXISTS KeyAccountFuelPrices (
  id INT(11) NOT NULL AUTO_INCREMENT,
  keyAccountId INT(11) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  notes TEXT NULL,
  updatedBy INT(11) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_keyAccountId (keyAccountId),
  INDEX idx_created_at (created_at),
  INDEX idx_updatedBy (updatedBy),
  FOREIGN KEY (keyAccountId) REFERENCES KeyAccounts(id) ON DELETE CASCADE,
  FOREIGN KEY (updatedBy) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
