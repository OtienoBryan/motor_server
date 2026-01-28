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
exports.StaffLeave = void 0;
const typeorm_1 = require("typeorm");
const staff_entity_1 = require("./staff.entity");
let StaffLeave = class StaffLeave {
    id;
    staffId;
    leaveTypeId;
    startDate;
    endDate;
    reason;
    attachmentUrl;
    status;
    isHalfDay;
    approvedBy;
    appliedAt;
    updatedAt;
    staff;
    approver;
};
exports.StaffLeave = StaffLeave;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StaffLeave.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'staff_id' }),
    __metadata("design:type", Number)
], StaffLeave.prototype, "staffId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'leave_type_id' }),
    __metadata("design:type", Number)
], StaffLeave.prototype, "leaveTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", String)
], StaffLeave.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_date', type: 'date' }),
    __metadata("design:type", String)
], StaffLeave.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StaffLeave.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attachment_url', length: 500, nullable: true }),
    __metadata("design:type", String)
], StaffLeave.prototype, "attachmentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], StaffLeave.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_half_day', type: 'tinyint', default: 0 }),
    __metadata("design:type", Number)
], StaffLeave.prototype, "isHalfDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", Number)
], StaffLeave.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'applied_at' }),
    __metadata("design:type", Date)
], StaffLeave.prototype, "appliedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StaffLeave.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'staff_id' }),
    __metadata("design:type", staff_entity_1.Staff)
], StaffLeave.prototype, "staff", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => staff_entity_1.Staff, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by' }),
    __metadata("design:type", staff_entity_1.Staff)
], StaffLeave.prototype, "approver", void 0);
exports.StaffLeave = StaffLeave = __decorate([
    (0, typeorm_1.Entity)('staff_leaves')
], StaffLeave);
//# sourceMappingURL=staff-leave.entity.js.map