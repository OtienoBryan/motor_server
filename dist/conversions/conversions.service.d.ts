import { Repository } from 'typeorm';
import { Conversion } from '../entities/conversion.entity';
import { CreateConversionDto } from './dto/create-conversion.dto';
export declare class ConversionsService {
    private conversionRepository;
    constructor(conversionRepository: Repository<Conversion>);
    create(createDto: CreateConversionDto): Promise<Conversion>;
    findAll(): Promise<Conversion[]>;
    findOne(id: number): Promise<Conversion>;
    update(id: number, updateDto: Partial<Conversion>): Promise<Conversion>;
}
