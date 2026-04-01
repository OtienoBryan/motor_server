import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VisibilityReportsService, VisibilityReportRow } from './visibility-reports.service';

@Controller('visibility-reports')
@UseGuards(JwtAuthGuard)
export class VisibilityReportsController {
  constructor(private readonly visibilityReportsService: VisibilityReportsService) {}

  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('stationId') stationId?: string,
    @Query('userId') userId?: string,
  ): Promise<VisibilityReportRow[]> {
    console.log('📋 [VisibilityReportsController] GET /visibility-reports', {
      startDate,
      endDate,
      stationId,
      userId,
    });

    return this.visibilityReportsService.findAll(
      startDate,
      endDate,
      stationId ? parseInt(stationId, 10) : undefined,
      userId ? parseInt(userId, 10) : undefined,
    );
  }
}
