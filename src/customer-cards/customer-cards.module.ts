import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerCard } from '../entities/customer-card.entity';
import { CustomerCardsService } from './customer-cards.service';
import { CustomerCardsController } from './customer-cards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerCard])],
  controllers: [CustomerCardsController],
  providers: [CustomerCardsService],
  exports: [CustomerCardsService],
})
export class CustomerCardsModule {}
