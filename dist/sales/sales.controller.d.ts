import { SalesService } from './sales.service';
import { Sale } from '../entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createDto: CreateSaleDto): Promise<Sale>;
    findAll(stationId?: string, keyAccountId?: string): Promise<Sale[]>;
    findOne(id: number): Promise<Sale>;
}
