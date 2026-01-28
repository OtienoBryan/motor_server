import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyAccountsService } from './key-accounts.service';
import { KeyAccountsController } from './key-accounts.controller';
import { KeyAccount } from '../entities/key-account.entity';
import { KeyAccountLedgerModule } from '../key-account-ledger/key-account-ledger.module';
import { KeyAccountFuelPricesModule } from '../key-account-fuel-prices/key-account-fuel-prices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeyAccount]),
    KeyAccountLedgerModule,
    forwardRef(() => KeyAccountFuelPricesModule)
  ],
  controllers: [KeyAccountsController],
  providers: [KeyAccountsService],
  exports: [KeyAccountsService],
})
export class KeyAccountsModule {}

