import { LoyaltyPointsLedgerService } from './loyalty-points-ledger.service';
import { LoyaltyPointsLedger } from '../entities/loyalty-points-ledger.entity';
export declare class LoyaltyPointsLedgerController {
    private readonly loyaltyPointsLedgerService;
    constructor(loyaltyPointsLedgerService: LoyaltyPointsLedgerService);
    findAll(keyAccountId?: string): Promise<LoyaltyPointsLedger[]>;
    redeemPoints(keyAccountId: number, body: {
        points: number;
        stationId: number;
        referenceNumber?: string;
        createdBy?: number;
    }): Promise<LoyaltyPointsLedger>;
}
