import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from '../entities/station.entity';
import { Region } from '../entities/region.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  async findAll(): Promise<Station[]> {
    console.log('🚉 [StationsService] Finding all stations');
    
    const stations = await this.stationRepository.find({
      relations: ['region'],
      order: { name: 'ASC' },
    });
    
    console.log(`✅ [StationsService] Found ${stations.length} stations`);
    return stations;
  }

  async findOne(id: number): Promise<Station> {
    console.log(`🚉 [StationsService] Finding station by ID: ${id}`);
    
    const station = await this.stationRepository.findOne({
      where: { id },
      relations: ['region']
    });
    
    if (!station) {
      console.log(`❌ [StationsService] Station with ID ${id} not found`);
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    
    console.log(`✅ [StationsService] Station found: ${station.name}`);
    return station;
  }

  async create(createStationDto: CreateStationDto): Promise<Station> {
    console.log('🚉 [StationsService] Creating new station:', createStationDto.name);
    console.log('🚉 [StationsService] DTO data:', JSON.stringify(createStationDto, null, 2));
    
    // Verify region exists
    const region = await this.regionRepository.findOne({
      where: { id: createStationDto.regionId }
    });
    
    if (!region) {
      throw new NotFoundException(`Region with ID ${createStationDto.regionId} not found`);
    }
    
    try {
      const station = this.stationRepository.create({
        name: createStationDto.name,
        regionId: createStationDto.regionId,
        contact: createStationDto.contact || null,
      });
      
      const savedStation = await this.stationRepository.save(station);
      console.log(`✅ [StationsService] Station created with ID: ${savedStation.id}`);
      
      // Reload with region relation
      const stationWithRelations = await this.stationRepository.findOne({
        where: { id: savedStation.id },
        relations: ['region']
      });
      
      if (stationWithRelations) {
        return stationWithRelations;
      }
      return savedStation;
    } catch (error) {
      console.error('❌ [StationsService] Error creating station:', error);
      throw error;
    }
  }

  async update(id: number, updateStationDto: UpdateStationDto): Promise<Station> {
    console.log(`🚉 [StationsService] Updating station with ID: ${id}`);
    console.log('🚉 [StationsService] Update data:', JSON.stringify(updateStationDto, null, 2));
    
    const station = await this.stationRepository.findOne({ where: { id } });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    
    // If regionId is being updated, verify the region exists
    if (updateStationDto.regionId !== undefined) {
      const region = await this.regionRepository.findOne({
        where: { id: updateStationDto.regionId }
      });
      
      if (!region) {
        throw new NotFoundException(`Region with ID ${updateStationDto.regionId} not found`);
      }
    }
    
    Object.assign(station, updateStationDto);
    const updatedStation = await this.stationRepository.save(station);
    console.log(`✅ [StationsService] Station updated: ${updatedStation.name}`);
    
    // Reload with region relation
    const stationWithRelations = await this.stationRepository.findOne({
      where: { id: updatedStation.id },
      relations: ['region']
    });
    
    if (stationWithRelations) {
      return stationWithRelations;
    }
    return updatedStation;
  }

  async remove(id: number): Promise<void> {
    console.log(`🚉 [StationsService] Deleting station with ID: ${id}`);
    
    const station = await this.stationRepository.findOne({ where: { id } });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    
    await this.stationRepository.remove(station);
    console.log(`✅ [StationsService] Station deleted: ${station.name}`);
  }
}

