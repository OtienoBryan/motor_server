import { CheckinRecordsService } from './checkin-records.service';
import { CheckinRecord } from '../entities/checkin-record.entity';
export declare class CheckinRecordsController {
    private readonly checkinRecordsService;
    constructor(checkinRecordsService: CheckinRecordsService);
    findAll(startDate?: string, endDate?: string, userId?: string, stationId?: string): Promise<CheckinRecord[]>;
    findOne(id: number): Promise<CheckinRecord | null>;
}
