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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisibilityReportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const visibility_reports_service_1 = require("./visibility-reports.service");
let VisibilityReportsController = class VisibilityReportsController {
    visibilityReportsService;
    constructor(visibilityReportsService) {
        this.visibilityReportsService = visibilityReportsService;
    }
    async findAll(startDate, endDate, stationId, userId) {
        console.log('📋 [VisibilityReportsController] GET /visibility-reports', {
            startDate,
            endDate,
            stationId,
            userId,
        });
        return this.visibilityReportsService.findAll(startDate, endDate, stationId ? parseInt(stationId, 10) : undefined, userId ? parseInt(userId, 10) : undefined);
    }
};
exports.VisibilityReportsController = VisibilityReportsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('stationId')),
    __param(3, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], VisibilityReportsController.prototype, "findAll", null);
exports.VisibilityReportsController = VisibilityReportsController = __decorate([
    (0, common_1.Controller)('visibility-reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [visibility_reports_service_1.VisibilityReportsService])
], VisibilityReportsController);
//# sourceMappingURL=visibility-reports.controller.js.map