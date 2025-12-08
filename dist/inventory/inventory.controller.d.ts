import { InventoryService } from './inventory.service';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { CreateInventoryLedgerDto } from './dto/create-inventory-ledger.dto';
import { UpdateInventoryLedgerDto } from './dto/update-inventory-ledger.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryLedgerDto: CreateInventoryLedgerDto): Promise<InventoryLedger>;
    findAll(stationId?: string): Promise<InventoryLedger[]>;
    getStationInventory(): Promise<any[]>;
    getReport(): Promise<InventoryLedger[]>;
    findOne(id: number): Promise<InventoryLedger>;
    update(id: number, updateInventoryLedgerDto: UpdateInventoryLedgerDto): Promise<InventoryLedger>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
