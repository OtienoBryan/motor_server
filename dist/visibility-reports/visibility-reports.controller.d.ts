import { VisibilityReportsService, VisibilityReportRow } from './visibility-reports.service';
export declare class VisibilityReportsController {
    private readonly visibilityReportsService;
    constructor(visibilityReportsService: VisibilityReportsService);
    findAll(startDate?: string, endDate?: string, stationId?: string, userId?: string): Promise<VisibilityReportRow[]>;
}
