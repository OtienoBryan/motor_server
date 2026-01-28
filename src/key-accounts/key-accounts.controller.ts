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
import { KeyAccountsService } from './key-accounts.service';
import { KeyAccountLedgerService } from '../key-account-ledger/key-account-ledger.service';
import { KeyAccount } from '../entities/key-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateKeyAccountDto } from './dto/create-key-account.dto';
import { UpdateKeyAccountDto } from './dto/update-key-account.dto';

@Controller('key-accounts')
@UseGuards(JwtAuthGuard)
export class KeyAccountsController {
  constructor(
    private readonly keyAccountsService: KeyAccountsService,
    private readonly keyAccountLedgerService: KeyAccountLedgerService
  ) {}

  @Get()
  async findAll(): Promise<KeyAccount[]> {
    console.log('🏢 [KeyAccountsController] GET /key-accounts');
    return this.keyAccountsService.findAll();
  }

  @Get('receivables/aging-analysis')
  async getReceivablesAgingAnalysis(): Promise<any[]> {
    console.log('💰 [KeyAccountsController] GET /key-accounts/receivables/aging-analysis');
    return this.keyAccountLedgerService.getAgingAnalysis();
  }

  @Get(':id/pending-invoices')
  async getPendingInvoices(@Param('id', ParseIntPipe) id: number): Promise<any[]> {
    console.log(`💰 [KeyAccountsController] GET /key-accounts/${id}/pending-invoices`);
    return this.keyAccountLedgerService.getPendingInvoices(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<KeyAccount> {
    console.log(`🏢 [KeyAccountsController] GET /key-accounts/${id}`);
    return this.keyAccountsService.findOne(id);
  }

  @Post()
  async create(@Body() createKeyAccountDto: CreateKeyAccountDto): Promise<KeyAccount> {
    console.log('🏢 [KeyAccountsController] POST /key-accounts');
    console.log('🏢 [KeyAccountsController] Create key account data:', JSON.stringify(createKeyAccountDto, null, 2));
    try {
      const result = await this.keyAccountsService.create(createKeyAccountDto);
      console.log('✅ [KeyAccountsController] Key account created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [KeyAccountsController] Error in create:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateKeyAccountDto: UpdateKeyAccountDto,
    @Request() req
  ): Promise<KeyAccount> {
    console.log(`🏢 [KeyAccountsController] PUT /key-accounts/${id}`);
    console.log('🏢 [KeyAccountsController] Update key account data:', updateKeyAccountDto);
    return this.keyAccountsService.update(id, updateKeyAccountDto, req.user?.sub);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    console.log(`🏢 [KeyAccountsController] DELETE /key-accounts/${id}`);
    await this.keyAccountsService.remove(id);
    return { message: 'Key account deleted successfully' };
  }
}

