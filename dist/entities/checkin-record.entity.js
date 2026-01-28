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
exports.CheckinRecord = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
const station_entity_1 = require("./station.entity");
let CheckinRecord = class CheckinRecord {
    id;
    userId;
    userName;
    stationId;
    stationName;
    checkInLatitude;
    checkInLongitude;
    checkOutLatitude;
    checkOutLongitude;
    address;
    status;
    timeIn;
    timeOut;
    qrData;
    createdAt;
    updatedAt;
    staff;
    station;
};
exports.CheckinRecord = CheckinRecord;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_name', nullable: true }),
    __metadata("design:type", String)
], CheckinRecord.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'station_id' }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "stationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'station_name', nullable: true }),
    __metadata("design:type", String)
], CheckinRecord.prototype, "stationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "checkInLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_in_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "checkInLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_out_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "checkOutLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'check_out_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "checkOutLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CheckinRecord.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], CheckinRecord.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_in', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CheckinRecord.prototype, "timeIn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_out', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CheckinRecord.prototype, "timeOut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_data', nullable: true }),
    __metadata("design:type", String)
], CheckinRecord.prototype, "qrData", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CheckinRecord.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CheckinRecord.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], CheckinRecord.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => station_entity_1.Station, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'station_id' }),
    __metadata("design:type", station_entity_1.Station)
], CheckinRecord.prototype, "station", void 0);
exports.CheckinRecord = CheckinRecord = __decorate([
    (0, typeorm_1.Entity)('checkin_records')
], CheckinRecord);
//# sourceMappingURL=checkin-record.entity.js.map