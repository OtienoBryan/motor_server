import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from '../entities/sale.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() createDto: CreateSaleDto): Promise<Sale> {
    console.log('💰 [SalesController] POST /sales');
    console.log('💰 [SalesController] Request body:', JSON.stringify(createDto, null, 2));
    try {
      const result = await this.salesService.create(createDto);
      console.log('✅ [SalesController] Sale created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [SalesController] Error creating sale:', error);
      console.error('❌ [SalesController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query('stationId') stationId?: string,
    @Query('keyAccountId') keyAccountId?: string,
    @Query('clientType') clientType?: string
  ): Promise<Sale[]> {
    console.log('💰 [SalesController] GET /sales');
    const station = stationId ? parseInt(stationId, 10) : undefined;
    const keyAccount = keyAccountId ? parseInt(keyAccountId, 10) : undefined;
    return this.salesService.findAll(station, keyAccount, clientType);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Sale> {
    console.log(`💰 [SalesController] GET /sales/${id}`);
    return this.salesService.findOne(id);
  }
}

