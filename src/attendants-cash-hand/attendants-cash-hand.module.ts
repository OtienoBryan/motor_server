import { Module } from '@nestjs/common';
import { AttendantsCashHandController } from './attendants-cash-hand.controller';
import { AttendantsCashHandService } from './attendants-cash-hand.service';

@Module({
  controllers: [AttendantsCashHandController],
  providers: [AttendantsCashHandService],
  exports: [AttendantsCashHandService],
})
export class AttendantsCashHandModule {}
