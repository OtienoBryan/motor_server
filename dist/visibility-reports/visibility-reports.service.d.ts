import { DataSource } from 'typeorm';
export interface VisibilityReportRow {
    id: number;
    opening: number | null;
    openingImage: string | null;
    openAt: string | null;
    stationId: number;
    userId: number;
    report_date: string | null;
    reportId: number;
    nozzleId: number;
    closing: number | null;
    closingImage: string | null;
    closedAt: string | null;
}
export declare class VisibilityReportsService {
    private dataSource;
    constructor(dataSource: DataSource);
    findAll(startDate?: string, endDate?: string, stationId?: number, userId?: number): Promise<VisibilityReportRow[]>;
}
