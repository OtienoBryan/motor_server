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
exports.LoyaltyPointsLedgerController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const loyalty_points_ledger_service_1 = require("./loyalty-points-ledger.service");
let LoyaltyPointsLedgerController = class LoyaltyPointsLedgerController {
    loyaltyPointsLedgerService;
    constructor(loyaltyPointsLedgerService) {
        this.loyaltyPointsLedgerService = loyaltyPointsLedgerService;
    }
    async findAll(keyAccountId) {
        const accountId = keyAccountId ? parseInt(keyAccountId, 10) : undefined;
        return this.loyaltyPointsLedgerService.findAll(accountId);
    }
    async redeemPoints(keyAccountId, body) {
        console.log(`🎁 [LoyaltyPointsLedgerController] POST /loyalty-points-ledger/redeem/${keyAccountId}`);
        console.log(`🎁 [LoyaltyPointsLedgerController] Request body:`, JSON.stringify(body, null, 2));
        return this.loyaltyPointsLedgerService.redeemPoints(keyAccountId, body.points, body.stationId, body.referenceNumber, body.createdBy);
    }
};
exports.LoyaltyPointsLedgerController = LoyaltyPointsLedgerController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('keyAccountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoyaltyPointsLedgerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('redeem/:keyAccountId'),
    __param(0, (0, common_1.Param)('keyAccountId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LoyaltyPointsLedgerController.prototype, "redeemPoints", null);
exports.LoyaltyPointsLedgerController = LoyaltyPointsLedgerController = __decorate([
    (0, common_1.Controller)('loyalty-points-ledger'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [loyalty_points_ledger_service_1.LoyaltyPointsLedgerService])
], LoyaltyPointsLedgerController);
//# sourceMappingURL=loyalty-points-ledger.controller.js.map