import { Repository } from 'typeorm';
import { CustomerCard } from '../entities/customer-card.entity';
export declare class CustomerCardsService {
    private readonly customerCardRepository;
    constructor(customerCardRepository: Repository<CustomerCard>);
    findAll(): Promise<CustomerCard[]>;
}
