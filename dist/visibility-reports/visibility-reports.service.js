"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisibilityReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let VisibilityReportsService = class VisibilityReportsService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async findAll(startDate, endDate, stationId, userId) {
        console.log('📋 [VisibilityReportsService] Finding visibility reports with filters:', {
            startDate,
            endDate,
            stationId,
            userId,
        });
        const conditions = [];
        const params = [];
        if (startDate) {
            conditions.push('DATE(vr.report_date) >= ?');
            params.push(startDate);
        }
        if (endDate) {
            conditions.push('DATE(vr.report_date) <= ?');
            params.push(endDate);
        }
        if (stationId) {
            conditions.push('vr.stationId = ?');
            params.push(stationId);
        }
        if (userId) {
            conditions.push('vr.userId = ?');
            params.push(userId);
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT
        vr.id,
        vr.opening,
        vr.openingImage,
        vr.openAt,
        vr.stationId,
        vr.userId,
        vr.report_date,
        vr.reportId,
        vr.nozzleId,
        vr.closing,
        vr.closingImage,
        vr.closedAt
      FROM VisibilityReport vr
      ${whereClause}
      ORDER BY vr.report_date DESC, vr.openAt DESC, vr.id DESC
    `;
        const rows = await this.dataSource.query(query, params);
        console.log(`✅ [VisibilityReportsService] Found ${rows.length} visibility report rows`);
        return rows;
    }
};
exports.VisibilityReportsService = VisibilityReportsService;
exports.VisibilityReportsService = VisibilityReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], VisibilityReportsService);
//# sourceMappingURL=visibility-reports.service.js.map