-- Create Stations table
CREATE TABLE IF NOT EXISTS Stations (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(191) NOT NULL,
  regionId INT(11) NOT NULL,
  contact VARCHAR(255) NULL,
  price DECIMAL(10,2) NULL,
  PRIMARY KEY (id),
  INDEX idx_regionId (regionId),
  FOREIGN KEY (regionId) REFERENCES Regions(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

