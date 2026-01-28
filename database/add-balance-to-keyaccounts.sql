-- Add balance column to KeyAccounts table
ALTER TABLE KeyAccounts 
ADD COLUMN balance DECIMAL(15,2) NOT NULL DEFAULT 0 AFTER loyalty_points,
ADD INDEX idx_balance (balance);

-- Calculate initial balances from existing ledger entries
-- This updates each key account's balance based on the latest ledger entry balance
UPDATE KeyAccounts ka
SET ka.balance = COALESCE((
    SELECT kal.balance 
    FROM key_account_ledger kal 
    WHERE kal.key_account_id = ka.id 
    ORDER BY kal.created_at DESC 
    LIMIT 1
), 0);
