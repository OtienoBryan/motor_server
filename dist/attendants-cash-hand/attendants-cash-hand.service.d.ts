import { DataSource } from 'typeorm';
export interface AttendantCashSummaryRow {
    attendantId: number;
    attendantName: string;
    role: string | null;
    cashBalance: number;
}
export interface AttendantCashLedgerRow {
    id: number;
    attendantId: number;
    date: string;
    amountIn: number;
    amountOut: number;
    cashBalance: number;
    reference: string;
    paymentMethod: string;
}
export declare class AttendantsCashHandService {
    private dataSource;
    constructor(dataSource: DataSource);
    getSummary(): Promise<AttendantCashSummaryRow[]>;
    getLedger(attendantId: number): Promise<AttendantCashLedgerRow[]>;
}
