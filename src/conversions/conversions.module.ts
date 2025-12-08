import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversionsService } from './conversions.service';
import { ConversionsController } from './conversions.controller';
import { Conversion } from '../entities/conversion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversion])],
  controllers: [ConversionsController],
  providers: [ConversionsService],
  exports: [ConversionsService],
})
export class ConversionsModule {}

