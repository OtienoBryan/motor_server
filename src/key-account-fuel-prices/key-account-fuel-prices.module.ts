import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyAccountFuelPricesService } from './key-account-fuel-prices.service';
import { KeyAccountFuelPricesController } from './key-account-fuel-prices.controller';
import { KeyAccountFuelPrice } from '../entities/key-account-fuel-price.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { Staff } from '../entities/staff.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeyAccountFuelPrice, KeyAccount, Staff]),
  ],
  controllers: [KeyAccountFuelPricesController],
  providers: [KeyAccountFuelPricesService],
  exports: [KeyAccountFuelPricesService],
})
export class KeyAccountFuelPricesModule {}
