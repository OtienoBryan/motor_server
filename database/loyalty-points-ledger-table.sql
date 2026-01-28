-- Create Loyalty Points Ledger table
CREATE TABLE IF NOT EXISTS loyalty_points_ledger (
  id INT(11) NOT NULL AUTO_INCREMENT,
  key_account_id INT(11) NOT NULL,
  sale_id INT(11) NULL,
  transaction_date DATETIME NOT NULL,
  litres DECIMAL(10,2) NOT NULL DEFAULT 0,
  points_rate DECIMAL(10,2) NOT NULL DEFAULT 10,
  points_awarded DECIMAL(15,2) NOT NULL DEFAULT 0,
  balance_after DECIMAL(15,2) NOT NULL DEFAULT 0,
  reference_number VARCHAR(255) NULL,
  description TEXT NULL,
  created_by INT(11) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_key_account_id (key_account_id),
  INDEX idx_sale_id (sale_id),
  INDEX idx_transaction_date (transaction_date),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (key_account_id) REFERENCES KeyAccounts(id) ON DELETE RESTRICT,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

