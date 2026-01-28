import { Repository } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { Staff } from '../entities/staff.entity';
export declare class LoginHistoryService {
    private loginHistoryRepository;
    private staffRepository;
    constructor(loginHistoryRepository: Repository<LoginHistory>, staffRepository: Repository<Staff>);
    findAll(startDate?: string, endDate?: string, userId?: number): Promise<{
        duration: number | null;
        staff: Staff | null;
        id: number;
        userId: number;
        timezone: string;
        status: number;
        sessionEnd: string;
        sessionStart: string;
        salesRep?: import("../entities").SalesRep;
    }[]>;
    findByUserId(userId: number, startDate?: string, endDate?: string): Promise<{
        duration: number | null;
        staff: Staff | null;
        id: number;
        userId: number;
        timezone: string;
        status: number;
        sessionEnd: string;
        sessionStart: string;
        salesRep?: import("../entities").SalesRep;
    }[]>;
}
