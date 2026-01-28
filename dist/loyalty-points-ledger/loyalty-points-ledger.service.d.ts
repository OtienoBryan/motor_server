import { Repository, DataSource } from 'typeorm';
import { LoyaltyPointsLedger } from '../entities/loyalty-points-ledger.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { KeyAccountLedger } from '../entities/key-account-ledger.entity';
import { Station } from '../entities/station.entity';
export declare class LoyaltyPointsLedgerService {
    private loyaltyPointsLedgerRepository;
    private keyAccountRepository;
    private keyAccountLedgerRepository;
    private stationRepository;
    private dataSource;
    constructor(loyaltyPointsLedgerRepository: Repository<LoyaltyPointsLedger>, keyAccountRepository: Repository<KeyAccount>, keyAccountLedgerRepository: Repository<KeyAccountLedger>, stationRepository: Repository<Station>, dataSource: DataSource);
    findAll(keyAccountId?: number): Promise<LoyaltyPointsLedger[]>;
    redeemPoints(keyAccountId: number, pointsToRedeem: number, stationId: number, referenceNumber?: string, createdBy?: number): Promise<LoyaltyPointsLedger>;
}
