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
exports.Vehicle = void 0;
const typeorm_1 = require("typeorm");
const key_account_entity_1 = require("./key-account.entity");
let Vehicle = class Vehicle {
    id;
    key_account_id;
    keyAccount;
    registration_number;
    model;
    driver_name;
    driver_contact;
    created_at;
    updated_at;
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'key_account_id', type: 'int' }),
    __metadata("design:type", Number)
], Vehicle.prototype, "key_account_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => key_account_entity_1.KeyAccount),
    (0, typeorm_1.JoinColumn)({ name: 'key_account_id' }),
    __metadata("design:type", key_account_entity_1.KeyAccount)
], Vehicle.prototype, "keyAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Vehicle.prototype, "registration_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Vehicle.prototype, "driver_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Vehicle.prototype, "driver_contact", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Vehicle.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Vehicle.prototype, "updated_at", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)('Vehicles')
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map