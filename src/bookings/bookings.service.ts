import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from '../entities/booking.entity';
import { FlightSeries } from '../entities/flight-series.entity';
import { Passenger } from '../entities/passenger.entity';
import { BookingPassenger } from '../entities/booking-passenger.entity';
import { SeatReservation } from '../entities/seat-reservation.entity';
import { CreateBookingDto, PassengerDto } from './dto/create-booking.dto';
import { PassengersService } from '../passengers/passengers.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(FlightSeries)
    private flightSeriesRepository: Repository<FlightSeries>,
    @InjectRepository(Passenger)
    private passengerRepository: Repository<Passenger>,
    @InjectRepository(BookingPassenger)
    private bookingPassengerRepository: Repository<BookingPassenger>,
    @InjectRepository(SeatReservation)
    private seatReservationRepository: Repository<SeatReservation>,
    private passengersService: PassengersService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    console.log('🎫 [BookingsService] Creating new booking:', createBookingDto);
    
    // Verify flight series exists
    const flightSeries = await this.flightSeriesRepository.findOne({
      where: { id: createBookingDto.flight_series_id }
    });
    
    if (!flightSeries) {
      throw new NotFoundException(`Flight series with ID ${createBookingDto.flight_series_id} not found`);
    }

    if (!createBookingDto.passengers || createBookingDto.passengers.length === 0) {
      throw new BadRequestException('At least one passenger is required');
    }

    // Create all passengers first
    const createdPassengers: Passenger[] = []
    let totalAmount = 0
    let farePerPassenger = 0

    for (const passengerDto of createBookingDto.passengers) {
      // Calculate fare based on passenger type
      let fare = 0
      switch (passengerDto.passenger_type) {
        case 'adult':
          fare = Number(flightSeries.adult_fare) || 0
          break
        case 'child':
          fare = Number(flightSeries.child_fare) || 0
          break
        case 'infant':
          fare = Number(flightSeries.infant_fare) || 0
          break
      }
      totalAmount += fare
      farePerPassenger = fare

      // Create passenger (PNR will be auto-generated)
      const passenger = await this.passengersService.create({
        name: passengerDto.name,
        email: passengerDto.email || null,
        contact: passengerDto.contact || null,
        nationality: passengerDto.nationality || null,
        identification: passengerDto.identification || null,
        age: passengerDto.age ? (typeof passengerDto.age === 'string' ? parseInt(passengerDto.age, 10) : passengerDto.age) : null,
        title: passengerDto.title || null
      })
      
      createdPassengers.push(passenger)
      console.log(`✅ [BookingsService] Created passenger ${passenger.id} with PNR: ${passenger.pnr}`)
    }

    // Use first passenger as primary passenger for booking record
    const primaryPassenger = createdPassengers[0]

    // Generate unique booking reference
    const bookingReference = this.generateBookingReference()

    const booking = this.bookingRepository.create({
      booking_reference: bookingReference,
      flight_series_id: createBookingDto.flight_series_id,
      passenger_id: primaryPassenger.id,
      passenger_name: primaryPassenger.name,
      passenger_email: primaryPassenger.email,
      passenger_phone: primaryPassenger.contact,
      passenger_type: createBookingDto.passengers[0].passenger_type,
      number_of_passengers: createBookingDto.passengers.length,
      fare_per_passenger: farePerPassenger,
      total_amount: totalAmount,
      payment_method: createBookingDto.payment_method,
      payment_status: createBookingDto.payment_status || 'pending',
      booking_date: new Date(createBookingDto.booking_date),
      notes: createBookingDto.notes ?? null,
    });
    
    const savedBooking = await this.bookingRepository.save(booking);
    console.log(`✅ [BookingsService] Booking created with ID: ${savedBooking.id}, Reference: ${savedBooking.booking_reference}`);
    console.log(`✅ [BookingsService] Created ${createdPassengers.length} passengers for booking`);
    
    // Create booking_passengers records for all passengers
    const bookingPassengerRecords: BookingPassenger[] = []
    for (let i = 0; i < createdPassengers.length; i++) {
      const passenger = createdPassengers[i]
      const passengerDto = createBookingDto.passengers[i]
      
      // Calculate fare for this passenger
      let fare = 0
      switch (passengerDto.passenger_type) {
        case 'adult':
          fare = Number(flightSeries.adult_fare) || 0
          break
        case 'child':
          fare = Number(flightSeries.child_fare) || 0
          break
        case 'infant':
          fare = Number(flightSeries.infant_fare) || 0
          break
      }
      
      console.log(`🎫 [BookingsService] Creating booking_passenger record: booking_id=${savedBooking.id}, passenger_id=${passenger.id}, type=${passengerDto.passenger_type}, fare=${fare}`)
      
      const bookingPassenger = this.bookingPassengerRepository.create({
        booking_id: savedBooking.id,
        passenger_id: passenger.id,
        passenger_type: passengerDto.passenger_type,
        fare_amount: fare
      })
      
      try {
        const savedBookingPassenger = await this.bookingPassengerRepository.save(bookingPassenger)
        bookingPassengerRecords.push(savedBookingPassenger)
        console.log(`✅ [BookingsService] Linked passenger ${passenger.id} (${passenger.pnr}) to booking ${savedBooking.id}, booking_passenger ID: ${savedBookingPassenger.id}`)
      } catch (error) {
        console.error(`❌ [BookingsService] Error saving booking_passenger for passenger ${passenger.id}:`, error)
        console.error(`❌ [BookingsService] Error details:`, JSON.stringify(error, null, 2))
        // Re-throw to prevent booking from being created without passenger links
        throw new BadRequestException(`Failed to link passenger ${passenger.name} to booking: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    
    console.log(`✅ [BookingsService] Successfully created ${bookingPassengerRecords.length} booking_passenger records`)
    
    // Update seat reservation status to 'booked' if reservation_id is provided
    if (createBookingDto.seat_reservation_id) {
      try {
        const seatReservation = await this.seatReservationRepository.findOne({
          where: { id: createBookingDto.seat_reservation_id }
        });
        
        if (seatReservation) {
          seatReservation.status = 'booked';
          await this.seatReservationRepository.save(seatReservation);
          console.log(`✅ [BookingsService] Updated seat reservation ${seatReservation.id} status to 'booked'`);
        } else {
          console.warn(`⚠️ [BookingsService] Seat reservation ${createBookingDto.seat_reservation_id} not found`);
        }
      } catch (error) {
        console.error(`❌ [BookingsService] Error updating seat reservation status:`, error);
        // Don't throw - booking is already created successfully
      }
    }
    
    // Reload with relations
    const bookingWithRelations = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['flightSeries', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger']
    });
    
    return bookingWithRelations || savedBooking;
  }

  async findAll(page: number = 1, limit: number = 50): Promise<{ bookings: Booking[], total: number }> {
    const [bookings, total] = await this.bookingRepository.findAndCount({
      relations: ['flightSeries', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger'],
      order: { booking_date: 'DESC', created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return { bookings, total };
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['flightSeries', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger']
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return booking;
  }

  private generateBookingReference(): string {
    const prefix = 'BK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }
}

