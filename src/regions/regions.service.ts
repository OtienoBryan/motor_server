import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '../entities/region.entity';
import { Country } from '../entities/country.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Region[]> {
    console.log('🌍 [RegionsService] Finding all regions');
    
    const regions = await this.regionRepository.find({
      relations: ['country'],
      order: { name: 'ASC' },
    });
    
    console.log(`✅ [RegionsService] Found ${regions.length} regions`);
    return regions;
  }

  async findOne(id: number): Promise<Region> {
    console.log(`🌍 [RegionsService] Finding region by ID: ${id}`);
    
    const region = await this.regionRepository.findOne({
      where: { id },
      relations: ['country']
    });
    
    if (!region) {
      console.log(`❌ [RegionsService] Region with ID ${id} not found`);
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
    
    console.log(`✅ [RegionsService] Region found: ${region.name}`);
    return region;
  }

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    console.log('🌍 [RegionsService] Creating new region:', createRegionDto.name);
    console.log('🌍 [RegionsService] DTO data:', JSON.stringify(createRegionDto, null, 2));
    
    // Verify country exists
    const country = await this.countryRepository.findOne({
      where: { id: createRegionDto.countryId }
    });
    
    if (!country) {
      throw new NotFoundException(`Country with ID ${createRegionDto.countryId} not found`);
    }
    
    try {
      const region = this.regionRepository.create({
        name: createRegionDto.name,
        countryId: createRegionDto.countryId,
        status: createRegionDto.status ?? 1,
      });
      
      const savedRegion = await this.regionRepository.save(region);
      console.log(`✅ [RegionsService] Region created with ID: ${savedRegion.id}`);
      
      // Reload with country relation
      const regionWithRelations = await this.regionRepository.findOne({
        where: { id: savedRegion.id },
        relations: ['country']
      });
      
      if (regionWithRelations) {
        return regionWithRelations;
      }
      return savedRegion;
    } catch (error) {
      console.error('❌ [RegionsService] Error creating region:', error);
      throw error;
    }
  }

  async update(id: number, updateRegionDto: UpdateRegionDto): Promise<Region> {
    console.log(`🌍 [RegionsService] Updating region with ID: ${id}`);
    console.log('🌍 [RegionsService] Update data:', JSON.stringify(updateRegionDto, null, 2));
    
    const region = await this.regionRepository.findOne({ where: { id } });
    
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
    
    // If countryId is being updated, verify the country exists
    if (updateRegionDto.countryId !== undefined) {
      const country = await this.countryRepository.findOne({
        where: { id: updateRegionDto.countryId }
      });
      
      if (!country) {
        throw new NotFoundException(`Country with ID ${updateRegionDto.countryId} not found`);
      }
    }
    
    Object.assign(region, updateRegionDto);
    const updatedRegion = await this.regionRepository.save(region);
    console.log(`✅ [RegionsService] Region updated: ${updatedRegion.name}`);
    
    // Reload with country relation
    const regionWithRelations = await this.regionRepository.findOne({
      where: { id: updatedRegion.id },
      relations: ['country']
    });
    
    if (regionWithRelations) {
      return regionWithRelations;
    }
    return updatedRegion;
  }

  async remove(id: number): Promise<void> {
    console.log(`🌍 [RegionsService] Deleting region with ID: ${id}`);
    
    const region = await this.regionRepository.findOne({ where: { id } });
    
    if (!region) {
      throw new NotFoundException(`Region with ID ${id} not found`);
    }
    
    await this.regionRepository.remove(region);
    console.log(`✅ [RegionsService] Region deleted: ${region.name}`);
  }
}

