import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryLedger, TransactionType } from '../entities/inventory-ledger.entity';
import { Station } from '../entities/station.entity';
import { CreateInventoryLedgerDto } from './dto/create-inventory-ledger.dto';
import { UpdateInventoryLedgerDto } from './dto/update-inventory-ledger.dto';
import { CreateDeliveryApprovalDto } from './dto/create-delivery-approval.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryLedger)
    private inventoryLedgerRepository: Repository<InventoryLedger>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    private dataSource: DataSource,
  ) {}

  private async ensureDeliveryApprovalsTable(): Promise<void> {
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS gas_delivery_approvals (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        station_id INT(11) NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        delivery_date DATE NOT NULL,
        comment TEXT NULL,
        status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
        submitted_by INT(11) NULL,
        approved_by INT(11) NULL,
        approved_at DATETIME NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_gda_station_id (station_id),
        INDEX idx_gda_status (status),
        INDEX idx_gda_delivery_date (delivery_date)
      );
    `);
  }

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

  async createDeliveryApproval(createDeliveryApprovalDto: CreateDeliveryApprovalDto): Promise<any> {
    console.log('📦 [InventoryService] Creating gas delivery approval request');

    const station = await this.stationRepository.findOne({
      where: { id: createDeliveryApprovalDto.stationId }
    });

    if (!station) {
      throw new NotFoundException(`Station with ID ${createDeliveryApprovalDto.stationId} not found`);
    }

    await this.ensureDeliveryApprovalsTable();

    const result = await this.dataSource.query(
      `
      INSERT INTO gas_delivery_approvals (
        station_id,
        quantity,
        delivery_date,
        comment,
        submitted_by,
        status
      ) VALUES (?, ?, ?, ?, ?, 'pending')
      `,
      [
        createDeliveryApprovalDto.stationId,
        createDeliveryApprovalDto.quantity,
        createDeliveryApprovalDto.deliveryDate,
        createDeliveryApprovalDto.comment ?? null,
        createDeliveryApprovalDto.submittedBy ?? null
      ]
    );

    const [saved] = await this.dataSource.query(
      `
      SELECT
        gda.id,
        gda.station_id AS stationId,
        s.name AS stationName,
        gda.quantity,
        gda.delivery_date AS deliveryDate,
        gda.comment,
        gda.status,
        gda.submitted_by AS submittedBy,
        gda.created_at AS createdAt
      FROM gas_delivery_approvals gda
      LEFT JOIN Stations s ON s.id = gda.station_id
      WHERE gda.id = ?
      `,
      [result.insertId]
    );

    return saved;
  }

  async getDeliveryApprovals(
    status?: string,
    stationId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<any[]> {
    await this.ensureDeliveryApprovalsTable();

    const whereClauses: string[] = [];
    const params: any[] = [];

    if (status) {
      whereClauses.push('gda.status = ?');
      params.push(status);
    }
    if (stationId) {
      whereClauses.push('gda.station_id = ?');
      params.push(stationId);
    }
    if (startDate) {
      whereClauses.push('gda.delivery_date >= ?');
      params.push(startDate);
    }
    if (endDate) {
      whereClauses.push('gda.delivery_date <= ?');
      params.push(endDate);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const rows = await this.dataSource.query(
      `
      SELECT
        gda.id,
        gda.station_id AS stationId,
        s.name AS stationName,
        gda.quantity,
        gda.delivery_date AS deliveryDate,
        gda.comment,
        gda.status,
        gda.submitted_by AS submittedBy,
        gda.approved_by AS approvedBy,
        ab.name AS approvedByName,
        gda.approved_at AS approvedAt,
        gda.created_at AS createdAt
      FROM gas_delivery_approvals gda
      LEFT JOIN Stations s ON s.id = gda.station_id
      LEFT JOIN staff ab ON ab.id = gda.approved_by
      ${whereSql}
      ORDER BY gda.created_at DESC
      `,
      params
    );

    return rows;
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

