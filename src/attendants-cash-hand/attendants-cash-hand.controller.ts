import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AttendantsCashHandService,
  AttendantCashLedgerRow,
  AttendantCashSummaryRow,
} from './attendants-cash-hand.service';

@Controller('attendants-cash-hand')
@UseGuards(JwtAuthGuard)
export class AttendantsCashHandController {
  constructor(private readonly attendantsCashHandService: AttendantsCashHandService) {}

  @Get()
  async getSummary(): Promise<AttendantCashSummaryRow[]> {
    return this.attendantsCashHandService.getSummary();
  }

  @Get(':attendantId/ledger')
  async getLedger(
    @Param('attendantId', ParseIntPipe) attendantId: number,
  ): Promise<AttendantCashLedgerRow[]> {
    return this.attendantsCashHandService.getLedger(attendantId);
  }
}
