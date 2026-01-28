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
import { KeyAccountLedgerService } from './key-account-ledger.service';
import { KeyAccountLedger } from '../entities/key-account-ledger.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateKeyAccountLedgerDto } from './dto/create-key-account-ledger.dto';

@Controller('key-account-ledger')
@UseGuards(JwtAuthGuard)
export class KeyAccountLedgerController {
  constructor(private readonly keyAccountLedgerService: KeyAccountLedgerService) {}

  @Post()
  async create(@Body() createDto: CreateKeyAccountLedgerDto): Promise<KeyAccountLedger> {
    console.log('💰 [KeyAccountLedgerController] POST /key-account-ledger');
    console.log('💰 [KeyAccountLedgerController] Request body:', JSON.stringify(createDto, null, 2));
    try {
      const result = await this.keyAccountLedgerService.create(createDto);
      console.log('✅ [KeyAccountLedgerController] Ledger entry created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ [KeyAccountLedgerController] Error creating ledger entry:', error);
      console.error('❌ [KeyAccountLedgerController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('❌ [KeyAccountLedgerController] Error message:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  @Get('aging-analysis')
  async getAgingAnalysis(): Promise<any[]> {
    console.log('💰 [KeyAccountLedgerController] GET /key-account-ledger/aging-analysis');
    return this.keyAccountLedgerService.getAgingAnalysis();
  }

  @Get('key-account/:keyAccountId')
  async findByKeyAccount(@Param('keyAccountId', ParseIntPipe) keyAccountId: number): Promise<KeyAccountLedger[]> {
    console.log(`💰 [KeyAccountLedgerController] GET /key-account-ledger/key-account/${keyAccountId}`);
    return this.keyAccountLedgerService.findByKeyAccount(keyAccountId);
  }

  @Get()
  async findAll(@Query('keyAccountId') keyAccountId?: string): Promise<KeyAccountLedger[]> {
    console.log('💰 [KeyAccountLedgerController] GET /key-account-ledger');
    const accountId = keyAccountId ? parseInt(keyAccountId, 10) : undefined;
    return this.keyAccountLedgerService.findAll(accountId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<KeyAccountLedger> {
    console.log(`💰 [KeyAccountLedgerController] GET /key-account-ledger/${id}`);
    return this.keyAccountLedgerService.findOne(id);
  }
}

