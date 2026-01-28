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
        order: { id: 'DESC' }
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
      
      // Update key account balance
      await queryRunner.manager.update(KeyAccount, createDto.keyAccountId, {
        balance: newBalance
      });
      console.log(`💰 [KeyAccountLedgerService] Updated key account balance to: ${newBalance}`);
      
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
      order: {
        id: 'DESC'
      },
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
      order: {
        id: 'DESC'
      },
    });
    
    console.log(`✅ [KeyAccountLedgerService] Found ${entries.length} entries for key account ${keyAccountId}`);
    return entries;
  }

  async getPendingInvoices(keyAccountId: number): Promise<KeyAccountLedger[]> {
    console.log(`💰 [KeyAccountLedgerService] Finding pending invoices for key account: ${keyAccountId}`);
    
    // Get all SALE transactions (invoices) for this key account
    const invoices = await this.keyAccountLedgerRepository.find({
      where: {
        keyAccountId,
        transactionType: KeyAccountTransactionType.SALE
      },
      relations: ['keyAccount', 'vehicle', 'station'],
      order: {
        transactionDate: 'DESC',
        id: 'DESC'
      },
    });
    
    console.log(`✅ [KeyAccountLedgerService] Found ${invoices.length} invoices for key account ${keyAccountId}`);
    return invoices;
  }

  async getAgingAnalysis(): Promise<any[]> {
    console.log('💰 [KeyAccountLedgerService] Calculating aging analysis');
    
    // Get all key accounts with positive balances (receivables)
    const keyAccounts = await this.keyAccountRepository.find({
      where: {},
      order: { name: 'ASC' }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    interface AgingDataItem {
      keyAccountId: number;
      keyAccountName: string;
      accountNumber: string;
      email: string;
      balance: number;
      daysAged: number;
      oldestTransactionDate: string | null;
      agingBucket: string;
      current: number;
      days31to60: number;
      days61to90: number;
      days91to120: number;
      over120: number;
    }

    const agingData: AgingDataItem[] = [];

    for (const account of keyAccounts) {
      const balance = Number(account.balance || 0);
      
      // Only include accounts with positive balances (receivables)
      if (balance <= 0) continue;

      // Find the oldest unpaid SALE transaction
      // We'll use the oldest SALE transaction as the basis for aging
      const oldestSale = await this.keyAccountLedgerRepository.findOne({
        where: {
          keyAccountId: account.id,
          transactionType: KeyAccountTransactionType.SALE
        },
        order: {
          transactionDate: 'ASC',
          id: 'ASC'
        }
      });

      let daysAged = 0;
      let oldestTransactionDate: Date | null = null;

      if (oldestSale) {
        oldestTransactionDate = new Date(oldestSale.transactionDate);
        const diffTime = today.getTime() - oldestTransactionDate.getTime();
        daysAged = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      } else {
        // If no sale found, check the oldest transaction of any type
        const oldestTransaction = await this.keyAccountLedgerRepository.findOne({
          where: { keyAccountId: account.id },
          order: {
            transactionDate: 'ASC',
            id: 'ASC'
          }
        });

        if (oldestTransaction) {
          oldestTransactionDate = new Date(oldestTransaction.transactionDate);
          const diffTime = today.getTime() - oldestTransactionDate.getTime();
          daysAged = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        }
      }

      // Categorize into aging buckets
      let agingBucket = 'Current';
      if (daysAged > 120) {
        agingBucket = 'Over 120 Days';
      } else if (daysAged > 90) {
        agingBucket = '91-120 Days';
      } else if (daysAged > 60) {
        agingBucket = '61-90 Days';
      } else if (daysAged > 30) {
        agingBucket = '31-60 Days';
      } else {
        agingBucket = 'Current';
      }

      agingData.push({
        keyAccountId: account.id,
        keyAccountName: account.name,
        accountNumber: account.account_number,
        email: account.email,
        balance: balance,
        daysAged: daysAged,
        oldestTransactionDate: oldestTransactionDate ? oldestTransactionDate.toISOString().split('T')[0] : null,
        agingBucket: agingBucket,
        current: daysAged <= 30 ? balance : 0,
        days31to60: daysAged > 30 && daysAged <= 60 ? balance : 0,
        days61to90: daysAged > 60 && daysAged <= 90 ? balance : 0,
        days91to120: daysAged > 90 && daysAged <= 120 ? balance : 0,
        over120: daysAged > 120 ? balance : 0,
      });
    }

    console.log(`✅ [KeyAccountLedgerService] Aging analysis calculated for ${agingData.length} accounts`);
    return agingData;
  }
}

