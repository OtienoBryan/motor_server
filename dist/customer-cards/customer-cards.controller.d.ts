import { CustomerCardsService } from './customer-cards.service';
import { CustomerCard } from '../entities/customer-card.entity';
export declare class CustomerCardsController {
    private readonly customerCardsService;
    constructor(customerCardsService: CustomerCardsService);
    findAll(): Promise<CustomerCard[]>;
}
