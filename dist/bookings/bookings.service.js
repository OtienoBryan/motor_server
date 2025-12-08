"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../entities/booking.entity");
const flight_series_entity_1 = require("../entities/flight-series.entity");
const passenger_entity_1 = require("../entities/passenger.entity");
const booking_passenger_entity_1 = require("../entities/booking-passenger.entity");
const seat_reservation_entity_1 = require("../entities/seat-reservation.entity");
const passengers_service_1 = require("../passengers/passengers.service");
let BookingsService = class BookingsService {
    bookingRepository;
    flightSeriesRepository;
    passengerRepository;
    bookingPassengerRepository;
    seatReservationRepository;
    passengersService;
    constructor(bookingRepository, flightSeriesRepository, passengerRepository, bookingPassengerRepository, seatReservationRepository, passengersService) {
        this.bookingRepository = bookingRepository;
        this.flightSeriesRepository = flightSeriesRepository;
        this.passengerRepository = passengerRepository;
        this.bookingPassengerRepository = bookingPassengerRepository;
        this.seatReservationRepository = seatReservationRepository;
        this.passengersService = passengersService;
    }
    async create(createBookingDto) {
        console.log('🎫 [BookingsService] Creating new booking:', createBookingDto);
        const flightSeries = await this.flightSeriesRepository.findOne({
            where: { id: createBookingDto.flight_series_id }
        });
        if (!flightSeries) {
            throw new common_1.NotFoundException(`Flight series with ID ${createBookingDto.flight_series_id} not found`);
        }
        if (!createBookingDto.passengers || createBookingDto.passengers.length === 0) {
            throw new common_1.BadRequestException('At least one passenger is required');
        }
        const createdPassengers = [];
        let totalAmount = 0;
        let farePerPassenger = 0;
        for (const passengerDto of createBookingDto.passengers) {
            let fare = 0;
            switch (passengerDto.passenger_type) {
                case 'adult':
                    fare = Number(flightSeries.adult_fare) || 0;
                    break;
                case 'child':
                    fare = Number(flightSeries.child_fare) || 0;
                    break;
                case 'infant':
                    fare = Number(flightSeries.infant_fare) || 0;
                    break;
            }
            totalAmount += fare;
            farePerPassenger = fare;
            const passenger = await this.passengersService.create({
                name: passengerDto.name,
                email: passengerDto.email || null,
                contact: passengerDto.contact || null,
                nationality: passengerDto.nationality || null,
                identification: passengerDto.identification || null,
                age: passengerDto.age ? (typeof passengerDto.age === 'string' ? parseInt(passengerDto.age, 10) : passengerDto.age) : null,
                title: passengerDto.title || null
            });
            createdPassengers.push(passenger);
            console.log(`✅ [BookingsService] Created passenger ${passenger.id} with PNR: ${passenger.pnr}`);
        }
        const primaryPassenger = createdPassengers[0];
        const bookingReference = this.generateBookingReference();
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
        const bookingPassengerRecords = [];
        for (let i = 0; i < createdPassengers.length; i++) {
            const passenger = createdPassengers[i];
            const passengerDto = createBookingDto.passengers[i];
            let fare = 0;
            switch (passengerDto.passenger_type) {
                case 'adult':
                    fare = Number(flightSeries.adult_fare) || 0;
                    break;
                case 'child':
                    fare = Number(flightSeries.child_fare) || 0;
                    break;
                case 'infant':
                    fare = Number(flightSeries.infant_fare) || 0;
                    break;
            }
            console.log(`🎫 [BookingsService] Creating booking_passenger record: booking_id=${savedBooking.id}, passenger_id=${passenger.id}, type=${passengerDto.passenger_type}, fare=${fare}`);
            const bookingPassenger = this.bookingPassengerRepository.create({
                booking_id: savedBooking.id,
                passenger_id: passenger.id,
                passenger_type: passengerDto.passenger_type,
                fare_amount: fare
            });
            try {
                const savedBookingPassenger = await this.bookingPassengerRepository.save(bookingPassenger);
                bookingPassengerRecords.push(savedBookingPassenger);
                console.log(`✅ [BookingsService] Linked passenger ${passenger.id} (${passenger.pnr}) to booking ${savedBooking.id}, booking_passenger ID: ${savedBookingPassenger.id}`);
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error saving booking_passenger for passenger ${passenger.id}:`, error);
                console.error(`❌ [BookingsService] Error details:`, JSON.stringify(error, null, 2));
                throw new common_1.BadRequestException(`Failed to link passenger ${passenger.name} to booking: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        console.log(`✅ [BookingsService] Successfully created ${bookingPassengerRecords.length} booking_passenger records`);
        if (createBookingDto.seat_reservation_id) {
            try {
                const seatReservation = await this.seatReservationRepository.findOne({
                    where: { id: createBookingDto.seat_reservation_id }
                });
                if (seatReservation) {
                    seatReservation.status = 'booked';
                    await this.seatReservationRepository.save(seatReservation);
                    console.log(`✅ [BookingsService] Updated seat reservation ${seatReservation.id} status to 'booked'`);
                }
                else {
                    console.warn(`⚠️ [BookingsService] Seat reservation ${createBookingDto.seat_reservation_id} not found`);
                }
            }
            catch (error) {
                console.error(`❌ [BookingsService] Error updating seat reservation status:`, error);
            }
        }
        const bookingWithRelations = await this.bookingRepository.findOne({
            where: { id: savedBooking.id },
            relations: ['flightSeries', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger']
        });
        return bookingWithRelations || savedBooking;
    }
    async findAll(page = 1, limit = 50) {
        const [bookings, total] = await this.bookingRepository.findAndCount({
            relations: ['flightSeries', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger'],
            order: { booking_date: 'DESC', created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { bookings, total };
    }
    async findOne(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: ['flightSeries', 'passenger', 'bookingPassengers', 'bookingPassengers.passenger']
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    generateBookingReference() {
        const prefix = 'BK';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(flight_series_entity_1.FlightSeries)),
    __param(2, (0, typeorm_1.InjectRepository)(passenger_entity_1.Passenger)),
    __param(3, (0, typeorm_1.InjectRepository)(booking_passenger_entity_1.BookingPassenger)),
    __param(4, (0, typeorm_1.InjectRepository)(seat_reservation_entity_1.SeatReservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        passengers_service_1.PassengersService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map