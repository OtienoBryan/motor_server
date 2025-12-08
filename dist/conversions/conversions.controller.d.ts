import { ConversionsService } from './conversions.service';
import { Conversion } from '../entities/conversion.entity';
import { CreateConversionDto } from './dto/create-conversion.dto';
export declare class ConversionsController {
    private readonly conversionsService;
    constructor(conversionsService: ConversionsService);
    create(createDto: CreateConversionDto): Promise<Conversion>;
    findAll(): Promise<Conversion[]>;
    findOne(id: number): Promise<Conversion>;
    update(id: number, updateDto: Partial<Conversion>): Promise<Conversion>;
}
