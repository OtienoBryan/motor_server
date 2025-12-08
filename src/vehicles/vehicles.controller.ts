import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  ParseIntPipe,
  Query,
  UseGuards 
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from '../entities/vehicle.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async findByKeyAccount(@Query('keyAccountId') keyAccountId: string): Promise<Vehicle[]> {
    if (!keyAccountId) {
      throw new Error('keyAccountId query parameter is required');
    }
    const accountId = parseInt(keyAccountId, 10);
    if (isNaN(accountId)) {
      throw new Error('keyAccountId must be a valid number');
    }
    console.log(`🚗 [VehiclesController] GET /vehicles?keyAccountId=${accountId}`);
    return this.vehiclesService.findByKeyAccount(accountId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Vehicle> {
    console.log(`🚗 [VehiclesController] GET /vehicles/${id}`);
    return this.vehiclesService.findOne(id);
  }

  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    console.log('🚗 [VehiclesController] POST /vehicles');
    return this.vehiclesService.create(createVehicleDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVehicleDto: UpdateVehicleDto
  ): Promise<Vehicle> {
    console.log(`🚗 [VehiclesController] PUT /vehicles/${id}`);
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🚗 [VehiclesController] DELETE /vehicles/${id}`);
    await this.vehiclesService.remove(id);
    return { message: 'Vehicle deleted successfully' };
  }
}

