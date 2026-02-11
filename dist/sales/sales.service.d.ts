import { DataSource, Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Station } from '../entities/station.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { LoyaltyPointsLedger } from '../entities/loyalty-points-ledger.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private saleRepository;
    private stationRepository;
    private keyAccountRepository;
    private loyaltyPointsLedgerRepository;
    private dataSource;
    constructor(saleRepository: Repository<Sale>, stationRepository: Repository<Station>, keyAccountRepository: Repository<KeyAccount>, loyaltyPointsLedgerRepository: Repository<LoyaltyPointsLedger>, dataSource: DataSource);
    create(createDto: CreateSaleDto): Promise<Sale>;
    findAll(stationId?: number, keyAccountId?: number, clientType?: string): Promise<Sale[]>;
    findOne(id: number): Promise<Sale>;
}
