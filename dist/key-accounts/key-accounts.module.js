"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyAccountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const key_accounts_service_1 = require("./key-accounts.service");
const key_accounts_controller_1 = require("./key-accounts.controller");
const key_account_entity_1 = require("../entities/key-account.entity");
let KeyAccountsModule = class KeyAccountsModule {
};
exports.KeyAccountsModule = KeyAccountsModule;
exports.KeyAccountsModule = KeyAccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([key_account_entity_1.KeyAccount])],
        controllers: [key_accounts_controller_1.KeyAccountsController],
        providers: [key_accounts_service_1.KeyAccountsService],
        exports: [key_accounts_service_1.KeyAccountsService],
    })
], KeyAccountsModule);
//# sourceMappingURL=key-accounts.module.js.map