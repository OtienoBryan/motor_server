import { Module } from '@nestjs/common';
import { VisibilityReportsController } from './visibility-reports.controller';
import { VisibilityReportsService } from './visibility-reports.service';

@Module({
  controllers: [VisibilityReportsController],
  providers: [VisibilityReportsService],
  exports: [VisibilityReportsService],
})
export class VisibilityReportsModule {}
