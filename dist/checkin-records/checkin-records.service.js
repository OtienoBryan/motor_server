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
exports.CheckinRecordsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const checkin_record_entity_1 = require("../entities/checkin-record.entity");
let CheckinRecordsService = class CheckinRecordsService {
    checkinRecordsRepository;
    constructor(checkinRecordsRepository) {
        this.checkinRecordsRepository = checkinRecordsRepository;
    }
    async findAll(startDate, endDate, userId, stationId) {
        console.log('📋 [CheckinRecordsService] Finding records with filters:', {
            startDate,
            endDate,
            userId,
            stationId
        });
        const query = this.checkinRecordsRepository.createQueryBuilder('checkin')
            .leftJoinAndSelect('checkin.staff', 'staff')
            .leftJoinAndSelect('checkin.station', 'station')
            .orderBy('checkin.time_in', 'DESC');
        if (userId) {
            query.andWhere('checkin.user_id = :userId', { userId });
        }
        if (stationId) {
            query.andWhere('checkin.station_id = :stationId', { stationId });
        }
        if (startDate) {
            query.andWhere('DATE(checkin.time_in) >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('DATE(checkin.time_in) <= :endDate', { endDate });
        }
        const results = await query.getMany();
        console.log('✅ [CheckinRecordsService] Found records:', results.length);
        return results;
    }
    async findOne(id) {
        return this.checkinRecordsRepository.findOne({
            where: { id },
            relations: ['staff', 'station']
        });
    }
};
exports.CheckinRecordsService = CheckinRecordsService;
exports.CheckinRecordsService = CheckinRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(checkin_record_entity_1.CheckinRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CheckinRecordsService);
//# sourceMappingURL=checkin-records.service.js.map