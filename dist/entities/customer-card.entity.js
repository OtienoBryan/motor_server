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
exports.CustomerCard = void 0;
const typeorm_1 = require("typeorm");
let CustomerCard = class CustomerCard {
    id;
    key_account_id;
    account_type;
    card_format;
    status;
    last_four;
    created_at;
    pan_full;
    expiry_mm_yy;
    cvc;
    points_history;
    amount_balance;
};
exports.CustomerCard = CustomerCard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CustomerCard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'key_account_id', type: 'int' }),
    __metadata("design:type", Number)
], CustomerCard.prototype, "key_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_type', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CustomerCard.prototype, "account_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'card_format', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], CustomerCard.prototype, "card_format", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'varchar', length: 32, default: 'pending' }),
    __metadata("design:type", String)
], CustomerCard.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_four', type: 'varchar', length: 4, nullable: true }),
    __metadata("design:type", Object)
], CustomerCard.prototype, "last_four", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], CustomerCard.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pan_full', type: 'varchar', length: 19, nullable: true, select: false }),
    __metadata("design:type", Object)
], CustomerCard.prototype, "pan_full", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expiry_mm_yy', type: 'varchar', length: 5, nullable: true }),
    __metadata("design:type", Object)
], CustomerCard.prototype, "expiry_mm_yy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cvc', type: 'varchar', length: 4, nullable: true, select: false }),
    __metadata("design:type", Object)
], CustomerCard.prototype, "cvc", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'points_history', type: 'double', default: 0 }),
    __metadata("design:type", Number)
], CustomerCard.prototype, "points_history", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_balance', type: 'double', default: 0 }),
    __metadata("design:type", Number)
], CustomerCard.prototype, "amount_balance", void 0);
exports.CustomerCard = CustomerCard = __decorate([
    (0, typeorm_1.Entity)('customer_cards')
], CustomerCard);
//# sourceMappingURL=customer-card.entity.js.map