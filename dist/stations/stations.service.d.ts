import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { Region } from '../entities/region.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
export declare class StationsService {
    private stationRepository;
    private regionRepository;
    constructor(stationRepository: Repository<Station>, regionRepository: Repository<Region>);
    findAll(): Promise<Station[]>;
    findOne(id: number): Promise<Station>;
    create(createStationDto: CreateStationDto): Promise<Station>;
    update(id: number, updateStationDto: UpdateStationDto): Promise<Station>;
    remove(id: number): Promise<void>;
}
