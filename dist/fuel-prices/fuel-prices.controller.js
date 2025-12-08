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
exports.FuelPricesController = void 0;
const common_1 = require("@nestjs/common");
const fuel_prices_service_1 = require("./fuel-prices.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_fuel_price_dto_1 = require("./dto/create-fuel-price.dto");
const update_fuel_price_dto_1 = require("./dto/update-fuel-price.dto");
let FuelPricesController = class FuelPricesController {
    fuelPricesService;
    constructor(fuelPricesService) {
        this.fuelPricesService = fuelPricesService;
    }
    async create(createFuelPriceDto) {
        console.log('⛽ [FuelPricesController] POST /fuel-prices');
        console.log('⛽ [FuelPricesController] Create fuel price data:', JSON.stringify(createFuelPriceDto, null, 2));
        try {
            const result = await this.fuelPricesService.create(createFuelPriceDto);
            console.log('✅ [FuelPricesController] Fuel price created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [FuelPricesController] Error in create:', error);
            throw error;
        }
    }
    async findByStation(stationId) {
        console.log(`⛽ [FuelPricesController] GET /fuel-prices/station/${stationId}`);
        return this.fuelPricesService.findByStation(stationId);
    }
    async findLatestByStation(stationId) {
        console.log(`⛽ [FuelPricesController] GET /fuel-prices/station/${stationId}/latest`);
        return this.fuelPricesService.findLatestByStation(stationId);
    }
    async findOne(id) {
        console.log(`⛽ [FuelPricesController] GET /fuel-prices/${id}`);
        return this.fuelPricesService.findOne(id);
    }
    async update(id, updateFuelPriceDto) {
        console.log(`⛽ [FuelPricesController] PUT /fuel-prices/${id}`);
        console.log('⛽ [FuelPricesController] Update fuel price data:', updateFuelPriceDto);
        return this.fuelPricesService.update(id, updateFuelPriceDto);
    }
    async remove(id) {
        console.log(`⛽ [FuelPricesController] DELETE /fuel-prices/${id}`);
        await this.fuelPricesService.remove(id);
        return { message: 'Fuel price deleted successfully' };
    }
};
exports.FuelPricesController = FuelPricesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fuel_price_dto_1.CreateFuelPriceDto]),
    __metadata("design:returntype", Promise)
], FuelPricesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('station/:stationId'),
    __param(0, (0, common_1.Param)('stationId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FuelPricesController.prototype, "findByStation", null);
__decorate([
    (0, common_1.Get)('station/:stationId/latest'),
    __param(0, (0, common_1.Param)('stationId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FuelPricesController.prototype, "findLatestByStation", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FuelPricesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_fuel_price_dto_1.UpdateFuelPriceDto]),
    __metadata("design:returntype", Promise)
], FuelPricesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FuelPricesController.prototype, "remove", null);
exports.FuelPricesController = FuelPricesController = __decorate([
    (0, common_1.Controller)('fuel-prices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [fuel_prices_service_1.FuelPricesService])
], FuelPricesController);
//# sourceMappingURL=fuel-prices.controller.js.map