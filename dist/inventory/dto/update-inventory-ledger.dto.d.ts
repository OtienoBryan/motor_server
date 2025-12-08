import { TransactionType } from '../../entities/inventory-ledger.entity';
export declare class UpdateInventoryLedgerDto {
    transactionType?: TransactionType;
    quantity?: number;
    referenceNumber?: string;
    notes?: string;
}
