import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsNumber()
  @Type(() => Number)
  key_account_id: number;

  @IsString()
  @IsNotEmpty()
  registration_number: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  driver_name: string;

  @IsString()
  @IsNotEmpty()
  driver_contact: string;
}

