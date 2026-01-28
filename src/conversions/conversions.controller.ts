import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Body, 
  Param, 
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { ConversionsService } from './conversions.service';
import { Conversion } from '../entities/conversion.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateConversionDto } from './dto/create-conversion.dto';

@Controller('conversions')
@UseGuards(JwtAuthGuard)
export class ConversionsController {
  constructor(private readonly conversionsService: ConversionsService) {}

  @Post()
  async create(@Body() createDto: CreateConversionDto): Promise<Conversion> {
    console.log('🔧 [ConversionsController] POST /conversions');
    console.log('🔧 [ConversionsController] Request body:', JSON.stringify(createDto, null, 2));
    try {
      const result = await this.conversionsService.create(createDto);
      console.log('✅ [ConversionsController] Conversion created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [ConversionsController] Error creating conversion:', error);
      console.error('❌ [ConversionsController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Conversion[]> {
    console.log('🔧 [ConversionsController] GET /conversions');
    try {
      const result = await this.conversionsService.findAll();
      console.log(`✅ [ConversionsController] Successfully retrieved ${result.length} conversions`);
      return result;
    } catch (error) {
      console.error('❌ [ConversionsController] Error fetching conversions:', error);
      console.error('❌ [ConversionsController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('❌ [ConversionsController] Error code:', (error as any)?.code);
      console.error('❌ [ConversionsController] Error message:', error instanceof Error ? error.message : String(error));
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`Failed to fetch conversions: ${error.message}`);
      }
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Conversion> {
    console.log(`🔧 [ConversionsController] GET /conversions/${id}`);
    return this.conversionsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: Partial<Conversion>
  ): Promise<Conversion> {
    console.log(`🔧 [ConversionsController] PUT /conversions/${id}`);
    console.log('🔧 [ConversionsController] Update data:', JSON.stringify(updateDto, null, 2));
    try {
      const result = await this.conversionsService.update(id, updateDto);
      console.log('✅ [ConversionsController] Conversion updated successfully');
      return result;
    } catch (error) {
      console.error('❌ [ConversionsController] Error updating conversion:', error);
      throw error;
    }
  }
}

