import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDeliveryApprovalDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  stationId: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0.01)
  quantity: number;

  @IsDateString()
  @IsNotEmpty()
  deliveryDate: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  submittedBy?: number;
}

