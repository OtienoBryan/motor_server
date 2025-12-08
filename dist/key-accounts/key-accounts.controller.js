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
exports.KeyAccountsController = void 0;
const common_1 = require("@nestjs/common");
const key_accounts_service_1 = require("./key-accounts.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_key_account_dto_1 = require("./dto/create-key-account.dto");
const update_key_account_dto_1 = require("./dto/update-key-account.dto");
let KeyAccountsController = class KeyAccountsController {
    keyAccountsService;
    constructor(keyAccountsService) {
        this.keyAccountsService = keyAccountsService;
    }
    async findAll() {
        console.log('🏢 [KeyAccountsController] GET /key-accounts');
        return this.keyAccountsService.findAll();
    }
    async findOne(id) {
        console.log(`🏢 [KeyAccountsController] GET /key-accounts/${id}`);
        return this.keyAccountsService.findOne(id);
    }
    async create(createKeyAccountDto) {
        console.log('🏢 [KeyAccountsController] POST /key-accounts');
        console.log('🏢 [KeyAccountsController] Create key account data:', JSON.stringify(createKeyAccountDto, null, 2));
        try {
            const result = await this.keyAccountsService.create(createKeyAccountDto);
            console.log('✅ [KeyAccountsController] Key account created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [KeyAccountsController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateKeyAccountDto) {
        console.log(`🏢 [KeyAccountsController] PUT /key-accounts/${id}`);
        console.log('🏢 [KeyAccountsController] Update key account data:', updateKeyAccountDto);
        return this.keyAccountsService.update(id, updateKeyAccountDto);
    }
    async remove(id) {
        console.log(`🏢 [KeyAccountsController] DELETE /key-accounts/${id}`);
        await this.keyAccountsService.remove(id);
        return { message: 'Key account deleted successfully' };
    }
};
exports.KeyAccountsController = KeyAccountsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KeyAccountsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KeyAccountsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_key_account_dto_1.CreateKeyAccountDto]),
    __metadata("design:returntype", Promise)
], KeyAccountsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_key_account_dto_1.UpdateKeyAccountDto]),
    __metadata("design:returntype", Promise)
], KeyAccountsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KeyAccountsController.prototype, "remove", null);
exports.KeyAccountsController = KeyAccountsController = __decorate([
    (0, common_1.Controller)('key-accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [key_accounts_service_1.KeyAccountsService])
], KeyAccountsController);
//# sourceMappingURL=key-accounts.controller.js.map