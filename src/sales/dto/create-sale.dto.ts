import { IsNumber, IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ClientType, PaymentMethod } from '../../entities/sale.entity';

export class CreateSaleDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  stationId: number;

  @IsEnum(ClientType)
  @IsNotEmpty()
  clientType: ClientType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  keyAccountId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vehicleId?: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  unitPrice: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  totalAmount: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsDateString()
  @IsNotEmpty()
  saleDate: string;

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

