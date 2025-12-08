import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(KeyAccount)
    private keyAccountRepository: Repository<KeyAccount>,
  ) {}

  async findByKeyAccount(keyAccountId: number): Promise<Vehicle[]> {
    console.log(`🚗 [VehiclesService] Finding vehicles for key account: ${keyAccountId}`);
    
    const vehicles = await this.vehicleRepository.find({
      where: { key_account_id: keyAccountId },
      order: { created_at: 'DESC' },
    });
    
    console.log(`✅ [VehiclesService] Found ${vehicles.length} vehicles`);
    return vehicles;
  }

  async findOne(id: number): Promise<Vehicle> {
    console.log(`🚗 [VehiclesService] Finding vehicle by ID: ${id}`);
    
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['keyAccount'],
    });
    
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    
    return vehicle;
  }

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    console.log('🚗 [VehiclesService] Creating new vehicle:', createVehicleDto.registration_number);
    
    // Verify key account exists
    const keyAccount = await this.keyAccountRepository.findOne({
      where: { id: createVehicleDto.key_account_id },
    });
    
    if (!keyAccount) {
      throw new NotFoundException(`Key account with ID ${createVehicleDto.key_account_id} not found`);
    }
    
    // Check if registration number already exists for this account
    const existingVehicle = await this.vehicleRepository.findOne({
      where: {
        key_account_id: createVehicleDto.key_account_id,
        registration_number: createVehicleDto.registration_number,
      },
    });
    
    if (existingVehicle) {
      throw new Error(`Registration number ${createVehicleDto.registration_number} already exists for this account`);
    }
    
    try {
      const vehicle = this.vehicleRepository.create({
        key_account_id: createVehicleDto.key_account_id,
        registration_number: createVehicleDto.registration_number,
        model: createVehicleDto.model,
        driver_name: createVehicleDto.driver_name,
        driver_contact: createVehicleDto.driver_contact,
      });
      
      const savedVehicle = await this.vehicleRepository.save(vehicle);
      console.log(`✅ [VehiclesService] Vehicle created with ID: ${savedVehicle.id}`);
      
      return savedVehicle;
    } catch (error) {
      console.error('❌ [VehiclesService] Error creating vehicle:', error);
      throw error;
    }
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    console.log(`🚗 [VehiclesService] Updating vehicle with ID: ${id}`);
    
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    
    // If registration number is being updated, check for duplicates
    if (updateVehicleDto.registration_number && updateVehicleDto.registration_number !== vehicle.registration_number) {
      const existingVehicle = await this.vehicleRepository.findOne({
        where: {
          key_account_id: vehicle.key_account_id,
          registration_number: updateVehicleDto.registration_number,
        },
      });
      
      if (existingVehicle) {
        throw new Error(`Registration number ${updateVehicleDto.registration_number} already exists for this account`);
      }
    }
    
    Object.assign(vehicle, updateVehicleDto);
    const updatedVehicle = await this.vehicleRepository.save(vehicle);
    console.log(`✅ [VehiclesService] Vehicle updated: ${updatedVehicle.registration_number}`);
    
    return updatedVehicle;
  }

  async remove(id: number): Promise<void> {
    console.log(`🚗 [VehiclesService] Deleting vehicle with ID: ${id}`);
    
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    
    await this.vehicleRepository.remove(vehicle);
    console.log(`✅ [VehiclesService] Vehicle deleted: ${vehicle.registration_number}`);
  }
}

