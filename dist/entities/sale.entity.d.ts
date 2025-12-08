import { Station } from './station.entity';
import { KeyAccount } from './key-account.entity';
import { Vehicle } from './vehicle.entity';
export declare enum ClientType {
    REGULAR = "regular",
    KEY_ACCOUNT = "key_account"
}
export declare class Sale {
    id: number;
    stationId: number;
    station?: Station;
    clientType: ClientType;
    keyAccountId?: number;
    keyAccount?: KeyAccount;
    vehicleId?: number;
    vehicle?: Vehicle;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    saleDate: Date;
    referenceNumber?: string;
    notes?: string;
    createdBy?: number;
    createdAt: Date;
    updatedAt: Date;
}
