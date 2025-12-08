import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { RegionsService } from './regions.service';
import { Region } from '../entities/region.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Controller('regions')
@UseGuards(JwtAuthGuard)
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  async findAll(): Promise<Region[]> {
    console.log('🌍 [RegionsController] GET /regions');
    return this.regionsService.findAll();
  }

  @Post()
  async create(@Body() createRegionDto: CreateRegionDto): Promise<Region> {
    console.log('🌍 [RegionsController] POST /regions');
    console.log('🌍 [RegionsController] Create region data:', JSON.stringify(createRegionDto, null, 2));
    try {
      const result = await this.regionsService.create(createRegionDto);
      console.log('✅ [RegionsController] Region created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [RegionsController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRegionDto: UpdateRegionDto
  ): Promise<Region> {
    console.log(`🌍 [RegionsController] PUT /regions/${id}`);
    console.log('🌍 [RegionsController] Update region data:', updateRegionDto);
    return this.regionsService.update(id, updateRegionDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🌍 [RegionsController] DELETE /regions/${id}`);
    await this.regionsService.remove(id);
    return { message: 'Region deleted successfully' };
  }
}

