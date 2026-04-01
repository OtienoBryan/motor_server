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
exports.AttendantsCashHandController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const attendants_cash_hand_service_1 = require("./attendants-cash-hand.service");
let AttendantsCashHandController = class AttendantsCashHandController {
    attendantsCashHandService;
    constructor(attendantsCashHandService) {
        this.attendantsCashHandService = attendantsCashHandService;
    }
    async getSummary() {
        return this.attendantsCashHandService.getSummary();
    }
    async getLedger(attendantId) {
        return this.attendantsCashHandService.getLedger(attendantId);
    }
};
exports.AttendantsCashHandController = AttendantsCashHandController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendantsCashHandController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':attendantId/ledger'),
    __param(0, (0, common_1.Param)('attendantId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AttendantsCashHandController.prototype, "getLedger", null);
exports.AttendantsCashHandController = AttendantsCashHandController = __decorate([
    (0, common_1.Controller)('attendants-cash-hand'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [attendants_cash_hand_service_1.AttendantsCashHandService])
], AttendantsCashHandController);
//# sourceMappingURL=attendants-cash-hand.controller.js.map