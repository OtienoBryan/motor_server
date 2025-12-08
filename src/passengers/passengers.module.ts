import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengersService } from './passengers.service';
import { Passenger } from '../entities/passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  providers: [PassengersService],
  exports: [PassengersService],
})
export class PassengersModule {}

