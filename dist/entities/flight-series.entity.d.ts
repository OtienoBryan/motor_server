import { Aircraft } from './aircraft.entity';
import { Destination } from './destination.entity';
export declare class FlightSeries {
    id: number;
    flt: string;
    aircraft_id: number | null;
    aircraft?: Aircraft;
    flight_type: string;
    start_date: Date;
    end_date: Date;
    std: string | null;
    sta: string | null;
    number_of_seats: number | null;
    from_destination_id: number | null;
    fromDestination?: Destination;
    from_terminal: string | null;
    to_terminal: string | null;
    via_destination_id: number | null;
    viaDestination?: Destination;
    via_std: string | null;
    via_sta: string | null;
    to_destination_id: number | null;
    toDestination?: Destination;
    adult_fare: number | null;
    child_fare: number | null;
    infant_fare: number | null;
    created_at: Date;
    updated_at: Date;
}
