import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { Station } from '../entities/station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryLedger, Station])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}

