import { Repository } from 'typeorm';
import { CheckinRecord } from '../entities/checkin-record.entity';
export declare class CheckinRecordsService {
    private checkinRecordsRepository;
    constructor(checkinRecordsRepository: Repository<CheckinRecord>);
    findAll(startDate?: string, endDate?: string, userId?: number, stationId?: number): Promise<CheckinRecord[]>;
    findOne(id: number): Promise<CheckinRecord | null>;
}
