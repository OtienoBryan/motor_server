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
exports.LoginHistoryController = void 0;
const common_1 = require("@nestjs/common");
const login_history_service_1 = require("./login-history.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let LoginHistoryController = class LoginHistoryController {
    loginHistoryService;
    constructor(loginHistoryService) {
        this.loginHistoryService = loginHistoryService;
    }
    async findAll(startDate, endDate, userId) {
        console.log('📋 [LoginHistoryController] GET /login-history');
        const userIdNum = userId ? parseInt(userId, 10) : undefined;
        return this.loginHistoryService.findAll(startDate, endDate, userIdNum);
    }
    async findByUserId(userId, startDate, endDate) {
        console.log(`📋 [LoginHistoryController] GET /login-history/user/${userId}`);
        return this.loginHistoryService.findByUserId(userId, startDate, endDate);
    }
};
exports.LoginHistoryController = LoginHistoryController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LoginHistoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], LoginHistoryController.prototype, "findByUserId", null);
exports.LoginHistoryController = LoginHistoryController = __decorate([
    (0, common_1.Controller)('login-history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [login_history_service_1.LoginHistoryService])
], LoginHistoryController);
//# sourceMappingURL=login-history.controller.js.map