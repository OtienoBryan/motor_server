"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyAccountLedgerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const key_account_ledger_controller_1 = require("./key-account-ledger.controller");
const key_account_ledger_service_1 = require("./key-account-ledger.service");
const key_account_ledger_entity_1 = require("../entities/key-account-ledger.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
const station_entity_1 = require("../entities/station.entity");
const vehicle_entity_1 = require("../entities/vehicle.entity");
let KeyAccountLedgerModule = class KeyAccountLedgerModule {
};
exports.KeyAccountLedgerModule = KeyAccountLedgerModule;
exports.KeyAccountLedgerModule = KeyAccountLedgerModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([key_account_ledger_entity_1.KeyAccountLedger, key_account_entity_1.KeyAccount, station_entity_1.Station, vehicle_entity_1.Vehicle]),
        ],
        controllers: [key_account_ledger_controller_1.KeyAccountLedgerController],
        providers: [key_account_ledger_service_1.KeyAccountLedgerService],
        exports: [key_account_ledger_service_1.KeyAccountLedgerService],
    })
], KeyAccountLedgerModule);
//# sourceMappingURL=key-account-ledger.module.js.map