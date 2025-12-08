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
exports.KeyAccountLedger = exports.KeyAccountTransactionType = void 0;
const typeorm_1 = require("typeorm");
const key_account_entity_1 = require("./key-account.entity");
const vehicle_entity_1 = require("./vehicle.entity");
const station_entity_1 = require("./station.entity");
var KeyAccountTransactionType;
(function (KeyAccountTransactionType) {
    KeyAccountTransactionType["SALE"] = "SALE";
    KeyAccountTransactionType["PAYMENT"] = "PAYMENT";
    KeyAccountTransactionType["ADJUSTMENT"] = "ADJUSTMENT";
})(KeyAccountTransactionType || (exports.KeyAccountTransactionType = KeyAccountTransactionType = {}));
let KeyAccountLedger = class KeyAccountLedger {
    id;
    keyAccountId;
    keyAccount;
    vehicleId;
    vehicle;
    stationId;
    station;
    transactionDate;
    transactionType;
    quantity;
    unitPrice;
    totalAmount;
    debit;
    credit;
    balance;
    referenceNumber;
    description;
    notes;
    createdBy;
    createdAt;
    updatedAt;
};
exports.KeyAccountLedger = KeyAccountLedger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'key_account_id' }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "keyAccountId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => key_account_entity_1.KeyAccount),
    (0, typeorm_1.JoinColumn)({ name: 'key_account_id' }),
    __metadata("design:type", key_account_entity_1.KeyAccount)
], KeyAccountLedger.prototype, "keyAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_id', nullable: true }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "vehicleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle),
    (0, typeorm_1.JoinColumn)({ name: 'vehicle_id' }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], KeyAccountLedger.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'station_id' }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "stationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => station_entity_1.Station),
    (0, typeorm_1.JoinColumn)({ name: 'station_id' }),
    __metadata("design:type", station_entity_1.Station)
], KeyAccountLedger.prototype, "station", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transaction_date', type: 'date' }),
    __metadata("design:type", Date)
], KeyAccountLedger.prototype, "transactionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_type',
        type: 'enum',
        enum: KeyAccountTransactionType,
    }),
    __metadata("design:type", String)
], KeyAccountLedger.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "debit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "credit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], KeyAccountLedger.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KeyAccountLedger.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], KeyAccountLedger.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", Number)
], KeyAccountLedger.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], KeyAccountLedger.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], KeyAccountLedger.prototype, "updatedAt", void 0);
exports.KeyAccountLedger = KeyAccountLedger = __decorate([
    (0, typeorm_1.Entity)('key_account_ledger')
], KeyAccountLedger);
//# sourceMappingURL=key-account-ledger.entity.js.map