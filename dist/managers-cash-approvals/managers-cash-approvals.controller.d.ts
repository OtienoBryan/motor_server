import { CashAccountLedgerRow, CashAccountRow, ManagerCashApprovalRow, ManagersCashApprovalsService } from './managers-cash-approvals.service';
export declare class ManagersCashApprovalsController {
    private readonly managersCashApprovalsService;
    constructor(managersCashApprovalsService: ManagersCashApprovalsService);
    findAll(status?: string, destination?: string, managerId?: string, startDate?: string, endDate?: string): Promise<ManagerCashApprovalRow[]>;
    getAccounts(): Promise<CashAccountRow[]>;
    getAccountsLedger(accountName?: string, entryType?: string, startDate?: string, endDate?: string): Promise<CashAccountLedgerRow[]>;
    approve(id: number, body?: {
        approvedBy?: number;
    }): Promise<{
        message: string;
    }>;
    reject(id: number, body: {
        rejectionReason: string;
        approvedBy?: number;
    }): Promise<{
        message: string;
    }>;
}
