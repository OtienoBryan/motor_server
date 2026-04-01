"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerCardsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_card_entity_1 = require("../entities/customer-card.entity");
const customer_cards_service_1 = require("./customer-cards.service");
const customer_cards_controller_1 = require("./customer-cards.controller");
let CustomerCardsModule = class CustomerCardsModule {
};
exports.CustomerCardsModule = CustomerCardsModule;
exports.CustomerCardsModule = CustomerCardsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([customer_card_entity_1.CustomerCard])],
        controllers: [customer_cards_controller_1.CustomerCardsController],
        providers: [customer_cards_service_1.CustomerCardsService],
        exports: [customer_cards_service_1.CustomerCardsService],
    })
], CustomerCardsModule);
//# sourceMappingURL=customer-cards.module.js.map