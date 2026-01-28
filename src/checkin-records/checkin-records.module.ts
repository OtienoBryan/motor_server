import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckinRecordsController } from './checkin-records.controller';
import { CheckinRecordsService } from './checkin-records.service';
import { CheckinRecord } from '../entities/checkin-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckinRecord])],
  controllers: [CheckinRecordsController],
  providers: [CheckinRecordsService],
  exports: [CheckinRecordsService],
})
export class CheckinRecordsModule {}
