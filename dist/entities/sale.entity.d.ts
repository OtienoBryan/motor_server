import { Station } from './station.entity';
import { KeyAccount } from './key-account.entity';
import { Vehicle } from './vehicle.entity';
export declare enum ClientType {
    REGULAR = "regular",
    KEY_ACCOUNT = "key_account"
}
export declare enum PaymentMethod {
    CASH = "cash",
    CARD = "card",
    MOBILE_MONEY = "mobile_money",
    CREDIT = "credit",
    OTHER = "other"
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
    paymentMethod?: PaymentMethod;
    saleDate: Date;
    referenceNumber?: string;
    notes?: string;
    createdBy?: number;
    createdAt: Date;
    updatedAt: Date;
}
