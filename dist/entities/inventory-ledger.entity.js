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
exports.InventoryLedger = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
const station_entity_1 = require("./station.entity");
var TransactionType;
(function (TransactionType) {
    TransactionType["IN"] = "IN";
    TransactionType["OUT"] = "OUT";
    TransactionType["ADJUSTMENT"] = "ADJUSTMENT";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let InventoryLedger = class InventoryLedger {
    id;
    stationId;
    station;
    transactionType;
    quantityIn;
    quantityOut;
    balance;
    quantity;
    previousQuantity;
    newQuantity;
    referenceNumber;
    notes;
    createdBy;
    created_at;
};
exports.InventoryLedger = InventoryLedger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InventoryLedger.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stationId', type: 'int' }),
    __metadata("design:type", Number)
], InventoryLedger.prototype, "stationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => station_entity_1.Station),
    (0, typeorm_1.JoinColumn)({ name: 'stationId' }),
    __metadata("design:type", station_entity_1.Station)
], InventoryLedger.prototype, "station", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransactionType,
        name: 'transactionType',
        nullable: true
    }),
    __metadata("design:type", String)
], InventoryLedger.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0, name: 'quantityIn' }),
    __metadata("design:type", Number)
], InventoryLedger.prototype, "quantityIn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0, name: 'quantityOut' }),
    __metadata("design:type", Number)
], InventoryLedger.prototype, "quantityOut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, name: 'balance' }),
    __metadata("design:type", Number)
], InventoryLedger.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], InventoryLedger.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0, name: 'previousQuantity' }),
    __metadata("design:type", Number)
], InventoryLedger.prototype, "previousQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'newQuantity' }),
    __metadata("design:type", Number)
], InventoryLedger.prototype, "newQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, name: 'referenceNumber' }),
    __metadata("design:type", Object)
], InventoryLedger.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], InventoryLedger.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true, name: 'createdBy' }),
    __metadata("design:type", Object)
], InventoryLedger.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InventoryLedger.prototype, "created_at", void 0);
exports.InventoryLedger = InventoryLedger = __decorate([
    (0, typeorm_1.Entity)('InventoryLedger')
], InventoryLedger);
//# sourceMappingURL=inventory-ledger.entity.js.map