"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelPricesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fuel_prices_service_1 = require("./fuel-prices.service");
const fuel_prices_controller_1 = require("./fuel-prices.controller");
const fuel_price_entity_1 = require("../entities/fuel-price.entity");
const station_entity_1 = require("../entities/station.entity");
let FuelPricesModule = class FuelPricesModule {
};
exports.FuelPricesModule = FuelPricesModule;
exports.FuelPricesModule = FuelPricesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([fuel_price_entity_1.FuelPrice, station_entity_1.Station])],
        controllers: [fuel_prices_controller_1.FuelPricesController],
        providers: [fuel_prices_service_1.FuelPricesService],
        exports: [fuel_prices_service_1.FuelPricesService],
    })
], FuelPricesModule);
//# sourceMappingURL=fuel-prices.module.js.map