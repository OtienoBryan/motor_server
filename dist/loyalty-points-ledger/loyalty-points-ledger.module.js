"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyPointsLedgerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const loyalty_points_ledger_entity_1 = require("../entities/loyalty-points-ledger.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
const key_account_ledger_entity_1 = require("../entities/key-account-ledger.entity");
const station_entity_1 = require("../entities/station.entity");
const loyalty_points_ledger_controller_1 = require("./loyalty-points-ledger.controller");
const loyalty_points_ledger_service_1 = require("./loyalty-points-ledger.service");
let LoyaltyPointsLedgerModule = class LoyaltyPointsLedgerModule {
};
exports.LoyaltyPointsLedgerModule = LoyaltyPointsLedgerModule;
exports.LoyaltyPointsLedgerModule = LoyaltyPointsLedgerModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([loyalty_points_ledger_entity_1.LoyaltyPointsLedger, key_account_entity_1.KeyAccount, key_account_ledger_entity_1.KeyAccountLedger, station_entity_1.Station])],
        controllers: [loyalty_points_ledger_controller_1.LoyaltyPointsLedgerController],
        providers: [loyalty_points_ledger_service_1.LoyaltyPointsLedgerService],
        exports: [loyalty_points_ledger_service_1.LoyaltyPointsLedgerService],
    })
], LoyaltyPointsLedgerModule);
//# sourceMappingURL=loyalty-points-ledger.module.js.map