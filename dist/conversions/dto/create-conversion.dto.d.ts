import { FuelType } from '../../entities/conversion.entity';
export declare class CreateConversionDto {
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
    createdBy?: number;
}
