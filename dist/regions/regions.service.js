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
exports.RegionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const region_entity_1 = require("../entities/region.entity");
const country_entity_1 = require("../entities/country.entity");
let RegionsService = class RegionsService {
    regionRepository;
    countryRepository;
    constructor(regionRepository, countryRepository) {
        this.regionRepository = regionRepository;
        this.countryRepository = countryRepository;
    }
    async findAll() {
        console.log('🌍 [RegionsService] Finding all regions');
        const regions = await this.regionRepository.find({
            relations: ['country'],
            order: { name: 'ASC' },
        });
        console.log(`✅ [RegionsService] Found ${regions.length} regions`);
        return regions;
    }
    async findOne(id) {
        console.log(`🌍 [RegionsService] Finding region by ID: ${id}`);
        const region = await this.regionRepository.findOne({
            where: { id },
            relations: ['country']
        });
        if (!region) {
            console.log(`❌ [RegionsService] Region with ID ${id} not found`);
            throw new common_1.NotFoundException(`Region with ID ${id} not found`);
        }
        console.log(`✅ [RegionsService] Region found: ${region.name}`);
        return region;
    }
    async create(createRegionDto) {
        console.log('🌍 [RegionsService] Creating new region:', createRegionDto.name);
        console.log('🌍 [RegionsService] DTO data:', JSON.stringify(createRegionDto, null, 2));
        const country = await this.countryRepository.findOne({
            where: { id: createRegionDto.countryId }
        });
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID ${createRegionDto.countryId} not found`);
        }
        try {
            const region = this.regionRepository.create({
                name: createRegionDto.name,
                countryId: createRegionDto.countryId,
                status: createRegionDto.status ?? 1,
            });
            const savedRegion = await this.regionRepository.save(region);
            console.log(`✅ [RegionsService] Region created with ID: ${savedRegion.id}`);
            const regionWithRelations = await this.regionRepository.findOne({
                where: { id: savedRegion.id },
                relations: ['country']
            });
            if (regionWithRelations) {
                return regionWithRelations;
            }
            return savedRegion;
        }
        catch (error) {
            console.error('❌ [RegionsService] Error creating region:', error);
            throw error;
        }
    }
    async update(id, updateRegionDto) {
        console.log(`🌍 [RegionsService] Updating region with ID: ${id}`);
        console.log('🌍 [RegionsService] Update data:', JSON.stringify(updateRegionDto, null, 2));
        const region = await this.regionRepository.findOne({ where: { id } });
        if (!region) {
            throw new common_1.NotFoundException(`Region with ID ${id} not found`);
        }
        if (updateRegionDto.countryId !== undefined) {
            const country = await this.countryRepository.findOne({
                where: { id: updateRegionDto.countryId }
            });
            if (!country) {
                throw new common_1.NotFoundException(`Country with ID ${updateRegionDto.countryId} not found`);
            }
        }
        Object.assign(region, updateRegionDto);
        const updatedRegion = await this.regionRepository.save(region);
        console.log(`✅ [RegionsService] Region updated: ${updatedRegion.name}`);
        const regionWithRelations = await this.regionRepository.findOne({
            where: { id: updatedRegion.id },
            relations: ['country']
        });
        if (regionWithRelations) {
            return regionWithRelations;
        }
        return updatedRegion;
    }
    async remove(id) {
        console.log(`🌍 [RegionsService] Deleting region with ID: ${id}`);
        const region = await this.regionRepository.findOne({ where: { id } });
        if (!region) {
            throw new common_1.NotFoundException(`Region with ID ${id} not found`);
        }
        await this.regionRepository.remove(region);
        console.log(`✅ [RegionsService] Region deleted: ${region.name}`);
    }
};
exports.RegionsService = RegionsService;
exports.RegionsService = RegionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(region_entity_1.Region)),
    __param(1, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RegionsService);
//# sourceMappingURL=regions.service.js.map