export declare enum FuelType {
    PETROL = "petrol",
    DIESEL = "diesel",
    HYBRID = "hybrid"
}
export declare class Conversion {
    id: number;
    ownerFullName: string;
    nationalId?: string;
    passportId?: string;
    contact: string;
    email?: string;
    vehicleRegistration: string;
    make?: string;
    model?: string;
    yearOfManufacture?: number;
    engineCapacity?: number;
    vinChassisNumber?: string;
    currentFuelType: FuelType;
    logbookNumber?: string;
    scheduledDate?: Date;
    status: 'pending' | 'approved' | 'declined';
    comment?: string;
    createdBy?: number;
    createdAt: Date;
    updatedAt: Date;
}
