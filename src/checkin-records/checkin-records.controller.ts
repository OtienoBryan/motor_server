import { Controller, Get, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CheckinRecordsService } from './checkin-records.service';
import { CheckinRecord } from '../entities/checkin-record.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('checkin-records')
@UseGuards(JwtAuthGuard)
export class CheckinRecordsController {
  constructor(private readonly checkinRecordsService: CheckinRecordsService) {}

  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('stationId') stationId?: string,
  ): Promise<CheckinRecord[]> {
    console.log('📋 [CheckinRecordsController] GET /checkin-records', {
      startDate,
      endDate,
      userId,
      stationId
    });

    return this.checkinRecordsService.findAll(
      startDate,
      endDate,
      userId ? parseInt(userId, 10) : undefined,
      stationId ? parseInt(stationId, 10) : undefined
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CheckinRecord | null> {
    console.log(`📋 [CheckinRecordsController] GET /checkin-records/${id}`);
    return this.checkinRecordsService.findOne(id);
  }
}
