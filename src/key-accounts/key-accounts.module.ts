import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyAccountsService } from './key-accounts.service';
import { KeyAccountsController } from './key-accounts.controller';
import { KeyAccount } from '../entities/key-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KeyAccount])],
  controllers: [KeyAccountsController],
  providers: [KeyAccountsService],
  exports: [KeyAccountsService],
})
export class KeyAccountsModule {}

