import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { FuelType } from '../../entities/conversion.entity';

export class CreateConversionDto {
  @IsString()
  @IsNotEmpty()
  ownerFullName: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  passportId?: string;

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  vehicleRegistration: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  yearOfManufacture?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  engineCapacity?: number;

  @IsOptional()
  @IsString()
  vinChassisNumber?: string;

  @IsEnum(FuelType)
  @IsNotEmpty()
  currentFuelType: FuelType;

  @IsOptional()
  @IsString()
  logbookNumber?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  createdBy?: number;
}

