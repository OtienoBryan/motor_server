import { Repository, DataSource } from 'typeorm';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { Station } from '../entities/station.entity';
import { CreateInventoryLedgerDto } from './dto/create-inventory-ledger.dto';
import { UpdateInventoryLedgerDto } from './dto/update-inventory-ledger.dto';
export declare class InventoryService {
    private inventoryLedgerRepository;
    private stationRepository;
    private dataSource;
    constructor(inventoryLedgerRepository: Repository<InventoryLedger>, stationRepository: Repository<Station>, dataSource: DataSource);
    create(createInventoryLedgerDto: CreateInventoryLedgerDto): Promise<InventoryLedger>;
    findAll(): Promise<InventoryLedger[]>;
    findByStation(stationId: number): Promise<InventoryLedger[]>;
    findOne(id: number): Promise<InventoryLedger>;
    getStationInventory(): Promise<Array<Station & {
        ledgerCount: number;
    }>>;
    update(id: number, updateInventoryLedgerDto: UpdateInventoryLedgerDto): Promise<InventoryLedger>;
    remove(id: number): Promise<void>;
}
