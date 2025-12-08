import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelPrice } from '../entities/fuel-price.entity';
import { Station } from '../entities/station.entity';
import { CreateFuelPriceDto } from './dto/create-fuel-price.dto';
import { UpdateFuelPriceDto } from './dto/update-fuel-price.dto';

@Injectable()
export class FuelPricesService {
  constructor(
    @InjectRepository(FuelPrice)
    private fuelPriceRepository: Repository<FuelPrice>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async create(createFuelPriceDto: CreateFuelPriceDto): Promise<FuelPrice> {
    console.log('⛽ [FuelPricesService] Creating new fuel price for station:', createFuelPriceDto.stationId);
    
    // Verify station exists
    const station = await this.stationRepository.findOne({
      where: { id: createFuelPriceDto.stationId }
    });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${createFuelPriceDto.stationId} not found`);
    }
    
    try {
      const fuelPrice = this.fuelPriceRepository.create({
        stationId: createFuelPriceDto.stationId,
        price: createFuelPriceDto.price,
        fuelType: createFuelPriceDto.fuelType || null,
        notes: createFuelPriceDto.notes || null,
      });
      
      const savedFuelPrice = await this.fuelPriceRepository.save(fuelPrice);
      console.log(`✅ [FuelPricesService] Fuel price created with ID: ${savedFuelPrice.id}`);
      
      // Update station's current price
      station.price = createFuelPriceDto.price;
      await this.stationRepository.save(station);
      console.log(`✅ [FuelPricesService] Updated station ${station.id} price to ${createFuelPriceDto.price}`);
      
      // Reload with station relation
      const fuelPriceWithRelations = await this.fuelPriceRepository.findOne({
        where: { id: savedFuelPrice.id },
        relations: ['station']
      });
      
      if (fuelPriceWithRelations) {
        return fuelPriceWithRelations;
      }
      return savedFuelPrice;
    } catch (error) {
      console.error('❌ [FuelPricesService] Error creating fuel price:', error);
      throw error;
    }
  }

  async findByStation(stationId: number): Promise<FuelPrice[]> {
    console.log(`⛽ [FuelPricesService] Finding fuel prices for station: ${stationId}`);
    
    const fuelPrices = await this.fuelPriceRepository.find({
      where: { stationId },
      relations: ['station'],
      order: { created_at: 'DESC' },
    });
    
    console.log(`✅ [FuelPricesService] Found ${fuelPrices.length} fuel prices`);
    return fuelPrices;
  }

  async findLatestByStation(stationId: number): Promise<FuelPrice | null> {
    console.log(`⛽ [FuelPricesService] Finding latest fuel price for station: ${stationId}`);
    
    const fuelPrice = await this.fuelPriceRepository.findOne({
      where: { stationId },
      relations: ['station'],
      order: { created_at: 'DESC' },
    });
    
    return fuelPrice;
  }

  async findOne(id: number): Promise<FuelPrice> {
    console.log(`⛽ [FuelPricesService] Finding fuel price by ID: ${id}`);
    
    const fuelPrice = await this.fuelPriceRepository.findOne({
      where: { id },
      relations: ['station']
    });
    
    if (!fuelPrice) {
      console.log(`❌ [FuelPricesService] Fuel price with ID ${id} not found`);
      throw new NotFoundException(`Fuel price with ID ${id} not found`);
    }
    
    console.log(`✅ [FuelPricesService] Fuel price found: ${fuelPrice.id}`);
    return fuelPrice;
  }

  async update(id: number, updateFuelPriceDto: UpdateFuelPriceDto): Promise<FuelPrice> {
    console.log(`⛽ [FuelPricesService] Updating fuel price with ID: ${id}`);
    console.log('⛽ [FuelPricesService] Update data:', JSON.stringify(updateFuelPriceDto, null, 2));
    
    const fuelPrice = await this.fuelPriceRepository.findOne({ 
      where: { id },
      relations: ['station']
    });
    
    if (!fuelPrice) {
      throw new NotFoundException(`Fuel price with ID ${id} not found`);
    }
    
    Object.assign(fuelPrice, updateFuelPriceDto);
    const updatedFuelPrice = await this.fuelPriceRepository.save(fuelPrice);
    console.log(`✅ [FuelPricesService] Fuel price updated: ${updatedFuelPrice.id}`);
    
    // If price was updated, update station's current price if this is the latest price
    if (updateFuelPriceDto.price !== undefined) {
      const latestPrice = await this.findLatestByStation(fuelPrice.stationId);
      if (latestPrice && latestPrice.id === id) {
        const station = await this.stationRepository.findOne({
          where: { id: fuelPrice.stationId }
        });
        if (station) {
          station.price = updateFuelPriceDto.price;
          await this.stationRepository.save(station);
          console.log(`✅ [FuelPricesService] Updated station ${station.id} price to ${updateFuelPriceDto.price}`);
        }
      }
    }
    
    // Reload with station relation
    const fuelPriceWithRelations = await this.fuelPriceRepository.findOne({
      where: { id: updatedFuelPrice.id },
      relations: ['station']
    });
    
    if (fuelPriceWithRelations) {
      return fuelPriceWithRelations;
    }
    return updatedFuelPrice;
  }

  async remove(id: number): Promise<void> {
    console.log(`⛽ [FuelPricesService] Deleting fuel price with ID: ${id}`);
    
    const fuelPrice = await this.fuelPriceRepository.findOne({ 
      where: { id },
      relations: ['station']
    });
    
    if (!fuelPrice) {
      throw new NotFoundException(`Fuel price with ID ${id} not found`);
    }
    
    const stationId = fuelPrice.stationId;
    await this.fuelPriceRepository.remove(fuelPrice);
    console.log(`✅ [FuelPricesService] Fuel price deleted: ${fuelPrice.id}`);
    
    // Update station's current price to the latest remaining price
    const latestPrice = await this.findLatestByStation(stationId);
    const station = await this.stationRepository.findOne({
      where: { id: stationId }
    });
    if (station) {
      station.price = latestPrice ? latestPrice.price : null;
      await this.stationRepository.save(station);
      console.log(`✅ [FuelPricesService] Updated station ${station.id} price to ${latestPrice ? latestPrice.price : 'null'}`);
    }
  }
}

