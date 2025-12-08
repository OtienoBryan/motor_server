import { Repository } from 'typeorm';
import { Passenger } from '../entities/passenger.entity';
export interface CreatePassengerDto {
    name: string;
    email?: string | null;
    contact?: string | null;
    nationality?: string | null;
    identification?: string | null;
    age?: number | null;
    title?: string | null;
}
export declare class PassengersService {
    private passengerRepository;
    constructor(passengerRepository: Repository<Passenger>);
    create(createPassengerDto: CreatePassengerDto): Promise<Passenger>;
    private generatePNR;
}
