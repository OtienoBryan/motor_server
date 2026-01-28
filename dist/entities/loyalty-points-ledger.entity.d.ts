import { KeyAccount } from './key-account.entity';
import { Sale } from './sale.entity';
export declare class LoyaltyPointsLedger {
    id: number;
    keyAccountId: number;
    keyAccount?: KeyAccount;
    saleId?: number;
    sale?: Sale;
    transactionDate: Date;
    litres: number;
    pointsRate: number;
    pointsAwarded: number;
    balanceAfter: number;
    referenceNumber?: string;
    description?: string;
    createdBy?: number;
    createdAt: Date;
}
