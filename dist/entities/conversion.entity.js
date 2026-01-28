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
exports.Conversion = exports.FuelType = void 0;
const typeorm_1 = require("typeorm");
var FuelType;
(function (FuelType) {
    FuelType["PETROL"] = "petrol";
    FuelType["DIESEL"] = "diesel";
    FuelType["HYBRID"] = "hybrid";
})(FuelType || (exports.FuelType = FuelType = {}));
let Conversion = class Conversion {
    id;
    ownerFullName;
    nationalId;
    passportId;
    contact;
    email;
    vehicleRegistration;
    make;
    model;
    yearOfManufacture;
    engineCapacity;
    vinChassisNumber;
    currentFuelType;
    logbookNumber;
    scheduledDate;
    status;
    comment;
    conversionDescription;
    conversionDate;
    createdBy;
    createdAt;
    updatedAt;
};
exports.Conversion = Conversion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Conversion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_full_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Conversion.prototype, "ownerFullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'national_id', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "nationalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passport_id', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "passportId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Conversion.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_registration', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Conversion.prototype, "vehicleRegistration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "make", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'year_of_manufacture', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Conversion.prototype, "yearOfManufacture", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'engine_capacity', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Conversion.prototype, "engineCapacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vin_chassis_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "vinChassisNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_fuel_type',
        type: 'enum',
        enum: FuelType,
        default: FuelType.PETROL,
    }),
    __metadata("design:type", String)
], Conversion.prototype, "currentFuelType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'logbook_number', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "logbookNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scheduled_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Conversion.prototype, "scheduledDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: ['pending', 'approved', 'declined', 'completed'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Conversion.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversion_description', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Conversion.prototype, "conversionDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversion_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Conversion.prototype, "conversionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Conversion.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Conversion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Conversion.prototype, "updatedAt", void 0);
exports.Conversion = Conversion = __decorate([
    (0, typeorm_1.Entity)('conversions')
], Conversion);
//# sourceMappingURL=conversion.entity.js.map