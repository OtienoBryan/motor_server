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
exports.LoyaltyPointsLedger = void 0;
const typeorm_1 = require("typeorm");
const key_account_entity_1 = require("./key-account.entity");
const sale_entity_1 = require("./sale.entity");
let LoyaltyPointsLedger = class LoyaltyPointsLedger {
    id;
    keyAccountId;
    keyAccount;
    saleId;
    sale;
    transactionDate;
    litres;
    pointsRate;
    pointsAwarded;
    balanceAfter;
    referenceNumber;
    description;
    createdBy;
    createdAt;
};
exports.LoyaltyPointsLedger = LoyaltyPointsLedger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LoyaltyPointsLedger.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'key_account_id' }),
    __metadata("design:type", Number)
], LoyaltyPointsLedger.prototype, "keyAccountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => key_account_entity_1.KeyAccount),
    (0, typeorm_1.JoinColumn)({ name: 'key_account_id' }),
    __metadata("design:type", key_account_entity_1.KeyAccount)
], LoyaltyPointsLedger.prototype, "keyAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sale_id', nullable: true }),
    __metadata("design:type", Number)
], LoyaltyPointsLedger.prototype, "saleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_entity_1.Sale),
    (0, typeorm_1.JoinColumn)({ name: 'sale_id' }),
    __metadata("design:type", sale_entity_1.Sale)
], LoyaltyPointsLedger.prototype, "sale", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_date', type: 'datetime' }),
    __metadata("design:type", Date)
], LoyaltyPointsLedger.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LoyaltyPointsLedger.prototype, "litres", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'points_rate', type: 'decimal', precision: 10, scale: 2, default: 10 }),
    __metadata("design:type", Number)
], LoyaltyPointsLedger.prototype, "pointsRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'points_awarded', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LoyaltyPointsLedger.prototype, "pointsAwarded", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_after', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], LoyaltyPointsLedger.prototype, "balanceAfter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], LoyaltyPointsLedger.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LoyaltyPointsLedger.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], LoyaltyPointsLedger.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], LoyaltyPointsLedger.prototype, "createdAt", void 0);
exports.LoyaltyPointsLedger = LoyaltyPointsLedger = __decorate([
    (0, typeorm_1.Entity)('loyalty_points_ledger')
], LoyaltyPointsLedger);
//# sourceMappingURL=loyalty-points-ledger.entity.js.map