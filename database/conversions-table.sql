-- Create Conversions table
CREATE TABLE IF NOT EXISTS conversions (
  id INT(11) NOT NULL AUTO_INCREMENT,
  owner_full_name VARCHAR(255) NOT NULL,
  national_id VARCHAR(50) NULL,
  passport_id VARCHAR(50) NULL,
  contact VARCHAR(50) NOT NULL,
  email VARCHAR(255) NULL,
  vehicle_registration VARCHAR(50) NOT NULL,
  make VARCHAR(255) NULL,
  model VARCHAR(255) NULL,
  year_of_manufacture INT(4) NULL,
  engine_capacity INT(11) NULL,
  vin_chassis_number VARCHAR(100) NULL,
  current_fuel_type ENUM('petrol', 'diesel', 'hybrid') NOT NULL DEFAULT 'petrol',
  logbook_number VARCHAR(100) NULL,
  created_by INT(11) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_owner_full_name (owner_full_name),
  INDEX idx_vehicle_registration (vehicle_registration),
  INDEX idx_contact (contact),
  INDEX idx_created_at (created_at),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

