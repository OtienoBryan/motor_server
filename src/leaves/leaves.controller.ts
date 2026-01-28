import { Controller, Get, Put, Query, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { StaffLeave } from '../entities/staff-leave.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leaves')
@UseGuards(JwtAuthGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Get()
  async findAll(
    @Query('staffId') staffId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<StaffLeave[]> {
    console.log('🏖️ [LeavesController] GET /leaves', {
      staffId,
      status,
      startDate,
      endDate
    });

    return this.leavesService.findAll(
      staffId ? parseInt(staffId, 10) : undefined,
      status,
      startDate,
      endDate
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StaffLeave | null> {
    console.log(`🏖️ [LeavesController] GET /leaves/${id}`);
    return this.leavesService.findOne(id);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: 'approved' | 'rejected' | 'cancelled', approvedBy?: number }
  ): Promise<StaffLeave> {
    console.log(`🏖️ [LeavesController] PUT /leaves/${id}/status`, body);
    return this.leavesService.updateStatus(id, body.status, body.approvedBy);
  }
}
