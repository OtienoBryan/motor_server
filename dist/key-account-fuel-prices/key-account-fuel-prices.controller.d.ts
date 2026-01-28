import { KeyAccountFuelPricesService } from './key-account-fuel-prices.service';
import { KeyAccountFuelPrice } from '../entities/key-account-fuel-price.entity';
import { CreateKeyAccountFuelPriceDto } from './dto/create-key-account-fuel-price.dto';
import { UpdateKeyAccountFuelPriceDto } from './dto/update-key-account-fuel-price.dto';
export declare class KeyAccountFuelPricesController {
    private readonly keyAccountFuelPricesService;
    constructor(keyAccountFuelPricesService: KeyAccountFuelPricesService);
    create(createKeyAccountFuelPriceDto: CreateKeyAccountFuelPriceDto, req: any): Promise<KeyAccountFuelPrice>;
    findByKeyAccount(keyAccountId: number): Promise<KeyAccountFuelPrice[]>;
    findLatestByKeyAccount(keyAccountId: number): Promise<KeyAccountFuelPrice | null>;
    findOne(id: number): Promise<KeyAccountFuelPrice>;
    update(id: number, updateKeyAccountFuelPriceDto: UpdateKeyAccountFuelPriceDto): Promise<KeyAccountFuelPrice>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
