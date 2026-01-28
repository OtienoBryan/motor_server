import { Controller, Get, Post, Query, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LoyaltyPointsLedgerService } from './loyalty-points-ledger.service';
import { LoyaltyPointsLedger } from '../entities/loyalty-points-ledger.entity';

@Controller('loyalty-points-ledger')
@UseGuards(JwtAuthGuard)
export class LoyaltyPointsLedgerController {
  constructor(private readonly loyaltyPointsLedgerService: LoyaltyPointsLedgerService) {}

  @Get()
  async findAll(@Query('keyAccountId') keyAccountId?: string): Promise<LoyaltyPointsLedger[]> {
    const accountId = keyAccountId ? parseInt(keyAccountId, 10) : undefined;
    return this.loyaltyPointsLedgerService.findAll(accountId);
  }

  @Post('redeem/:keyAccountId')
  async redeemPoints(
    @Param('keyAccountId', ParseIntPipe) keyAccountId: number,
    @Body() body: { points: number; stationId: number; referenceNumber?: string; createdBy?: number }
  ): Promise<LoyaltyPointsLedger> {
    console.log(`🎁 [LoyaltyPointsLedgerController] POST /loyalty-points-ledger/redeem/${keyAccountId}`);
    console.log(`🎁 [LoyaltyPointsLedgerController] Request body:`, JSON.stringify(body, null, 2));
    return this.loyaltyPointsLedgerService.redeemPoints(
      keyAccountId,
      body.points,
      body.stationId,
      body.referenceNumber,
      body.createdBy
    );
  }
}

