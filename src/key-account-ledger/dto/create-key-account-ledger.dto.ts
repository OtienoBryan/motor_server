import { IsNumber, IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { KeyAccountTransactionType } from '../../entities/key-account-ledger.entity';

export class CreateKeyAccountLedgerDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  keyAccountId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vehicleId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  stationId: number;

  @IsDateString()
  @IsNotEmpty()
  transactionDate: string;

  @IsEnum(KeyAccountTransactionType)
  @IsNotEmpty()
  transactionType: KeyAccountTransactionType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  unitPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  debit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  credit?: number;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  createdBy?: number;
}

