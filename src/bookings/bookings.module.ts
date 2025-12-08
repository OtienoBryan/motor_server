import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Passenger } from '../entities/passenger.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PassengersModule } from '../passengers/passengers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, FlightSeries, Passenger, BookingPassenger, SeatReservation]),
    PassengersModule
  ],
  providers: [BookingsService],
  controllers: [BookingsController],
  exports: [BookingsService]
})
export class BookingsModule {}

