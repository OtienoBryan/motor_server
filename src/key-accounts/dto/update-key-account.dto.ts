import { PartialType } from '@nestjs/mapped-types';
import { CreateKeyAccountDto } from './create-key-account.dto';

export class UpdateKeyAccountDto extends PartialType(CreateKeyAccountDto) {}

