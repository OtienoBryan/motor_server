import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete,
  Body, 
  Param, 
  ParseIntPipe,
  UseGuards,
  Request
} from '@nestjs/common';
import { KeyAccountFuelPricesService } from './key-account-fuel-prices.service';
import { KeyAccountFuelPrice } from '../entities/key-account-fuel-price.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateKeyAccountFuelPriceDto } from './dto/create-key-account-fuel-price.dto';
import { UpdateKeyAccountFuelPriceDto } from './dto/update-key-account-fuel-price.dto';

@Controller('key-account-fuel-prices')
@UseGuards(JwtAuthGuard)
export class KeyAccountFuelPricesController {
  constructor(
    private readonly keyAccountFuelPricesService: KeyAccountFuelPricesService
  ) {}

  @Post()
  async create(@Body() createKeyAccountFuelPriceDto: CreateKeyAccountFuelPriceDto, @Request() req): Promise<KeyAccountFuelPrice> {
    // Set updatedBy from the authenticated user if not provided
    if (!createKeyAccountFuelPriceDto.updatedBy && req.user?.sub) {
      createKeyAccountFuelPriceDto.updatedBy = req.user.sub;
    }
    console.log('⛽ [KeyAccountFuelPricesController] POST /key-account-fuel-prices');
    console.log('⛽ [KeyAccountFuelPricesController] Create fuel price data:', JSON.stringify(createKeyAccountFuelPriceDto, null, 2));
    try {
      const result = await this.keyAccountFuelPricesService.create(createKeyAccountFuelPriceDto);
      console.log('✅ [KeyAccountFuelPricesController] Fuel price created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [KeyAccountFuelPricesController] Error in create:', error);
      throw error;
    }
  }

  @Get('key-account/:keyAccountId')
  async findByKeyAccount(@Param('keyAccountId', ParseIntPipe) keyAccountId: number): Promise<KeyAccountFuelPrice[]> {
    console.log(`⛽ [KeyAccountFuelPricesController] GET /key-account-fuel-prices/key-account/${keyAccountId}`);
    return this.keyAccountFuelPricesService.findByKeyAccount(keyAccountId);
  }

  @Get('key-account/:keyAccountId/latest')
  async findLatestByKeyAccount(@Param('keyAccountId', ParseIntPipe) keyAccountId: number): Promise<KeyAccountFuelPrice | null> {
    console.log(`⛽ [KeyAccountFuelPricesController] GET /key-account-fuel-prices/key-account/${keyAccountId}/latest`);
    return this.keyAccountFuelPricesService.findLatestByKeyAccount(keyAccountId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<KeyAccountFuelPrice> {
    console.log(`⛽ [KeyAccountFuelPricesController] GET /key-account-fuel-prices/${id}`);
    return this.keyAccountFuelPricesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKeyAccountFuelPriceDto: UpdateKeyAccountFuelPriceDto
  ): Promise<KeyAccountFuelPrice> {
    console.log(`⛽ [KeyAccountFuelPricesController] PUT /key-account-fuel-prices/${id}`);
    console.log('⛽ [KeyAccountFuelPricesController] Update fuel price data:', updateKeyAccountFuelPriceDto);
    return this.keyAccountFuelPricesService.update(id, updateKeyAccountFuelPriceDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`⛽ [KeyAccountFuelPricesController] DELETE /key-account-fuel-prices/${id}`);
    await this.keyAccountFuelPricesService.remove(id);
    return { message: 'Fuel price history entry deleted successfully' };
  }
}
