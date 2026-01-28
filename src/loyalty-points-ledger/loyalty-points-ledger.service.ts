import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LoyaltyPointsLedger } from '../entities/loyalty-points-ledger.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { KeyAccountLedger, KeyAccountTransactionType } from '../entities/key-account-ledger.entity';
import { Station } from '../entities/station.entity';

@Injectable()
export class LoyaltyPointsLedgerService {
  constructor(
    @InjectRepository(LoyaltyPointsLedger)
    private loyaltyPointsLedgerRepository: Repository<LoyaltyPointsLedger>,
    @InjectRepository(KeyAccount)
    private keyAccountRepository: Repository<KeyAccount>,
    @InjectRepository(KeyAccountLedger)
    private keyAccountLedgerRepository: Repository<KeyAccountLedger>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    private dataSource: DataSource,
  ) {}

  async findAll(keyAccountId?: number): Promise<LoyaltyPointsLedger[]> {
    const where: any = {};
    if (keyAccountId) {
      where.keyAccountId = keyAccountId;
    }

    return this.loyaltyPointsLedgerRepository.find({
      where,
      relations: ['keyAccount', 'sale'],
      order: { createdAt: 'DESC' },
    });
  }

  async redeemPoints(keyAccountId: number, pointsToRedeem: number, stationId: number, referenceNumber?: string, createdBy?: number): Promise<LoyaltyPointsLedger> {
    console.log(`🎁 [LoyaltyPointsLedgerService] Redeeming ${pointsToRedeem} points for key account ${keyAccountId}`);
    
    if (pointsToRedeem <= 0) {
      throw new BadRequestException('Points to redeem must be greater than 0');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify station exists
      const station = await queryRunner.manager.findOne(Station, {
        where: { id: stationId },
      });

      if (!station) {
        throw new NotFoundException(`Station with ID ${stationId} not found`);
      }

      // Get current points balance
      const keyAccount = await queryRunner.manager.findOne(KeyAccount, {
        where: { id: keyAccountId },
      });

      if (!keyAccount) {
        throw new NotFoundException(`Key account with ID ${keyAccountId} not found`);
      }

      const currentPointsResult = await queryRunner.manager.query(
        `SELECT loyalty_points as points FROM KeyAccounts WHERE id = ?`,
        [keyAccountId]
      );
      
      const currentPoints = Number(currentPointsResult?.[0]?.points ?? 0);
      
      if (currentPoints < pointsToRedeem) {
        throw new BadRequestException(`Insufficient points. Current balance: ${currentPoints}, requested: ${pointsToRedeem}`);
      }

      const newPointsBalance = currentPoints - pointsToRedeem;
      const cashValue = (pointsToRedeem / 100) * 10; // 100 points = 10 KES

      // Get previous key account ledger balance
      const previousLedgerEntry = await queryRunner.manager.findOne(KeyAccountLedger, {
        where: { keyAccountId: keyAccountId },
        order: { createdAt: 'DESC' }
      });
      
      const previousBalance = previousLedgerEntry ? Number(previousLedgerEntry.balance) : 0;
      const newAccountBalance = previousBalance - cashValue; // Credit reduces balance (customer owes less)

      // Update loyalty points
      await queryRunner.manager.query(
        `UPDATE KeyAccounts SET loyalty_points = loyalty_points - ? WHERE id = ?`,
        [pointsToRedeem, keyAccountId]
      );

      // Create loyalty points ledger entry for redemption
      const pointsLedgerRow: Partial<LoyaltyPointsLedger> = {
        keyAccountId: keyAccountId,
        transactionDate: new Date(),
        litres: 0,
        pointsRate: 0,
        pointsAwarded: -pointsToRedeem, // Negative for redemption
        balanceAfter: newPointsBalance,
        referenceNumber: referenceNumber,
        description: `Points redemption: -${pointsToRedeem.toFixed(2)} points (Value: ${cashValue.toFixed(2)} KES)`,
        createdBy: createdBy,
      };

      const pointsLedgerEntity = this.loyaltyPointsLedgerRepository.create(pointsLedgerRow);
      await queryRunner.manager.save(LoyaltyPointsLedger, pointsLedgerEntity);

      // Create key account ledger entry (PAYMENT type - credit reduces balance)
      const accountLedgerRow: Partial<KeyAccountLedger> = {
        keyAccountId: keyAccountId,
        stationId: stationId,
        transactionDate: new Date(),
        transactionType: KeyAccountTransactionType.PAYMENT,
        quantity: 0,
        unitPrice: 0,
        totalAmount: cashValue,
        debit: 0,
        credit: cashValue,
        balance: newAccountBalance,
        referenceNumber: referenceNumber || `REDEEM-${pointsToRedeem}-PTS`,
        description: `Loyalty points redemption: ${pointsToRedeem.toFixed(2)} points redeemed for ${cashValue.toFixed(2)} KES`,
        notes: `Points redemption - ${pointsToRedeem.toFixed(2)} points`,
        createdBy: createdBy,
      };

      const accountLedgerEntity = this.keyAccountLedgerRepository.create(accountLedgerRow);
      await queryRunner.manager.save(KeyAccountLedger, accountLedgerEntity);

      await queryRunner.commitTransaction();
      
      console.log(`✅ [LoyaltyPointsLedgerService] Redeemed ${pointsToRedeem} points (${cashValue.toFixed(2)} KES) for key account ${keyAccountId}`);
      console.log(`✅ [LoyaltyPointsLedgerService] Created key account ledger entry - balance: ${previousBalance} → ${newAccountBalance}`);
      
      return pointsLedgerEntity as LoyaltyPointsLedger;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(`❌ [LoyaltyPointsLedgerService] Error redeeming points:`, error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

