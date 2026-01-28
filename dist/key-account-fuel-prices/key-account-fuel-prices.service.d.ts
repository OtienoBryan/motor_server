import { Repository } from 'typeorm';
import { KeyAccountFuelPrice } from '../entities/key-account-fuel-price.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { Staff } from '../entities/staff.entity';
import { CreateKeyAccountFuelPriceDto } from './dto/create-key-account-fuel-price.dto';
import { UpdateKeyAccountFuelPriceDto } from './dto/update-key-account-fuel-price.dto';
export declare class KeyAccountFuelPricesService {
    private keyAccountFuelPriceRepository;
    private keyAccountRepository;
    private staffRepository;
    constructor(keyAccountFuelPriceRepository: Repository<KeyAccountFuelPrice>, keyAccountRepository: Repository<KeyAccount>, staffRepository: Repository<Staff>);
    create(createKeyAccountFuelPriceDto: CreateKeyAccountFuelPriceDto): Promise<KeyAccountFuelPrice>;
    findByKeyAccount(keyAccountId: number): Promise<KeyAccountFuelPrice[]>;
    findLatestByKeyAccount(keyAccountId: number): Promise<KeyAccountFuelPrice | null>;
    findOne(id: number): Promise<KeyAccountFuelPrice>;
    update(id: number, updateKeyAccountFuelPriceDto: UpdateKeyAccountFuelPriceDto): Promise<KeyAccountFuelPrice>;
    remove(id: number): Promise<void>;
}
