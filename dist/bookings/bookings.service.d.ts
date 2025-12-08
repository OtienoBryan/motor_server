import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Passenger } from '../entities/passenger.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PassengersService } from '../passengers/passengers.service';
export declare class BookingsService {
    private bookingRepository;
    private flightSeriesRepository;
    private passengerRepository;
    private bookingPassengerRepository;
    private seatReservationRepository;
    private passengersService;
    constructor(bookingRepository: Repository<Booking>, flightSeriesRepository: Repository<FlightSeries>, passengerRepository: Repository<Passenger>, bookingPassengerRepository: Repository<BookingPassenger>, seatReservationRepository: Repository<SeatReservation>, passengersService: PassengersService);
    create(createBookingDto: CreateBookingDto): Promise<Booking>;
    findAll(page?: number, limit?: number): Promise<{
        bookings: Booking[];
        total: number;
    }>;
    findOne(id: number): Promise<Booking>;
    private generateBookingReference;
}
