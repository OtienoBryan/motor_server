import { RegionsService } from './regions.service';
import { Region } from '../entities/region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
export declare class RegionsController {
    private readonly regionsService;
    constructor(regionsService: RegionsService);
    findAll(): Promise<Region[]>;
    create(createRegionDto: CreateRegionDto): Promise<Region>;
    update(id: number, updateRegionDto: UpdateRegionDto): Promise<Region>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
