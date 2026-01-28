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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyAccountFuelPrice = void 0;
const typeorm_1 = require("typeorm");
const key_account_entity_1 = require("./key-account.entity");
const staff_entity_1 = require("./staff.entity");
let KeyAccountFuelPrice = class KeyAccountFuelPrice {
    id;
    keyAccountId;
    keyAccount;
    price;
    notes;
    updatedBy;
    updatedByStaff;
    created_at;
};
exports.KeyAccountFuelPrice = KeyAccountFuelPrice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KeyAccountFuelPrice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'keyAccountId', type: 'int' }),
    __metadata("design:type", Number)
], KeyAccountFuelPrice.prototype, "keyAccountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => key_account_entity_1.KeyAccount),
    (0, typeorm_1.JoinColumn)({ name: 'keyAccountId' }),
    __metadata("design:type", key_account_entity_1.KeyAccount)
], KeyAccountFuelPrice.prototype, "keyAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], KeyAccountFuelPrice.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], KeyAccountFuelPrice.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updatedBy', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], KeyAccountFuelPrice.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff),
    (0, typeorm_1.JoinColumn)({ name: 'updatedBy' }),
    __metadata("design:type", staff_entity_1.Staff)
], KeyAccountFuelPrice.prototype, "updatedByStaff", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KeyAccountFuelPrice.prototype, "created_at", void 0);
exports.KeyAccountFuelPrice = KeyAccountFuelPrice = __decorate([
    (0, typeorm_1.Entity)('KeyAccountFuelPrices')
], KeyAccountFuelPrice);
//# sourceMappingURL=key-account-fuel-price.entity.js.map