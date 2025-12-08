import { Repository } from 'typeorm';
import { FuelPrice } from '../entities/fuel-price.entity';
import { Station } from '../entities/station.entity';
import { CreateFuelPriceDto } from './dto/create-fuel-price.dto';
import { UpdateFuelPriceDto } from './dto/update-fuel-price.dto';
export declare class FuelPricesService {
    private fuelPriceRepository;
    private stationRepository;
    constructor(fuelPriceRepository: Repository<FuelPrice>, stationRepository: Repository<Station>);
    create(createFuelPriceDto: CreateFuelPriceDto): Promise<FuelPrice>;
    findByStation(stationId: number): Promise<FuelPrice[]>;
    findLatestByStation(stationId: number): Promise<FuelPrice | null>;
    findOne(id: number): Promise<FuelPrice>;
    update(id: number, updateFuelPriceDto: UpdateFuelPriceDto): Promise<FuelPrice>;
    remove(id: number): Promise<void>;
}
