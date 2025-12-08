-- Update InventoryLedger table structure to use quantityIn, quantityOut, and balance
-- This migration changes from transactionType-based to quantityIn/quantityOut structure

-- Step 1: Add new columns
ALTER TABLE InventoryLedger 
ADD COLUMN quantityIn DECIMAL(10,2) NULL DEFAULT 0 AFTER transactionType,
ADD COLUMN quantityOut DECIMAL(10,2) NULL DEFAULT 0 AFTER quantityIn,
ADD COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER quantityOut;

-- Step 2: Migrate existing data
-- For IN transactions: set quantityIn = quantity, quantityOut = 0
UPDATE InventoryLedger 
SET quantityIn = quantity, 
    quantityOut = 0,
    balance = newQuantity
WHERE transactionType = 'IN';

-- For OUT transactions: set quantityIn = 0, quantityOut = quantity
UPDATE InventoryLedger 
SET quantityIn = 0,
    quantityOut = quantity,
    balance = newQuantity
WHERE transactionType = 'OUT';

-- For ADJUSTMENT transactions: set quantityIn = 0, quantityOut = 0, balance = quantity (which is the new balance)
UPDATE InventoryLedger 
SET quantityIn = 0,
    quantityOut = 0,
    balance = newQuantity
WHERE transactionType = 'ADJUSTMENT';

-- Step 3: Make balance NOT NULL (after data migration)
ALTER TABLE InventoryLedger 
MODIFY COLUMN balance DECIMAL(10,2) NOT NULL;

-- Step 4: (Optional) Remove old columns after verifying data migration
-- Uncomment these lines after verifying the migration worked correctly:
-- ALTER TABLE InventoryLedger DROP COLUMN transactionType;
-- ALTER TABLE InventoryLedger DROP COLUMN quantity;
-- ALTER TABLE InventoryLedger DROP COLUMN previousQuantity;
-- ALTER TABLE InventoryLedger DROP COLUMN newQuantity;
-- ALTER TABLE InventoryLedger DROP INDEX idx_transactionType;

