"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyAccountFuelPricesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const key_account_fuel_prices_service_1 = require("./key-account-fuel-prices.service");
const key_account_fuel_prices_controller_1 = require("./key-account-fuel-prices.controller");
const key_account_fuel_price_entity_1 = require("../entities/key-account-fuel-price.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
const staff_entity_1 = require("../entities/staff.entity");
let KeyAccountFuelPricesModule = class KeyAccountFuelPricesModule {
};
exports.KeyAccountFuelPricesModule = KeyAccountFuelPricesModule;
exports.KeyAccountFuelPricesModule = KeyAccountFuelPricesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([key_account_fuel_price_entity_1.KeyAccountFuelPrice, key_account_entity_1.KeyAccount, staff_entity_1.Staff]),
        ],
        controllers: [key_account_fuel_prices_controller_1.KeyAccountFuelPricesController],
        providers: [key_account_fuel_prices_service_1.KeyAccountFuelPricesService],
        exports: [key_account_fuel_prices_service_1.KeyAccountFuelPricesService],
    })
], KeyAccountFuelPricesModule);
//# sourceMappingURL=key-account-fuel-prices.module.js.map