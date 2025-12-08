import { Country } from './country.entity';
export declare class Region {
    id: number;
    name: string;
    countryId: number;
    country?: Country;
    status: number;
}
