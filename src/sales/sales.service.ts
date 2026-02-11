import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { ClientType } from '../entities/sale.entity';
import { Station } from '../entities/station.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { LoyaltyPointsLedger } from '../entities/loyalty-points-ledger.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(KeyAccount)
    private keyAccountRepository: Repository<KeyAccount>,
    @InjectRepository(LoyaltyPointsLedger)
    private loyaltyPointsLedgerRepository: Repository<LoyaltyPointsLedger>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateSaleDto): Promise<Sale> {
    console.log('💰 [SalesService] Creating sale');
    
    // Verify station exists
    const station = await this.stationRepository.findOne({
      where: { id: createDto.stationId }
    });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${createDto.stationId} not found`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create sale entry
      const saleData: Partial<Sale> = {
        stationId: createDto.stationId,
        clientType: createDto.clientType,
        quantity: createDto.quantity,
        unitPrice: createDto.unitPrice,
        totalAmount: createDto.totalAmount,
        saleDate: new Date(createDto.saleDate),
      };

      // Add optional fields only if they have values
      if (createDto.keyAccountId) {
        saleData.keyAccountId = createDto.keyAccountId;
      }
      if (createDto.vehicleId) {
        saleData.vehicleId = createDto.vehicleId;
      }
      if (createDto.referenceNumber) {
        saleData.referenceNumber = createDto.referenceNumber;
      }
      if (createDto.notes) {
        saleData.notes = createDto.notes;
      }
      if (createDto.createdBy) {
        saleData.createdBy = createDto.createdBy;
      }
      if (createDto.paymentMethod) {
        saleData.paymentMethod = createDto.paymentMethod;
      }

      const sale = this.saleRepository.create(saleData);
      const savedSale = await queryRunner.manager.save(Sale, sale);
      console.log(`✅ [SalesService] Sale created with ID: ${savedSale.id}`);
      console.log(`🔍 [SalesService] Checking loyalty points eligibility:`);
      console.log(`   - clientType: ${createDto.clientType} (type: ${typeof createDto.clientType})`);
      console.log(`   - KEY_ACCOUNT enum: ${ClientType.KEY_ACCOUNT}`);
      console.log(`   - keyAccountId: ${createDto.keyAccountId}`);
      console.log(`   - Comparison: ${createDto.clientType === ClientType.KEY_ACCOUNT}`);

      // Loyalty points + ledger: 10 points per litre sold (key accounts only)
      if (createDto.clientType === ClientType.KEY_ACCOUNT && createDto.keyAccountId) {
        try {
          console.log(`🎁 [SalesService] Processing loyalty points for key account sale`);
          const pointsRate = 10;
          const litres = Number(createDto.quantity) || 0;
          const pointsToAdd = litres * pointsRate;

          console.log(`📊 [SalesService] Points calculation: ${litres}L × ${pointsRate} = ${pointsToAdd} points`);

          // Verify key account exists
          console.log(`🔍 [SalesService] Looking up key account ID: ${createDto.keyAccountId}`);
          const keyAccount = await queryRunner.manager.findOne(KeyAccount, {
            where: { id: createDto.keyAccountId },
          });

          if (!keyAccount) {
            console.error(`❌ [SalesService] Key account ${createDto.keyAccountId} not found!`);
            throw new NotFoundException(`Key account with ID ${createDto.keyAccountId} not found`);
          }

          console.log(`✅ [SalesService] Key account found: ${keyAccount.name} (ID: ${keyAccount.id})`);

          // Get current points balance using raw query to ensure we get the actual value
          console.log(`🔍 [SalesService] Fetching current loyalty points balance...`);
          let currentPointsResult;
          try {
            currentPointsResult = await queryRunner.manager
              .createQueryBuilder()
              .select('ka.loyalty_points', 'points')
              .from(KeyAccount, 'ka')
              .where('ka.id = :id', { id: createDto.keyAccountId })
              .getRawOne();
            console.log(`📊 [SalesService] Raw query result:`, JSON.stringify(currentPointsResult));
          } catch (queryError) {
            console.error(`❌ [SalesService] Error fetching current points:`, queryError);
            console.error(`❌ [SalesService] Query error message:`, queryError instanceof Error ? queryError.message : String(queryError));
            console.error(`❌ [SalesService] Query error stack:`, queryError instanceof Error ? queryError.stack : 'No stack');
            throw queryError;
          }
        
          const previousPoints = Number(currentPointsResult?.points ?? 0);
          const newPointsBalance = previousPoints + pointsToAdd;
          console.log(`📊 [SalesService] Points balance: ${previousPoints} + ${pointsToAdd} = ${newPointsBalance}`);

          // Update loyalty points using raw SQL update (most reliable - uses column name directly)
          console.log(`🔄 [SalesService] Updating loyalty points in database...`);
          console.log(`   SQL: UPDATE KeyAccounts SET loyalty_points = COALESCE(loyalty_points, 0) + ${pointsToAdd} WHERE id = ${createDto.keyAccountId}`);
          let updateResult;
          try {
            updateResult = await queryRunner.manager.query(
              `UPDATE KeyAccounts SET loyalty_points = COALESCE(loyalty_points, 0) + ? WHERE id = ?`,
              [pointsToAdd, createDto.keyAccountId]
            );
            console.log(`📊 [SalesService] Update query result:`, JSON.stringify(updateResult));
            console.log(`✅ [SalesService] Update query executed successfully`);
          } catch (updateError) {
            console.error(`❌ [SalesService] Error updating loyalty points:`, updateError);
            console.error(`❌ [SalesService] Update error message:`, updateError instanceof Error ? updateError.message : String(updateError));
            console.error(`❌ [SalesService] Update error code:`, (updateError as any)?.code);
            console.error(`❌ [SalesService] Update error stack:`, updateError instanceof Error ? updateError.stack : 'No stack');
            throw updateError;
          }
        
          // Verify the update worked
          console.log(`🔍 [SalesService] Verifying points update...`);
          let verifyResult;
          try {
            verifyResult = await queryRunner.manager.query(
              `SELECT loyalty_points as points FROM KeyAccounts WHERE id = ?`,
              [createDto.keyAccountId]
            );
            console.log(`📊 [SalesService] Verification query result:`, JSON.stringify(verifyResult));
          } catch (verifyError) {
            console.error(`❌ [SalesService] Error verifying points:`, verifyError);
            console.error(`❌ [SalesService] Verify error message:`, verifyError instanceof Error ? verifyError.message : String(verifyError));
            console.error(`❌ [SalesService] Verify error stack:`, verifyError instanceof Error ? verifyError.stack : 'No stack');
            throw verifyError;
          }
        
          const verifiedPoints = Number(verifyResult?.[0]?.points ?? 0);
          console.log(`📊 [SalesService] Verified points: ${verifiedPoints}, Expected: ${newPointsBalance}`);
          if (Math.abs(verifiedPoints - newPointsBalance) > 0.01) {
            console.warn(`⚠️ [SalesService] Points mismatch! Expected ${newPointsBalance}, got ${verifiedPoints}`);
          } else {
            console.log(`✅ [SalesService] Points balance verified successfully: ${verifiedPoints}`);
          }

          console.log(`🎁 [SalesService] Incremented ${pointsToAdd} loyalty points for key account ${createDto.keyAccountId} (${previousPoints} → ${newPointsBalance})`);

          // Create ledger entry
          console.log(`📝 [SalesService] Creating loyalty points ledger entry...`);
          try {
            const ledgerRow: Partial<LoyaltyPointsLedger> = {
              keyAccountId: createDto.keyAccountId,
              saleId: savedSale.id,
              transactionDate: new Date(createDto.saleDate),
              litres,
              pointsRate,
              pointsAwarded: pointsToAdd,
              balanceAfter: newPointsBalance,
              referenceNumber: createDto.referenceNumber,
              description: `Loyalty points: +${pointsToAdd.toFixed(2)} (${litres.toFixed(2)}L × ${pointsRate})`,
              createdBy: createDto.createdBy,
            };

            console.log(`📊 [SalesService] Ledger row data:`, JSON.stringify(ledgerRow, null, 2));

            const ledgerEntity = this.loyaltyPointsLedgerRepository.create(ledgerRow);
            const savedLedger = await queryRunner.manager.save(LoyaltyPointsLedger, ledgerEntity);
            console.log(`✅ [SalesService] Created loyalty points ledger entry ID: ${savedLedger.id}`);
          } catch (ledgerError) {
            console.error(`❌ [SalesService] Error creating ledger entry:`, ledgerError);
            console.error(`❌ [SalesService] Ledger error message:`, ledgerError instanceof Error ? ledgerError.message : String(ledgerError));
            console.error(`❌ [SalesService] Ledger error code:`, (ledgerError as any)?.code);
            console.error(`❌ [SalesService] Ledger error stack:`, ledgerError instanceof Error ? ledgerError.stack : 'No stack');
            // Don't throw - ledger failure shouldn't fail the sale, but log it
            console.warn(`⚠️ [SalesService] Continuing despite ledger error...`);
          }

          console.log(`✅ [SalesService] Loyalty points processing completed successfully`);
        } catch (pointsError) {
          console.error(`❌ [SalesService] CRITICAL ERROR in loyalty points processing:`, pointsError);
          console.error(`❌ [SalesService] Error type:`, pointsError?.constructor?.name);
          console.error(`❌ [SalesService] Error message:`, pointsError instanceof Error ? pointsError.message : String(pointsError));
          console.error(`❌ [SalesService] Error code:`, (pointsError as any)?.code);
          console.error(`❌ [SalesService] Error stack:`, pointsError instanceof Error ? pointsError.stack : 'No stack');
          // Re-throw to rollback transaction
          throw pointsError;
        }
      } else {
        console.log(`ℹ️ [SalesService] Skipping loyalty points - not a key account sale`);
        console.log(`   Reason: clientType=${createDto.clientType} !== ${ClientType.KEY_ACCOUNT} OR keyAccountId=${createDto.keyAccountId} is falsy`);
      }

      await queryRunner.commitTransaction();

      // Reload with relations
      const saleWithRelations = await this.saleRepository.findOne({
        where: { id: savedSale.id },
        relations: ['station', 'keyAccount', 'vehicle'],
      });

      return saleWithRelations || (savedSale as any);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ [SalesService] Error creating sale (with loyalty points):', error);
      throw error;
    } finally {
      await queryRunner.release();
    }

  }

  async findAll(stationId?: number, keyAccountId?: number, clientType?: string): Promise<Sale[]> {
    console.log('💰 [SalesService] Finding all sales');
    console.log(`🔍 [SalesService] Filters - stationId: ${stationId}, keyAccountId: ${keyAccountId}, clientType: ${clientType}`);
    
    const queryBuilder = this.saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.station', 'station')
      .leftJoinAndSelect('sale.vehicle', 'vehicle');
    
    // Use INNER JOIN for keyAccount when filtering by clientType to ensure proper filtering
    if (clientType) {
      queryBuilder.innerJoinAndSelect('sale.keyAccount', 'keyAccount');
      console.log(`🔍 [SalesService] Using INNER JOIN to filter by client_type from KeyAccounts table: ${clientType}`);
    } else {
      queryBuilder.leftJoinAndSelect('sale.keyAccount', 'keyAccount');
    }
    
    // Build WHERE conditions
    const whereConditions: string[] = [];
    const whereParams: Record<string, any> = {};
    
    if (stationId) {
      whereConditions.push('sale.stationId = :stationId');
      whereParams.stationId = stationId;
    }
    
    if (keyAccountId) {
      whereConditions.push('sale.keyAccountId = :keyAccountId');
      whereParams.keyAccountId = keyAccountId;
    }
    
    // Filter by client_type from KeyAccounts table
    if (clientType) {
      whereConditions.push('keyAccount.client_type = :clientType');
      whereParams.clientType = clientType;
    }
    
    // Apply WHERE conditions
    if (whereConditions.length > 0) {
      queryBuilder.where(whereConditions.join(' AND '), whereParams);
    }
    
    queryBuilder.orderBy('sale.saleDate', 'DESC');
    
    const sales = await queryBuilder.getMany();
    console.log(`✅ [SalesService] Found ${sales.length} sales`);
    return sales;
  }

  async findOne(id: number): Promise<Sale> {
    console.log(`💰 [SalesService] Finding sale by ID: ${id}`);
    
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['station', 'keyAccount', 'vehicle']
    });
    
    if (!sale) {
      console.log(`❌ [SalesService] Sale with ID ${id} not found`);
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    
    console.log(`✅ [SalesService] Sale found`);
    return sale;
  }
}

