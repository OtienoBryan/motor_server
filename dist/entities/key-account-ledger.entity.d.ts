import { KeyAccount } from './key-account.entity';
import { Vehicle } from './vehicle.entity';
import { Station } from './station.entity';
export declare enum KeyAccountTransactionType {
    SALE = "SALE",
    PAYMENT = "PAYMENT",
    ADJUSTMENT = "ADJUSTMENT"
}
export declare class KeyAccountLedger {
    id: number;
    keyAccountId: number;
    keyAccount?: KeyAccount;
    vehicleId?: number;
    vehicle?: Vehicle;
    stationId: number;
    station?: Station;
    transactionDate: Date;
    transactionType: KeyAccountTransactionType;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    debit: number;
    credit: number;
    balance: number;
    referenceNumber?: string;
    description?: string;
    notes?: string;
    createdBy?: number;
    createdAt: Date;
    updatedAt: Date;
}
