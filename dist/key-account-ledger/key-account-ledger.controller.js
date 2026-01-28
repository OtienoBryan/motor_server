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
exports.KeyAccountLedgerController = void 0;
const common_1 = require("@nestjs/common");
const key_account_ledger_service_1 = require("./key-account-ledger.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_key_account_ledger_dto_1 = require("./dto/create-key-account-ledger.dto");
let KeyAccountLedgerController = class KeyAccountLedgerController {
    keyAccountLedgerService;
    constructor(keyAccountLedgerService) {
        this.keyAccountLedgerService = keyAccountLedgerService;
    }
    async create(createDto) {
        console.log('💰 [KeyAccountLedgerController] POST /key-account-ledger');
        console.log('💰 [KeyAccountLedgerController] Request body:', JSON.stringify(createDto, null, 2));
        try {
            const result = await this.keyAccountLedgerService.create(createDto);
            console.log('✅ [KeyAccountLedgerController] Ledger entry created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [KeyAccountLedgerController] Error creating ledger entry:', error);
            console.error('❌ [KeyAccountLedgerController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            console.error('❌ [KeyAccountLedgerController] Error message:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
    async getAgingAnalysis() {
        console.log('💰 [KeyAccountLedgerController] GET /key-account-ledger/aging-analysis');
        return this.keyAccountLedgerService.getAgingAnalysis();
    }
    async findByKeyAccount(keyAccountId) {
        console.log(`💰 [KeyAccountLedgerController] GET /key-account-ledger/key-account/${keyAccountId}`);
        return this.keyAccountLedgerService.findByKeyAccount(keyAccountId);
    }
    async findAll(keyAccountId) {
        console.log('💰 [KeyAccountLedgerController] GET /key-account-ledger');
        const accountId = keyAccountId ? parseInt(keyAccountId, 10) : undefined;
        return this.keyAccountLedgerService.findAll(accountId);
    }
    async findOne(id) {
        console.log(`💰 [KeyAccountLedgerController] GET /key-account-ledger/${id}`);
        return this.keyAccountLedgerService.findOne(id);
    }
};
exports.KeyAccountLedgerController = KeyAccountLedgerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_key_account_ledger_dto_1.CreateKeyAccountLedgerDto]),
    __metadata("design:returntype", Promise)
], KeyAccountLedgerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('aging-analysis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KeyAccountLedgerController.prototype, "getAgingAnalysis", null);
__decorate([
    (0, common_1.Get)('key-account/:keyAccountId'),
    __param(0, (0, common_1.Param)('keyAccountId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KeyAccountLedgerController.prototype, "findByKeyAccount", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('keyAccountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KeyAccountLedgerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KeyAccountLedgerController.prototype, "findOne", null);
exports.KeyAccountLedgerController = KeyAccountLedgerController = __decorate([
    (0, common_1.Controller)('key-account-ledger'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [key_account_ledger_service_1.KeyAccountLedgerService])
], KeyAccountLedgerController);
//# sourceMappingURL=key-account-ledger.controller.js.map