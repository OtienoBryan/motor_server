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
exports.ManagersCashApprovalsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const managers_cash_approvals_service_1 = require("./managers-cash-approvals.service");
let ManagersCashApprovalsController = class ManagersCashApprovalsController {
    managersCashApprovalsService;
    constructor(managersCashApprovalsService) {
        this.managersCashApprovalsService = managersCashApprovalsService;
    }
    async findAll(status, destination, managerId, startDate, endDate) {
        return this.managersCashApprovalsService.findAll(status, destination, managerId ? parseInt(managerId, 10) : undefined, startDate, endDate);
    }
    async getAccounts() {
        return this.managersCashApprovalsService.getCashAccounts();
    }
    async getAccountsLedger(accountName, entryType, startDate, endDate) {
        return this.managersCashApprovalsService.getCashAccountLedger(accountName, entryType, startDate, endDate);
    }
    async approve(id, body) {
        await this.managersCashApprovalsService.approveSubmission(id, body?.approvedBy);
        return { message: 'Submission approved successfully' };
    }
    async reject(id, body) {
        await this.managersCashApprovalsService.rejectSubmission(id, body?.rejectionReason || 'Rejected', body?.approvedBy);
        return { message: 'Submission rejected successfully' };
    }
};
exports.ManagersCashApprovalsController = ManagersCashApprovalsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('destination')),
    __param(2, (0, common_1.Query)('managerId')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ManagersCashApprovalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('accounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManagersCashApprovalsController.prototype, "getAccounts", null);
__decorate([
    (0, common_1.Get)('accounts/ledger'),
    __param(0, (0, common_1.Query)('accountName')),
    __param(1, (0, common_1.Query)('entryType')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ManagersCashApprovalsController.prototype, "getAccountsLedger", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagersCashApprovalsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ManagersCashApprovalsController.prototype, "reject", null);
exports.ManagersCashApprovalsController = ManagersCashApprovalsController = __decorate([
    (0, common_1.Controller)('managers-cash-approvals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [managers_cash_approvals_service_1.ManagersCashApprovalsService])
], ManagersCashApprovalsController);
//# sourceMappingURL=managers-cash-approvals.controller.js.map