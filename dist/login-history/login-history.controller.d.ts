import { LoginHistoryService } from './login-history.service';
export declare class LoginHistoryController {
    private readonly loginHistoryService;
    constructor(loginHistoryService: LoginHistoryService);
    findAll(startDate?: string, endDate?: string, userId?: string): Promise<{
        duration: number | null;
        staff: import("../entities").Staff | null;
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
        staff: import("../entities").Staff | null;
        id: number;
        userId: number;
        timezone: string;
        status: number;
        sessionEnd: string;
        sessionStart: string;
        salesRep?: import("../entities").SalesRep;
    }[]>;
}
