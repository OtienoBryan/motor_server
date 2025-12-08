import { Repository } from 'typeorm';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateKeyAccountDto } from './dto/create-key-account.dto';
import { UpdateKeyAccountDto } from './dto/update-key-account.dto';
export declare class KeyAccountsService {
    private keyAccountRepository;
    constructor(keyAccountRepository: Repository<KeyAccount>);
    findAll(): Promise<KeyAccount[]>;
    findOne(id: number): Promise<KeyAccount>;
    create(createKeyAccountDto: CreateKeyAccountDto): Promise<KeyAccount>;
    update(id: number, updateKeyAccountDto: UpdateKeyAccountDto): Promise<KeyAccount>;
    remove(id: number): Promise<void>;
}
