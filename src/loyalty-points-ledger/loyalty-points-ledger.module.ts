import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyPointsLedger } from '../entities/loyalty-points-ledger.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { KeyAccountLedger } from '../entities/key-account-ledger.entity';
import { Station } from '../entities/station.entity';
import { LoyaltyPointsLedgerController } from './loyalty-points-ledger.controller';
import { LoyaltyPointsLedgerService } from './loyalty-points-ledger.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoyaltyPointsLedger, KeyAccount, KeyAccountLedger, Station])],
  controllers: [LoyaltyPointsLedgerController],
  providers: [LoyaltyPointsLedgerService],
  exports: [LoyaltyPointsLedgerService],
})
export class LoyaltyPointsLedgerModule {}

