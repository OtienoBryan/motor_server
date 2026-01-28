import { Staff } from './staff.entity';
import { Station } from './station.entity';
export declare class CheckinRecord {
    id: number;
    userId: number;
    userName: string;
    stationId: number;
    stationName: string;
    checkInLatitude: number;
    checkInLongitude: number;
    checkOutLatitude: number;
    checkOutLongitude: number;
    address: string;
    status: number;
    timeIn: Date;
    timeOut: Date;
    qrData: string;
    createdAt: Date;
    updatedAt: Date;
    staff: Staff;
    station: Station;
}
