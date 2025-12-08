import { Station } from './station.entity';
export declare class FuelPrice {
    id: number;
    stationId: number;
    station?: Station;
    price: number;
    fuelType: string | null;
    notes: string | null;
    created_at: Date;
}
