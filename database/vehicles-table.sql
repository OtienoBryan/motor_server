-- Create Vehicles table
CREATE TABLE IF NOT EXISTS Vehicles (
  id INT(11) NOT NULL AUTO_INCREMENT,
  key_account_id INT(11) NOT NULL,
  registration_number VARCHAR(50) NOT NULL,
  model VARCHAR(255) NOT NULL,
  driver_name VARCHAR(255) NOT NULL,
  driver_contact VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_key_account_id (key_account_id),
  INDEX idx_registration_number (registration_number),
  FOREIGN KEY (key_account_id) REFERENCES KeyAccounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

