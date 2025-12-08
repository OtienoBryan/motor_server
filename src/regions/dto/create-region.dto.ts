import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateRegionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  countryId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  status?: number;
}

