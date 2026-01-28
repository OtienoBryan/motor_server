-- Add updatedBy column to KeyAccountFuelPrices table
-- This migration adds the updatedBy column to track which staff member updated the fuel price

ALTER TABLE KeyAccountFuelPrices 
ADD COLUMN updatedBy INT(11) NULL AFTER notes;

-- Add index for better query performance
ALTER TABLE KeyAccountFuelPrices 
ADD INDEX idx_updatedBy (updatedBy);

-- Add foreign key constraint to staff table
ALTER TABLE KeyAccountFuelPrices 
ADD CONSTRAINT fk_keyaccountfuelprices_updatedby 
FOREIGN KEY (updatedBy) REFERENCES staff(id) ON DELETE SET NULL;
