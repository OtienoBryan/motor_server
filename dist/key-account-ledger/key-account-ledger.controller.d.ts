import { KeyAccountLedgerService } from './key-account-ledger.service';
import { KeyAccountLedger } from '../entities/key-account-ledger.entity';
import { CreateKeyAccountLedgerDto } from './dto/create-key-account-ledger.dto';
export declare class KeyAccountLedgerController {
    private readonly keyAccountLedgerService;
    constructor(keyAccountLedgerService: KeyAccountLedgerService);
    create(createDto: CreateKeyAccountLedgerDto): Promise<KeyAccountLedger>;
    findAll(keyAccountId?: string): Promise<KeyAccountLedger[]>;
    findOne(id: number): Promise<KeyAccountLedger>;
    findByKeyAccount(keyAccountId: number): Promise<KeyAccountLedger[]>;
}
