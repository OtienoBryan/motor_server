import { PartialType } from '@nestjs/mapped-types';
import { CreateKeyAccountFuelPriceDto } from './create-key-account-fuel-price.dto';

export class UpdateKeyAccountFuelPriceDto extends PartialType(CreateKeyAccountFuelPriceDto) {}
