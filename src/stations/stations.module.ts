import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';
import { Station } from '../entities/station.entity';
import { Region } from '../entities/region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Station, Region])],
  controllers: [StationsController],
  providers: [StationsService],
  exports: [StationsService],
})
export class StationsModule {}

