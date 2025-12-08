import { StationsService } from './stations.service';
import { Station } from '../entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
export declare class StationsController {
    private readonly stationsService;
    constructor(stationsService: StationsService);
    findAll(): Promise<Station[]>;
    findOne(id: number): Promise<Station>;
    create(createStationDto: CreateStationDto): Promise<Station>;
    update(id: number, updateStationDto: UpdateStationDto): Promise<Station>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
