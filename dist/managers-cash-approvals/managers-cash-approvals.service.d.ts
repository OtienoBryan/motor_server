import { DataSource } from 'typeorm';
export interface ManagerCashApprovalRow {
    id: number;
    managerId: number;
    managerName: string | null;
    amount: number;
    destination: 'TILL' | 'BANK';
    reference: string;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    approvedAt: string | null;
    approvedBy: number | null;
    approvedByName: string | null;
    rejectionReason: string | null;
}
export interface CashAccountRow {
    id: number;
    name: 'TILL' | 'BANK';
    balance: number;
    createdAt: string;
    updatedAt: string;
}
export interface CashAccountLedgerRow {
    id: number;
    accountId: number;
    accountName: 'TILL' | 'BANK';
    submissionId: number | null;
    sourceManagerName: string | null;
    entryType: 'CREDIT' | 'DEBIT';
    amount: number;
    balanceAfter: number;
    reference: string;
    comment: string | null;
    createdAt: string;
}
export declare class ManagersCashApprovalsService {
    private dataSource;
    constructor(dataSource: DataSource);
    private ensureAccountTables;
    findAll(status?: string, destination?: string, managerId?: number, startDate?: string, endDate?: string): Promise<ManagerCashApprovalRow[]>;
    getCashAccounts(): Promise<CashAccountRow[]>;
    getCashAccountLedger(accountName?: string, entryType?: string, startDate?: string, endDate?: string): Promise<CashAccountLedgerRow[]>;
    approveSubmission(id: number, approvedBy?: number): Promise<void>;
    rejectSubmission(id: number, rejectionReason: string, approvedBy?: number): Promise<void>;
}
