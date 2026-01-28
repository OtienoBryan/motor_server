import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateKeyAccountFuelPriceDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  keyAccountId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  updatedBy?: number | null;
}
