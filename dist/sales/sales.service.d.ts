import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Station } from '../entities/station.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesService {
    private saleRepository;
    private stationRepository;
    constructor(saleRepository: Repository<Sale>, stationRepository: Repository<Station>);
    create(createDto: CreateSaleDto): Promise<Sale>;
    findAll(stationId?: number, keyAccountId?: number): Promise<Sale[]>;
    findOne(id: number): Promise<Sale>;
}
