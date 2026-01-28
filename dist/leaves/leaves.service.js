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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeavesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_leave_entity_1 = require("../entities/staff-leave.entity");
let LeavesService = class LeavesService {
    leavesRepository;
    constructor(leavesRepository) {
        this.leavesRepository = leavesRepository;
    }
    async findAll(staffId, status, startDate, endDate) {
        console.log('🏖️ [LeavesService] Finding leaves with filters:', {
            staffId,
            status,
            startDate,
            endDate
        });
        const query = this.leavesRepository.createQueryBuilder('leave')
            .leftJoinAndSelect('leave.staff', 'staff')
            .leftJoinAndSelect('leave.approver', 'approver')
            .orderBy('leave.applied_at', 'DESC');
        if (staffId) {
            query.andWhere('leave.staff_id = :staffId', { staffId });
        }
        if (status) {
            query.andWhere('leave.status = :status', { status });
        }
        if (startDate) {
            query.andWhere('leave.start_date >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('leave.end_date <= :endDate', { endDate });
        }
        const results = await query.getMany();
        console.log('✅ [LeavesService] Found leaves:', results.length);
        return results;
    }
    async findOne(id) {
        return this.leavesRepository.findOne({
            where: { id },
            relations: ['staff', 'approver']
        });
    }
    async updateStatus(id, status, approvedBy) {
        const leave = await this.leavesRepository.findOne({ where: { id } });
        if (!leave) {
            throw new Error('Leave request not found');
        }
        leave.status = status;
        if (approvedBy) {
            leave.approvedBy = approvedBy;
        }
        return this.leavesRepository.save(leave);
    }
};
exports.LeavesService = LeavesService;
exports.LeavesService = LeavesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_leave_entity_1.StaffLeave)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LeavesService);
//# sourceMappingURL=leaves.service.js.map