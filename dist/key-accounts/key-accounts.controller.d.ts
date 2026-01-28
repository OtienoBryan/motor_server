import { KeyAccountsService } from './key-accounts.service';
import { KeyAccountLedgerService } from '../key-account-ledger/key-account-ledger.service';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateKeyAccountDto } from './dto/create-key-account.dto';
import { UpdateKeyAccountDto } from './dto/update-key-account.dto';
export declare class KeyAccountsController {
    private readonly keyAccountsService;
    private readonly keyAccountLedgerService;
    constructor(keyAccountsService: KeyAccountsService, keyAccountLedgerService: KeyAccountLedgerService);
    findAll(): Promise<KeyAccount[]>;
    getReceivablesAgingAnalysis(): Promise<any[]>;
    getPendingInvoices(id: number): Promise<any[]>;
    findOne(id: number): Promise<KeyAccount>;
    create(createKeyAccountDto: CreateKeyAccountDto): Promise<KeyAccount>;
    update(id: number, updateKeyAccountDto: UpdateKeyAccountDto, req: any): Promise<KeyAccount>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
