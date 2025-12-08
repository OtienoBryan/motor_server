import { Repository } from 'typeorm';
import { Region } from '../entities/region.entity';
import { Country } from '../entities/country.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
export declare class RegionsService {
    private regionRepository;
    private countryRepository;
    constructor(regionRepository: Repository<Region>, countryRepository: Repository<Country>);
    findAll(): Promise<Region[]>;
    findOne(id: number): Promise<Region>;
    create(createRegionDto: CreateRegionDto): Promise<Region>;
    update(id: number, updateRegionDto: UpdateRegionDto): Promise<Region>;
    remove(id: number): Promise<void>;
}
