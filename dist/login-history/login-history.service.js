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
exports.LoginHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const login_history_entity_1 = require("../entities/login-history.entity");
const staff_entity_1 = require("../entities/staff.entity");
let LoginHistoryService = class LoginHistoryService {
    loginHistoryRepository;
    staffRepository;
    constructor(loginHistoryRepository, staffRepository) {
        this.loginHistoryRepository = loginHistoryRepository;
        this.staffRepository = staffRepository;
    }
    async findAll(startDate, endDate, userId) {
        console.log('📋 [LoginHistoryService] Finding all login history', { startDate, endDate, userId });
        try {
            const queryBuilder = this.loginHistoryRepository.createQueryBuilder('lh');
            if (userId) {
                queryBuilder.andWhere('lh.userId = :userId', { userId });
            }
            if (startDate) {
                queryBuilder.andWhere('lh.sessionStart >= :startDate', { startDate: `${startDate} 00:00:00` });
            }
            if (endDate) {
                queryBuilder.andWhere('lh.sessionStart <= :endDate', { endDate: `${endDate} 23:59:59` });
            }
            queryBuilder.orderBy('lh.sessionStart', 'DESC');
            const loginHistory = await queryBuilder.getMany();
            console.log(`📋 [LoginHistoryService] Raw query returned ${loginHistory.length} records`);
            const userIds = [...new Set(loginHistory.map(lh => lh.userId).filter(id => id !== null && id !== undefined))];
            const staffMap = new Map();
            if (userIds.length > 0) {
                const staffMembers = await this.staffRepository.find({
                    where: userIds.map(id => ({ id })),
                });
                staffMembers.forEach(staff => {
                    staffMap.set(staff.id, staff);
                });
            }
            const result = loginHistory.map(lh => {
                let calculatedDuration = null;
                if (lh.sessionStart && lh.sessionEnd) {
                    try {
                        const start = new Date(lh.sessionStart);
                        const end = new Date(lh.sessionEnd);
                        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
                            calculatedDuration = Math.floor((end.getTime() - start.getTime()) / 1000);
                        }
                    }
                    catch (error) {
                        console.warn(`⚠️ [LoginHistoryService] Error calculating duration for entry ${lh.id}:`, error);
                    }
                }
                return {
                    ...lh,
                    duration: calculatedDuration,
                    staff: lh.userId ? staffMap.get(lh.userId) || null : null,
                };
            });
            console.log(`✅ [LoginHistoryService] Found ${result.length} login history entries`);
            return result;
        }
        catch (error) {
            console.error('❌ [LoginHistoryService] Error finding login history:', error);
            throw error;
        }
    }
    async findByUserId(userId, startDate, endDate) {
        console.log(`📋 [LoginHistoryService] Finding login history for userId: ${userId}`, { startDate, endDate });
        try {
            const queryBuilder = this.loginHistoryRepository.createQueryBuilder('lh')
                .where('lh.userId = :userId', { userId });
            if (startDate) {
                queryBuilder.andWhere('lh.sessionStart >= :startDate', { startDate: `${startDate} 00:00:00` });
            }
            if (endDate) {
                queryBuilder.andWhere('lh.sessionStart <= :endDate', { endDate: `${endDate} 23:59:59` });
            }
            queryBuilder.orderBy('lh.sessionStart', 'DESC');
            const loginHistory = await queryBuilder.getMany();
            const staff = await this.staffRepository.findOne({ where: { id: userId } });
            return loginHistory.map(lh => {
                let calculatedDuration = null;
                if (lh.sessionStart && lh.sessionEnd) {
                    try {
                        const start = new Date(lh.sessionStart);
                        const end = new Date(lh.sessionEnd);
                        if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
                            calculatedDuration = Math.floor((end.getTime() - start.getTime()) / 1000);
                        }
                    }
                    catch (error) {
                        console.warn(`⚠️ [LoginHistoryService] Error calculating duration for entry ${lh.id}:`, error);
                    }
                }
                return {
                    ...lh,
                    duration: calculatedDuration,
                    staff: staff || null,
                };
            });
        }
        catch (error) {
            console.error(`❌ [LoginHistoryService] Error finding login history for userId ${userId}:`, error);
            throw error;
        }
    }
};
exports.LoginHistoryService = LoginHistoryService;
exports.LoginHistoryService = LoginHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_history_entity_1.LoginHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LoginHistoryService);
//# sourceMappingURL=login-history.service.js.map