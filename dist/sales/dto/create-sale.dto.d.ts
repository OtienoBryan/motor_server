import { ClientType } from '../../entities/sale.entity';
export declare class CreateSaleDto {
    stationId: number;
    clientType: ClientType;
    keyAccountId?: number;
    vehicleId?: number;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    saleDate: string;
    referenceNumber?: string;
    notes?: string;
    createdBy?: number;
}
