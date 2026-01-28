import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversion } from '../entities/conversion.entity';
import { CreateConversionDto } from './dto/create-conversion.dto';

@Injectable()
export class ConversionsService {
  constructor(
    @InjectRepository(Conversion)
    private conversionRepository: Repository<Conversion>,
  ) {}

  async create(createDto: CreateConversionDto): Promise<Conversion> {
    console.log('🔧 [ConversionsService] Creating conversion');
    console.log('🔧 [ConversionsService] Request data:', JSON.stringify(createDto, null, 2));
    
    // Validate that either nationalId or passportId is provided
    if (!createDto.nationalId && !createDto.passportId) {
      throw new Error('Either National ID or Passport ID must be provided');
    }

    const conversionData = {
      ...createDto,
      status: 'pending' as const, // Ensure status is set to pending by default
    };
    const conversion = this.conversionRepository.create(conversionData);
    const savedConversion = await this.conversionRepository.save(conversion);
    
    console.log(`✅ [ConversionsService] Conversion created with ID: ${savedConversion.id}`);
    return savedConversion;
  }

  async findAll(): Promise<Conversion[]> {
    console.log('🔧 [ConversionsService] Finding all conversions');
    
    try {
      const conversions = await this.conversionRepository.find({
        order: { createdAt: 'DESC' },
      });
      
      console.log(`✅ [ConversionsService] Found ${conversions.length} conversions`);
      return conversions;
    } catch (error) {
      console.error('❌ [ConversionsService] Error finding conversions:', error);
      console.error('❌ [ConversionsService] Error code:', (error as any)?.code);
      console.error('❌ [ConversionsService] Error message:', error instanceof Error ? error.message : String(error));
      console.error('❌ [ConversionsService] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Handle specific connection errors
      if ((error as any)?.code === 'ECONNRESET' || (error as any)?.code === 'PROTOCOL_CONNECTION_LOST') {
        const connectionError = new Error('Database connection was lost. Please refresh and try again.');
        (connectionError as any).code = (error as any)?.code;
        throw connectionError;
      }
      
      throw error;
    }
  }

  async findOne(id: number): Promise<Conversion> {
    console.log(`🔧 [ConversionsService] Finding conversion by ID: ${id}`);
    
    const conversion = await this.conversionRepository.findOne({
      where: { id },
    });
    
    if (!conversion) {
      throw new Error(`Conversion with ID ${id} not found`);
    }
    
    console.log(`✅ [ConversionsService] Conversion found`);
    return conversion;
  }

  async update(id: number, updateDto: Partial<Conversion>): Promise<Conversion> {
    console.log(`🔧 [ConversionsService] Updating conversion ID: ${id}`);
    
    const conversion = await this.conversionRepository.findOne({
      where: { id },
    });
    
    if (!conversion) {
      throw new Error(`Conversion with ID ${id} not found`);
    }

    // Update fields
    Object.assign(conversion, updateDto);
    const updatedConversion = await this.conversionRepository.save(conversion);
    
    console.log(`✅ [ConversionsService] Conversion updated`);
    return updatedConversion;
  }
}

