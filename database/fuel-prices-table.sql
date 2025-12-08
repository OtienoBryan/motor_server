-- Create FuelPrices table
CREATE TABLE IF NOT EXISTS FuelPrices (
  id INT(11) NOT NULL AUTO_INCREMENT,
  stationId INT(11) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  fuelType VARCHAR(50) NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_stationId (stationId),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (stationId) REFERENCES Stations(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

