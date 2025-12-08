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
exports.ConversionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversion_entity_1 = require("../entities/conversion.entity");
let ConversionsService = class ConversionsService {
    conversionRepository;
    constructor(conversionRepository) {
        this.conversionRepository = conversionRepository;
    }
    async create(createDto) {
        console.log('🔧 [ConversionsService] Creating conversion');
        console.log('🔧 [ConversionsService] Request data:', JSON.stringify(createDto, null, 2));
        if (!createDto.nationalId && !createDto.passportId) {
            throw new Error('Either National ID or Passport ID must be provided');
        }
        const conversionData = {
            ...createDto,
            status: 'pending',
        };
        const conversion = this.conversionRepository.create(conversionData);
        const savedConversion = await this.conversionRepository.save(conversion);
        console.log(`✅ [ConversionsService] Conversion created with ID: ${savedConversion.id}`);
        return savedConversion;
    }
    async findAll() {
        console.log('🔧 [ConversionsService] Finding all conversions');
        const conversions = await this.conversionRepository.find({
            order: { createdAt: 'DESC' },
        });
        console.log(`✅ [ConversionsService] Found ${conversions.length} conversions`);
        return conversions;
    }
    async findOne(id) {
        console.log(`🔧 [ConversionsService] Finding conversion by ID: ${id}`);
        const conversion = await this.conversionRepository.findOne({
            where: { id },
        });
        if (!conversion) {
            throw new Error(`Conversion with ID ${id} not found`);
        }
        console.log(`✅ [ConversionsService] Conversion found`);
        return conversion;
    }
    async update(id, updateDto) {
        console.log(`🔧 [ConversionsService] Updating conversion ID: ${id}`);
        const conversion = await this.conversionRepository.findOne({
            where: { id },
        });
        if (!conversion) {
            throw new Error(`Conversion with ID ${id} not found`);
        }
        Object.assign(conversion, updateDto);
        const updatedConversion = await this.conversionRepository.save(conversion);
        console.log(`✅ [ConversionsService] Conversion updated`);
        return updatedConversion;
    }
};
exports.ConversionsService = ConversionsService;
exports.ConversionsService = ConversionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversion_entity_1.Conversion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConversionsService);
//# sourceMappingURL=conversions.service.js.map