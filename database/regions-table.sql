-- Create Regions table
CREATE TABLE IF NOT EXISTS Regions (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(191) NOT NULL,
  countryId INT(11) NOT NULL,
  status INT(11) DEFAULT 0,
  PRIMARY KEY (id),
  INDEX idx_countryId (countryId),
  INDEX idx_status (status),
  FOREIGN KEY (countryId) REFERENCES Country(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

