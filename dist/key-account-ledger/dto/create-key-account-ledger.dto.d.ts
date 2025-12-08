import { KeyAccountTransactionType } from '../../entities/key-account-ledger.entity';
export declare class CreateKeyAccountLedgerDto {
    keyAccountId: number;
    vehicleId?: number;
    stationId: number;
    transactionDate: string;
    transactionType: KeyAccountTransactionType;
    quantity?: number;
    unitPrice?: number;
    totalAmount: number;
    debit?: number;
    credit?: number;
    referenceNumber?: string;
    description?: string;
    notes?: string;
    createdBy?: number;
}
