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
exports.StationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const station_entity_1 = require("../entities/station.entity");
const region_entity_1 = require("../entities/region.entity");
let StationsService = class StationsService {
    stationRepository;
    regionRepository;
    constructor(stationRepository, regionRepository) {
        this.stationRepository = stationRepository;
        this.regionRepository = regionRepository;
    }
    async findAll() {
        console.log('🚉 [StationsService] Finding all stations');
        const stations = await this.stationRepository.find({
            relations: ['region'],
            order: { name: 'ASC' },
        });
        console.log(`✅ [StationsService] Found ${stations.length} stations`);
        return stations;
    }
    async findOne(id) {
        console.log(`🚉 [StationsService] Finding station by ID: ${id}`);
        const station = await this.stationRepository.findOne({
            where: { id },
            relations: ['region']
        });
        if (!station) {
            console.log(`❌ [StationsService] Station with ID ${id} not found`);
            throw new common_1.NotFoundException(`Station with ID ${id} not found`);
        }
        console.log(`✅ [StationsService] Station found: ${station.name}`);
        return station;
    }
    async create(createStationDto) {
        console.log('🚉 [StationsService] Creating new station:', createStationDto.name);
        console.log('🚉 [StationsService] DTO data:', JSON.stringify(createStationDto, null, 2));
        const region = await this.regionRepository.findOne({
            where: { id: createStationDto.regionId }
        });
        if (!region) {
            throw new common_1.NotFoundException(`Region with ID ${createStationDto.regionId} not found`);
        }
        try {
            const station = this.stationRepository.create({
                name: createStationDto.name,
                regionId: createStationDto.regionId,
                contact: createStationDto.contact || null,
            });
            const savedStation = await this.stationRepository.save(station);
            console.log(`✅ [StationsService] Station created with ID: ${savedStation.id}`);
            const stationWithRelations = await this.stationRepository.findOne({
                where: { id: savedStation.id },
                relations: ['region']
            });
            if (stationWithRelations) {
                return stationWithRelations;
            }
            return savedStation;
        }
        catch (error) {
            console.error('❌ [StationsService] Error creating station:', error);
            throw error;
        }
    }
    async update(id, updateStationDto) {
        console.log(`🚉 [StationsService] Updating station with ID: ${id}`);
        console.log('🚉 [StationsService] Update data:', JSON.stringify(updateStationDto, null, 2));
        const station = await this.stationRepository.findOne({ where: { id } });
        if (!station) {
            throw new common_1.NotFoundException(`Station with ID ${id} not found`);
        }
        if (updateStationDto.regionId !== undefined) {
            const region = await this.regionRepository.findOne({
                where: { id: updateStationDto.regionId }
            });
            if (!region) {
                throw new common_1.NotFoundException(`Region with ID ${updateStationDto.regionId} not found`);
            }
        }
        Object.assign(station, updateStationDto);
        const updatedStation = await this.stationRepository.save(station);
        console.log(`✅ [StationsService] Station updated: ${updatedStation.name}`);
        const stationWithRelations = await this.stationRepository.findOne({
            where: { id: updatedStation.id },
            relations: ['region']
        });
        if (stationWithRelations) {
            return stationWithRelations;
        }
        return updatedStation;
    }
    async remove(id) {
        console.log(`🚉 [StationsService] Deleting station with ID: ${id}`);
        const station = await this.stationRepository.findOne({ where: { id } });
        if (!station) {
            throw new common_1.NotFoundException(`Station with ID ${id} not found`);
        }
        await this.stationRepository.remove(station);
        console.log(`✅ [StationsService] Station deleted: ${station.name}`);
    }
};
exports.StationsService = StationsService;
exports.StationsService = StationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(station_entity_1.Station)),
    __param(1, (0, typeorm_1.InjectRepository)(region_entity_1.Region)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StationsService);
//# sourceMappingURL=stations.service.js.map