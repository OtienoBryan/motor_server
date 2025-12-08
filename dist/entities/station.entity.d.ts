import { Region } from './region.entity';
export declare class Station {
    id: number;
    name: string;
    regionId: number;
    region?: Region;
    contact: string | null;
    price: number | null;
    lpgQuantity: number;
}
