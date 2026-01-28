import { Controller, Get, Query, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LoginHistoryService } from './login-history.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('login-history')
@UseGuards(JwtAuthGuard)
export class LoginHistoryController {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
  ) {
    console.log('📋 [LoginHistoryController] GET /login-history');
    const userIdNum = userId ? parseInt(userId, 10) : undefined;
    return this.loginHistoryService.findAll(startDate, endDate, userIdNum);
  }

  @Get('user/:userId')
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    console.log(`📋 [LoginHistoryController] GET /login-history/user/${userId}`);
    return this.loginHistoryService.findByUserId(userId, startDate, endDate);
  }
}
