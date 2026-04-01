import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerCardsService } from './customer-cards.service';
import { CustomerCard } from '../entities/customer-card.entity';

@Controller('customer-cards')
@UseGuards(JwtAuthGuard)
export class CustomerCardsController {
  constructor(private readonly customerCardsService: CustomerCardsService) {}

  @Get()
  async findAll(): Promise<CustomerCard[]> {
    return this.customerCardsService.findAll();
  }
}
