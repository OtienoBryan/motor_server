import { AttendantsCashHandService, AttendantCashLedgerRow, AttendantCashSummaryRow } from './attendants-cash-hand.service';
export declare class AttendantsCashHandController {
    private readonly attendantsCashHandService;
    constructor(attendantsCashHandService: AttendantsCashHandService);
    getSummary(): Promise<AttendantCashSummaryRow[]>;
    getLedger(attendantId: number): Promise<AttendantCashLedgerRow[]>;
}
