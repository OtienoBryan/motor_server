import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
  ) {}

  async create(createPassengerDto: CreatePassengerDto): Promise<Passenger> {
    console.log('👤 [PassengersService] Creating new passenger:', createPassengerDto.name);
    
    // Generate unique PNR (10 characters)
    let pnr: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      pnr = this.generatePNR();
      const existing = await this.passengerRepository.findOne({
        where: { pnr }
      });
      
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique PNR after multiple attempts');
    }

    const passenger = this.passengerRepository.create({
      pnr: pnr!,
      name: createPassengerDto.name,
      email: createPassengerDto.email || null,
      contact: createPassengerDto.contact || null,
      nationality: createPassengerDto.nationality || null,
      identification: createPassengerDto.identification || null,
      age: createPassengerDto.age || null,
      title: createPassengerDto.title || null,
    });

    const savedPassenger = await this.passengerRepository.save(passenger);
    console.log(`✅ [PassengersService] Passenger created with ID: ${savedPassenger.id}, PNR: ${savedPassenger.pnr}`);
    
    return savedPassenger;
  }

  private generatePNR(): string {
    // Generate 10-character PNR: 6 random alphanumeric + 4 random numbers
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const numbers = '0123456789';
    
    let pnr = '';
    // First 6 characters: alphanumeric
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Last 4 characters: numbers
    for (let i = 0; i < 4; i++) {
      pnr += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return pnr;
  }
}

