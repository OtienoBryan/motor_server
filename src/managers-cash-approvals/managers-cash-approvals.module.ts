import { Module } from '@nestjs/common';
import { ManagersCashApprovalsController } from './managers-cash-approvals.controller';
import { ManagersCashApprovalsService } from './managers-cash-approvals.service';

@Module({
  controllers: [ManagersCashApprovalsController],
  providers: [ManagersCashApprovalsService],
  exports: [ManagersCashApprovalsService],
})
export class ManagersCashApprovalsModule {}
