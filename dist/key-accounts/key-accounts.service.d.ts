import { Repository } from 'typeorm';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateKeyAccountDto } from './dto/create-key-account.dto';
import { UpdateKeyAccountDto } from './dto/update-key-account.dto';
import { KeyAccountFuelPricesService } from '../key-account-fuel-prices/key-account-fuel-prices.service';
export declare class KeyAccountsService {
    private keyAccountRepository;
    private keyAccountFuelPricesService;
    constructor(keyAccountRepository: Repository<KeyAccount>, keyAccountFuelPricesService: KeyAccountFuelPricesService);
    findAll(): Promise<KeyAccount[]>;
    findOne(id: number): Promise<KeyAccount>;
    private generateUniqueAccountNumber;
    create(createKeyAccountDto: CreateKeyAccountDto): Promise<KeyAccount>;
    update(id: number, updateKeyAccountDto: UpdateKeyAccountDto, staffId?: number): Promise<KeyAccount>;
    remove(id: number): Promise<void>;
}
