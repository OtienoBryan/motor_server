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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../entities/sale.entity");
const station_entity_1 = require("../entities/station.entity");
let SalesService = class SalesService {
    saleRepository;
    stationRepository;
    constructor(saleRepository, stationRepository) {
        this.saleRepository = saleRepository;
        this.stationRepository = stationRepository;
    }
    async create(createDto) {
        console.log('💰 [SalesService] Creating sale');
        const station = await this.stationRepository.findOne({
            where: { id: createDto.stationId }
        });
        if (!station) {
            throw new common_1.NotFoundException(`Station with ID ${createDto.stationId} not found`);
        }
        const saleData = {
            stationId: createDto.stationId,
            clientType: createDto.clientType,
            quantity: createDto.quantity,
            unitPrice: createDto.unitPrice,
            totalAmount: createDto.totalAmount,
            saleDate: new Date(createDto.saleDate),
        };
        if (createDto.keyAccountId) {
            saleData.keyAccountId = createDto.keyAccountId;
        }
        if (createDto.vehicleId) {
            saleData.vehicleId = createDto.vehicleId;
        }
        if (createDto.referenceNumber) {
            saleData.referenceNumber = createDto.referenceNumber;
        }
        if (createDto.notes) {
            saleData.notes = createDto.notes;
        }
        if (createDto.createdBy) {
            saleData.createdBy = createDto.createdBy;
        }
        const sale = this.saleRepository.create(saleData);
        const savedSale = await this.saleRepository.save(sale);
        console.log(`✅ [SalesService] Sale created with ID: ${savedSale.id}`);
        const saleWithRelations = await this.saleRepository.findOne({
            where: { id: savedSale.id },
            relations: ['station', 'keyAccount', 'vehicle']
        });
        return saleWithRelations || savedSale;
    }
    async findAll(stationId, keyAccountId) {
        console.log('💰 [SalesService] Finding all sales');
        const where = {};
        if (stationId) {
            where.stationId = stationId;
        }
        if (keyAccountId) {
            where.keyAccountId = keyAccountId;
        }
        const sales = await this.saleRepository.find({
            where,
            relations: ['station', 'keyAccount', 'vehicle'],
            order: { saleDate: 'DESC' },
        });
        console.log(`✅ [SalesService] Found ${sales.length} sales`);
        return sales;
    }
    async findOne(id) {
        console.log(`💰 [SalesService] Finding sale by ID: ${id}`);
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['station', 'keyAccount', 'vehicle']
        });
        if (!sale) {
            console.log(`❌ [SalesService] Sale with ID ${id} not found`);
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        console.log(`✅ [SalesService] Sale found`);
        return sale;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(station_entity_1.Station)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SalesService);
//# sourceMappingURL=sales.service.js.map