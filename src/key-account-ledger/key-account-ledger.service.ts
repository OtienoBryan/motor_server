import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { KeyAccountLedger, KeyAccountTransactionType } from '../entities/key-account-ledger.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateKeyAccountLedgerDto } from './dto/create-key-account-ledger.dto';

@Injectable()
export class KeyAccountLedgerService {
  constructor(
    @InjectRepository(KeyAccountLedger)
    private keyAccountLedgerRepository: Repository<KeyAccountLedger>,
    @InjectRepository(KeyAccount)
    private keyAccountRepository: Repository<KeyAccount>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateKeyAccountLedgerDto): Promise<KeyAccountLedger> {
    console.log('💰 [KeyAccountLedgerService] Creating key account ledger entry');
    
    // Verify key account exists
    const keyAccount = await this.keyAccountRepository.findOne({
      where: { id: createDto.keyAccountId }
    });
    
    if (!keyAccount) {
      throw new NotFoundException(`Key account with ID ${createDto.keyAccountId} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get previous balance - use queryRunner for consistency
      const previousEntry = await queryRunner.manager.findOne(KeyAccountLedger, {
        where: { keyAccountId: createDto.keyAccountId },
        order: { createdAt: 'DESC' }
      });
      
      const previousBalance = previousEntry ? Number(previousEntry.balance) : 0;
      
      let debit = 0;
      let credit = 0;
      let newBalance = previousBalance;

      // Calculate debit, credit, and balance based on transaction type
      if (createDto.transactionType === KeyAccountTransactionType.SALE) {
        debit = createDto.totalAmount;
        credit = 0;
        newBalance = previousBalance + debit;
      } else if (createDto.transactionType === KeyAccountTransactionType.PAYMENT) {
        debit = 0;
        credit = createDto.totalAmount;
        newBalance = previousBalance - credit;
      } else if (createDto.transactionType === KeyAccountTransactionType.ADJUSTMENT) {
        debit = createDto.debit || 0;
        credit = createDto.credit || 0;
        newBalance = previousBalance + debit - credit;
      }

      // Create ledger entry using repository create method
      const ledgerData: Partial<KeyAccountLedger> = {
        keyAccountId: createDto.keyAccountId,
        stationId: createDto.stationId,
        transactionDate: new Date(createDto.transactionDate),
        transactionType: createDto.transactionType,
        quantity: createDto.quantity || 0,
        unitPrice: createDto.unitPrice || 0,
        totalAmount: createDto.totalAmount,
        debit: debit,
        credit: credit,
        balance: newBalance,
      };

      // Add optional fields only if they have values
      if (createDto.vehicleId) {
        ledgerData.vehicleId = createDto.vehicleId;
      }
      if (createDto.referenceNumber) {
        ledgerData.referenceNumber = createDto.referenceNumber;
      }
      if (createDto.description) {
        ledgerData.description = createDto.description;
      }
      if (createDto.notes) {
        ledgerData.notes = createDto.notes;
      }
      if (createDto.createdBy) {
        ledgerData.createdBy = createDto.createdBy;
      }

      const ledgerEntry = this.keyAccountLedgerRepository.create(ledgerData);
      console.log('💰 [KeyAccountLedgerService] Saving ledger entry:', JSON.stringify(ledgerEntry, null, 2));
      const savedLedger = await queryRunner.manager.save(KeyAccountLedger, ledgerEntry);
      await queryRunner.commitTransaction();
      
      console.log(`✅ [KeyAccountLedgerService] Key account ledger entry created with ID: ${savedLedger.id}`);

      // Reload with relations
      const ledgerWithRelations = await this.keyAccountLedgerRepository.findOne({
        where: { id: savedLedger.id },
        relations: ['keyAccount', 'vehicle', 'station']
      });

      return ledgerWithRelations || savedLedger;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ [KeyAccountLedgerService] Error creating key account ledger entry:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(keyAccountId?: number): Promise<KeyAccountLedger[]> {
    console.log('💰 [KeyAccountLedgerService] Finding all key account ledger entries');
    
    const where: any = {};
    if (keyAccountId) {
      where.keyAccountId = keyAccountId;
    }
    
    const entries = await this.keyAccountLedgerRepository.find({
      where,
      relations: ['keyAccount', 'vehicle', 'station'],
      order: { createdAt: 'DESC' },
    });
    
    console.log(`✅ [KeyAccountLedgerService] Found ${entries.length} ledger entries`);
    return entries;
  }

  async findOne(id: number): Promise<KeyAccountLedger> {
    console.log(`💰 [KeyAccountLedgerService] Finding ledger entry by ID: ${id}`);
    
    const entry = await this.keyAccountLedgerRepository.findOne({
      where: { id },
      relations: ['keyAccount', 'vehicle', 'station']
    });
    
    if (!entry) {
      console.log(`❌ [KeyAccountLedgerService] Ledger entry with ID ${id} not found`);
      throw new NotFoundException(`Key account ledger entry with ID ${id} not found`);
    }
    
    console.log(`✅ [KeyAccountLedgerService] Ledger entry found`);
    return entry;
  }

  async findByKeyAccount(keyAccountId: number): Promise<KeyAccountLedger[]> {
    console.log(`💰 [KeyAccountLedgerService] Finding ledger entries for key account: ${keyAccountId}`);
    
    const entries = await this.keyAccountLedgerRepository.find({
      where: { keyAccountId },
      relations: ['keyAccount', 'vehicle', 'station'],
      order: { createdAt: 'DESC' },
    });
    
    console.log(`✅ [KeyAccountLedgerService] Found ${entries.length} entries for key account ${keyAccountId}`);
    return entries;
  }
}

