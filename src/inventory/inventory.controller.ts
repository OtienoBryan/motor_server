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
import { InventoryService } from './inventory.service';
import { InventoryLedger } from '../entities/inventory-ledger.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInventoryLedgerDto } from './dto/create-inventory-ledger.dto';
import { UpdateInventoryLedgerDto } from './dto/update-inventory-ledger.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async create(@Body() createInventoryLedgerDto: CreateInventoryLedgerDto): Promise<InventoryLedger> {
    console.log('📦 [InventoryController] POST /inventory');
    console.log('📦 [InventoryController] Create inventory ledger data:', JSON.stringify(createInventoryLedgerDto, null, 2));
    try {
      const result = await this.inventoryService.create(createInventoryLedgerDto);
      console.log('✅ [InventoryController] Inventory ledger entry created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [InventoryController] Error in create:', error);
      throw error;
    }
  }

  @Get()
  async findAll(@Query('stationId') stationId?: string): Promise<InventoryLedger[]> {
    console.log('📦 [InventoryController] GET /inventory');
    if (stationId) {
      return this.inventoryService.findByStation(Number(stationId));
    }
    return this.inventoryService.findAll();
  }

  @Get('stations')
  async getStationInventory(): Promise<any[]> {
    console.log('📦 [InventoryController] GET /inventory/stations');
    return this.inventoryService.getStationInventory();
  }

  @Get('report')
  async getReport(): Promise<InventoryLedger[]> {
    console.log('📦 [InventoryController] GET /inventory/report');
    return this.inventoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<InventoryLedger> {
    console.log(`📦 [InventoryController] GET /inventory/${id}`);
    return this.inventoryService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryLedgerDto: UpdateInventoryLedgerDto
  ): Promise<InventoryLedger> {
    console.log(`📦 [InventoryController] PUT /inventory/${id}`);
    console.log('📦 [InventoryController] Update inventory ledger data:', updateInventoryLedgerDto);
    return this.inventoryService.update(id, updateInventoryLedgerDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`📦 [InventoryController] DELETE /inventory/${id}`);
    await this.inventoryService.remove(id);
    return { message: 'Inventory ledger entry deleted successfully' };
  }
}

