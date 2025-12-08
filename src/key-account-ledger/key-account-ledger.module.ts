import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyAccountLedgerController } from './key-account-ledger.controller';
import { KeyAccountLedgerService } from './key-account-ledger.service';
import { KeyAccountLedger } from '../entities/key-account-ledger.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { Station } from '../entities/station.entity';
import { Vehicle } from '../entities/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeyAccountLedger, KeyAccount, Station, Vehicle]),
  ],
  controllers: [KeyAccountLedgerController],
  providers: [KeyAccountLedgerService],
  exports: [KeyAccountLedgerService],
})
export class KeyAccountLedgerModule {}

