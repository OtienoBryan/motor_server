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
import { StationsService } from './stations.service';
import { Station } from '../entities/station.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Controller('stations')
@UseGuards(JwtAuthGuard)
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  async findAll(): Promise<Station[]> {
    console.log('🚉 [StationsController] GET /stations');
    return this.stationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Station> {
    console.log(`🚉 [StationsController] GET /stations/${id}`);
    return this.stationsService.findOne(id);
  }

  @Post()
  async create(@Body() createStationDto: CreateStationDto): Promise<Station> {
    console.log('🚉 [StationsController] POST /stations');
    console.log('🚉 [StationsController] Create station data:', JSON.stringify(createStationDto, null, 2));
    try {
      const result = await this.stationsService.create(createStationDto);
      console.log('✅ [StationsController] Station created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [StationsController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStationDto: UpdateStationDto
  ): Promise<Station> {
    console.log(`🚉 [StationsController] PUT /stations/${id}`);
    console.log('🚉 [StationsController] Update station data:', updateStationDto);
    return this.stationsService.update(id, updateStationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🚉 [StationsController] DELETE /stations/${id}`);
    await this.stationsService.remove(id);
    return { message: 'Station deleted successfully' };
  }
}

