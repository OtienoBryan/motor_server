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
exports.KeyAccountFuelPricesController = void 0;
const common_1 = require("@nestjs/common");
const key_account_fuel_prices_service_1 = require("./key-account-fuel-prices.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_key_account_fuel_price_dto_1 = require("./dto/create-key-account-fuel-price.dto");
const update_key_account_fuel_price_dto_1 = require("./dto/update-key-account-fuel-price.dto");
let KeyAccountFuelPricesController = class KeyAccountFuelPricesController {
    keyAccountFuelPricesService;
    constructor(keyAccountFuelPricesService) {
        this.keyAccountFuelPricesService = keyAccountFuelPricesService;
    }
    async create(createKeyAccountFuelPriceDto, req) {
        if (!createKeyAccountFuelPriceDto.updatedBy && req.user?.sub) {
            createKeyAccountFuelPriceDto.updatedBy = req.user.sub;
        }
        console.log('⛽ [KeyAccountFuelPricesController] POST /key-account-fuel-prices');
        console.log('⛽ [KeyAccountFuelPricesController] Create fuel price data:', JSON.stringify(createKeyAccountFuelPriceDto, null, 2));
        try {
            const result = await this.keyAccountFuelPricesService.create(createKeyAccountFuelPriceDto);
            console.log('✅ [KeyAccountFuelPricesController] Fuel price created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [KeyAccountFuelPricesController] Error in create:', error);
            throw error;
        }
    }
    async findByKeyAccount(keyAccountId) {
        console.log(`⛽ [KeyAccountFuelPricesController] GET /key-account-fuel-prices/key-account/${keyAccountId}`);
        return this.keyAccountFuelPricesService.findByKeyAccount(keyAccountId);
    }
    async findLatestByKeyAccount(keyAccountId) {
        console.log(`⛽ [KeyAccountFuelPricesController] GET /key-account-fuel-prices/key-account/${keyAccountId}/latest`);
        return this.keyAccountFuelPricesService.findLatestByKeyAccount(keyAccountId);
    }
    async findOne(id) {
        console.log(`⛽ [KeyAccountFuelPricesController] GET /key-account-fuel-prices/${id}`);
        return this.keyAccountFuelPricesService.findOne(id);
    }
    async update(id, updateKeyAccountFuelPriceDto) {
        console.log(`⛽ [KeyAccountFuelPricesController] PUT /key-account-fuel-prices/${id}`);
        console.log('⛽ [KeyAccountFuelPricesController] Update fuel price data:', updateKeyAccountFuelPriceDto);
        return this.keyAccountFuelPricesService.update(id, updateKeyAccountFuelPriceDto);
    }
    async remove(id) {
        console.log(`⛽ [KeyAccountFuelPricesController] DELETE /key-account-fuel-prices/${id}`);
        await this.keyAccountFuelPricesService.remove(id);
        return { message: 'Fuel price history entry deleted successfully' };
    }
};
exports.KeyAccountFuelPricesController = KeyAccountFuelPricesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_key_account_fuel_price_dto_1.CreateKeyAccountFuelPriceDto, Object]),
    __metadata("design:returntype", Promise)
], KeyAccountFuelPricesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('key-account/:keyAccountId'),
    __param(0, (0, common_1.Param)('keyAccountId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KeyAccountFuelPricesController.prototype, "findByKeyAccount", null);
__decorate([
    (0, common_1.Get)('key-account/:keyAccountId/latest'),
    __param(0, (0, common_1.Param)('keyAccountId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KeyAccountFuelPricesController.prototype, "findLatestByKeyAccount", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KeyAccountFuelPricesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_key_account_fuel_price_dto_1.UpdateKeyAccountFuelPriceDto]),
    __metadata("design:returntype", Promise)
], KeyAccountFuelPricesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KeyAccountFuelPricesController.prototype, "remove", null);
exports.KeyAccountFuelPricesController = KeyAccountFuelPricesController = __decorate([
    (0, common_1.Controller)('key-account-fuel-prices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [key_account_fuel_prices_service_1.KeyAccountFuelPricesService])
], KeyAccountFuelPricesController);
//# sourceMappingURL=key-account-fuel-prices.controller.js.map