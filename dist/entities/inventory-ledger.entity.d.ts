import { Station } from './station.entity';
export declare enum TransactionType {
    IN = "IN",
    OUT = "OUT",
    ADJUSTMENT = "ADJUSTMENT"
}
export declare class InventoryLedger {
    id: number;
    stationId: number;
    station?: Station;
    transactionType?: TransactionType;
    quantityIn: number;
    quantityOut: number;
    balance: number;
    quantity?: number;
    previousQuantity?: number;
    newQuantity?: number;
    referenceNumber: string | null;
    notes: string | null;
    createdBy: number | null;
    created_at: Date;
}
