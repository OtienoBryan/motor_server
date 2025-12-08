import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryLedger, TransactionType } from '../entities/inventory-ledger.entity';
import { Station } from '../entities/station.entity';
import { CreateInventoryLedgerDto } from './dto/create-inventory-ledger.dto';
import { UpdateInventoryLedgerDto } from './dto/update-inventory-ledger.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryLedger)
    private inventoryLedgerRepository: Repository<InventoryLedger>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    private dataSource: DataSource,
  ) {}

  async create(createInventoryLedgerDto: CreateInventoryLedgerDto): Promise<InventoryLedger> {
    console.log('📦 [InventoryService] Creating inventory ledger entry');
    
    // Verify station exists
    const station = await this.stationRepository.findOne({
      where: { id: createInventoryLedgerDto.stationId }
    });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${createInventoryLedgerDto.stationId} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const previousBalance = Number(station.lpgQuantity) || 0;
      let quantityIn = 0;
      let quantityOut = 0;
      let newBalance = previousBalance;

      // Calculate quantities and balance based on transaction type
      if (createInventoryLedgerDto.transactionType === TransactionType.IN) {
        quantityIn = createInventoryLedgerDto.quantity;
        quantityOut = 0;
        newBalance = previousBalance + createInventoryLedgerDto.quantity;
      } else if (createInventoryLedgerDto.transactionType === TransactionType.OUT) {
        quantityIn = 0;
        quantityOut = createInventoryLedgerDto.quantity;
        newBalance = previousBalance - createInventoryLedgerDto.quantity;
        if (newBalance < 0) {
          throw new Error('Insufficient inventory. Cannot process OUT transaction.');
        }
      } else if (createInventoryLedgerDto.transactionType === TransactionType.ADJUSTMENT) {
        quantityIn = 0;
        quantityOut = 0;
        newBalance = createInventoryLedgerDto.quantity;
      }

      // Create ledger entry
      const inventoryLedger = this.inventoryLedgerRepository.create({
        stationId: createInventoryLedgerDto.stationId,
        transactionType: createInventoryLedgerDto.transactionType, // Keep for backward compatibility
        quantity: createInventoryLedgerDto.quantity, // Keep for backward compatibility
        previousQuantity: previousBalance, // Keep for backward compatibility
        newQuantity: newBalance, // Keep for backward compatibility
        quantityIn: quantityIn,
        quantityOut: quantityOut,
        balance: newBalance,
        referenceNumber: createInventoryLedgerDto.referenceNumber || null,
        notes: createInventoryLedgerDto.notes || null,
        createdBy: createInventoryLedgerDto.createdBy || null,
      });

      const savedLedger = await queryRunner.manager.save(InventoryLedger, inventoryLedger);

      // Update station quantity
      station.lpgQuantity = newBalance;
      await queryRunner.manager.save(Station, station);

      await queryRunner.commitTransaction();
      console.log(`✅ [InventoryService] Inventory ledger entry created with ID: ${savedLedger.id}`);

      // Reload with station relation
      const ledgerWithRelations = await this.inventoryLedgerRepository.findOne({
        where: { id: savedLedger.id },
        relations: ['station']
      });

      return ledgerWithRelations || savedLedger;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ [InventoryService] Error creating inventory ledger entry:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<InventoryLedger[]> {
    console.log('📦 [InventoryService] Finding all inventory ledger entries');
    
    const entries = await this.inventoryLedgerRepository.find({
      relations: ['station'],
      order: { created_at: 'DESC' },
    });
    
    console.log(`✅ [InventoryService] Found ${entries.length} inventory ledger entries`);
    return entries;
  }

  async findByStation(stationId: number): Promise<InventoryLedger[]> {
    console.log(`📦 [InventoryService] Finding inventory ledger entries for station: ${stationId}`);
    
    const entries = await this.inventoryLedgerRepository.find({
      where: { stationId },
      relations: ['station'],
      order: { created_at: 'DESC' },
    });
    
    console.log(`✅ [InventoryService] Found ${entries.length} entries for station ${stationId}`);
    return entries;
  }

  async findOne(id: number): Promise<InventoryLedger> {
    console.log(`📦 [InventoryService] Finding inventory ledger entry by ID: ${id}`);
    
    const entry = await this.inventoryLedgerRepository.findOne({
      where: { id },
      relations: ['station']
    });
    
    if (!entry) {
      console.log(`❌ [InventoryService] Inventory ledger entry with ID ${id} not found`);
      throw new NotFoundException(`Inventory ledger entry with ID ${id} not found`);
    }
    
    console.log(`✅ [InventoryService] Inventory ledger entry found`);
    return entry;
  }

  async getStationInventory(): Promise<Array<Station & { ledgerCount: number }>> {
    console.log('📦 [InventoryService] Getting station inventory summary');
    
    const stations = await this.stationRepository.find({
      relations: ['region'],
      order: { name: 'ASC' },
    });

    const stationsWithCount = await Promise.all(
      stations.map(async (station) => {
        const ledgerCount = await this.inventoryLedgerRepository.count({
          where: { stationId: station.id }
        });
        return {
          ...station,
          ledgerCount,
        };
      })
    );

    console.log(`✅ [InventoryService] Found ${stationsWithCount.length} stations with inventory`);
    return stationsWithCount;
  }

  async update(id: number, updateInventoryLedgerDto: UpdateInventoryLedgerDto): Promise<InventoryLedger> {
    console.log(`📦 [InventoryService] Updating inventory ledger entry with ID: ${id}`);
    
    const entry = await this.inventoryLedgerRepository.findOne({ where: { id } });
    
    if (!entry) {
      throw new NotFoundException(`Inventory ledger entry with ID ${id} not found`);
    }
    
    Object.assign(entry, updateInventoryLedgerDto);
    const updatedEntry = await this.inventoryLedgerRepository.save(entry);
    console.log(`✅ [InventoryService] Inventory ledger entry updated`);
    
    // Reload with station relation
    const entryWithRelations = await this.inventoryLedgerRepository.findOne({
      where: { id: updatedEntry.id },
      relations: ['station']
    });
    
    return entryWithRelations || updatedEntry;
  }

  async remove(id: number): Promise<void> {
    console.log(`📦 [InventoryService] Deleting inventory ledger entry with ID: ${id}`);
    
    const entry = await this.inventoryLedgerRepository.findOne({ where: { id } });
    
    if (!entry) {
      throw new NotFoundException(`Inventory ledger entry with ID ${id} not found`);
    }
    
    await this.inventoryLedgerRepository.remove(entry);
    console.log(`✅ [InventoryService] Inventory ledger entry deleted`);
  }
}

