import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerCard } from '../entities/customer-card.entity';

@Injectable()
export class CustomerCardsService {
  constructor(
    @InjectRepository(CustomerCard)
    private readonly customerCardRepository: Repository<CustomerCard>,
  ) {}

  async findAll(): Promise<CustomerCard[]> {
    return this.customerCardRepository.find({
      order: { id: 'DESC' },
    });
  }
}
