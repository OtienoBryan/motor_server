import { Repository, DataSource } from 'typeorm';
import { KeyAccountLedger } from '../entities/key-account-ledger.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateKeyAccountLedgerDto } from './dto/create-key-account-ledger.dto';
export declare class KeyAccountLedgerService {
    private keyAccountLedgerRepository;
    private keyAccountRepository;
    private dataSource;
    constructor(keyAccountLedgerRepository: Repository<KeyAccountLedger>, keyAccountRepository: Repository<KeyAccount>, dataSource: DataSource);
    create(createDto: CreateKeyAccountLedgerDto): Promise<KeyAccountLedger>;
    findAll(keyAccountId?: number): Promise<KeyAccountLedger[]>;
    findOne(id: number): Promise<KeyAccountLedger>;
    findByKeyAccount(keyAccountId: number): Promise<KeyAccountLedger[]>;
    getPendingInvoices(keyAccountId: number): Promise<KeyAccountLedger[]>;
    getAgingAnalysis(): Promise<any[]>;
}
