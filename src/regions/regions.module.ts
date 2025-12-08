import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { Region } from '../entities/region.entity';
import { Country } from '../entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region, Country])],
  controllers: [RegionsController],
  providers: [RegionsService],
  exports: [RegionsService],
})
export class RegionsModule {}

