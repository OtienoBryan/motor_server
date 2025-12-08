import { IsNumber, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../../entities/inventory-ledger.entity';

export class CreateInventoryLedgerDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  stationId: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  createdBy?: number;
}

