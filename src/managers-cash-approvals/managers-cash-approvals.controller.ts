import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CashAccountLedgerRow,
  CashAccountRow,
  ManagerCashApprovalRow,
  ManagersCashApprovalsService,
} from './managers-cash-approvals.service';

@Controller('managers-cash-approvals')
@UseGuards(JwtAuthGuard)
export class ManagersCashApprovalsController {
  constructor(private readonly managersCashApprovalsService: ManagersCashApprovalsService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('destination') destination?: string,
    @Query('managerId') managerId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ManagerCashApprovalRow[]> {
    return this.managersCashApprovalsService.findAll(
      status,
      destination,
      managerId ? parseInt(managerId, 10) : undefined,
      startDate,
      endDate,
    );
  }

  @Get('accounts')
  async getAccounts(): Promise<CashAccountRow[]> {
    return this.managersCashApprovalsService.getCashAccounts();
  }

  @Get('accounts/ledger')
  async getAccountsLedger(
    @Query('accountName') accountName?: string,
    @Query('entryType') entryType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<CashAccountLedgerRow[]> {
    return this.managersCashApprovalsService.getCashAccountLedger(
      accountName,
      entryType,
      startDate,
      endDate,
    );
  }

  @Patch(':id/approve')
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() body?: { approvedBy?: number },
  ): Promise<{ message: string }> {
    await this.managersCashApprovalsService.approveSubmission(id, body?.approvedBy);
    return { message: 'Submission approved successfully' };
  }

  @Patch(':id/reject')
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { rejectionReason: string; approvedBy?: number },
  ): Promise<{ message: string }> {
    await this.managersCashApprovalsService.rejectSubmission(
      id,
      body?.rejectionReason || 'Rejected',
      body?.approvedBy,
    );
    return { message: 'Submission rejected successfully' };
  }
}
