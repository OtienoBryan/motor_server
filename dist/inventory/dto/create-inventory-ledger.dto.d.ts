import { TransactionType } from '../../entities/inventory-ledger.entity';
export declare class CreateInventoryLedgerDto {
    stationId: number;
    transactionType: TransactionType;
    quantity: number;
    referenceNumber?: string;
    notes?: string;
    createdBy?: number;
}
