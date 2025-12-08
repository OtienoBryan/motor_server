import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelPricesService } from './fuel-prices.service';
import { FuelPricesController } from './fuel-prices.controller';
import { FuelPrice } from '../entities/fuel-price.entity';
import { Station } from '../entities/station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FuelPrice, Station])],
  controllers: [FuelPricesController],
  providers: [FuelPricesService],
  exports: [FuelPricesService],
})
export class FuelPricesModule {}

