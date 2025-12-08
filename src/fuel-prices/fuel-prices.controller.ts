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
import { FuelPricesService } from './fuel-prices.service';
import { FuelPrice } from '../entities/fuel-price.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFuelPriceDto } from './dto/create-fuel-price.dto';
import { UpdateFuelPriceDto } from './dto/update-fuel-price.dto';

@Controller('fuel-prices')
@UseGuards(JwtAuthGuard)
export class FuelPricesController {
  constructor(private readonly fuelPricesService: FuelPricesService) {}

  @Post()
  async create(@Body() createFuelPriceDto: CreateFuelPriceDto): Promise<FuelPrice> {
    console.log('⛽ [FuelPricesController] POST /fuel-prices');
    console.log('⛽ [FuelPricesController] Create fuel price data:', JSON.stringify(createFuelPriceDto, null, 2));
    try {
      const result = await this.fuelPricesService.create(createFuelPriceDto);
      console.log('✅ [FuelPricesController] Fuel price created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [FuelPricesController] Error in create:', error);
      throw error;
    }
  }

  @Get('station/:stationId')
  async findByStation(@Param('stationId', ParseIntPipe) stationId: number): Promise<FuelPrice[]> {
    console.log(`⛽ [FuelPricesController] GET /fuel-prices/station/${stationId}`);
    return this.fuelPricesService.findByStation(stationId);
  }

  @Get('station/:stationId/latest')
  async findLatestByStation(@Param('stationId', ParseIntPipe) stationId: number): Promise<FuelPrice | null> {
    console.log(`⛽ [FuelPricesController] GET /fuel-prices/station/${stationId}/latest`);
    return this.fuelPricesService.findLatestByStation(stationId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<FuelPrice> {
    console.log(`⛽ [FuelPricesController] GET /fuel-prices/${id}`);
    return this.fuelPricesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFuelPriceDto: UpdateFuelPriceDto
  ): Promise<FuelPrice> {
    console.log(`⛽ [FuelPricesController] PUT /fuel-prices/${id}`);
    console.log('⛽ [FuelPricesController] Update fuel price data:', updateFuelPriceDto);
    return this.fuelPricesService.update(id, updateFuelPriceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`⛽ [FuelPricesController] DELETE /fuel-prices/${id}`);
    await this.fuelPricesService.remove(id);
    return { message: 'Fuel price deleted successfully' };
  }
}

