import { KeyAccountsService } from './key-accounts.service';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateKeyAccountDto } from './dto/create-key-account.dto';
import { UpdateKeyAccountDto } from './dto/update-key-account.dto';
export declare class KeyAccountsController {
    private readonly keyAccountsService;
    constructor(keyAccountsService: KeyAccountsService);
    findAll(): Promise<KeyAccount[]>;
    findOne(id: number): Promise<KeyAccount>;
    create(createKeyAccountDto: CreateKeyAccountDto): Promise<KeyAccount>;
    update(id: number, updateKeyAccountDto: UpdateKeyAccountDto): Promise<KeyAccount>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
