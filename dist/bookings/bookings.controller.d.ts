import { BookingsService } from './bookings.service';
import { Booking } from '../entities/booking.entity';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(page?: number, limit?: number): Promise<{
        bookings: Booking[];
        total: number;
    }>;
}
