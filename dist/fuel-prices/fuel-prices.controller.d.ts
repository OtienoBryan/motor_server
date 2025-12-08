import { FuelPricesService } from './fuel-prices.service';
import { FuelPrice } from '../entities/fuel-price.entity';
import { CreateFuelPriceDto } from './dto/create-fuel-price.dto';
import { UpdateFuelPriceDto } from './dto/update-fuel-price.dto';
export declare class FuelPricesController {
    private readonly fuelPricesService;
    constructor(fuelPricesService: FuelPricesService);
    create(createFuelPriceDto: CreateFuelPriceDto): Promise<FuelPrice>;
    findByStation(stationId: number): Promise<FuelPrice[]>;
    findLatestByStation(stationId: number): Promise<FuelPrice | null>;
    findOne(id: number): Promise<FuelPrice>;
    update(id: number, updateFuelPriceDto: UpdateFuelPriceDto): Promise<FuelPrice>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
