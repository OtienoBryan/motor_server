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
exports.FuelPricesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fuel_price_entity_1 = require("../entities/fuel-price.entity");
const station_entity_1 = require("../entities/station.entity");
let FuelPricesService = class FuelPricesService {
    fuelPriceRepository;
    stationRepository;
    constructor(fuelPriceRepository, stationRepository) {
        this.fuelPriceRepository = fuelPriceRepository;
        this.stationRepository = stationRepository;
    }
    async create(createFuelPriceDto) {
        console.log('⛽ [FuelPricesService] Creating new fuel price for station:', createFuelPriceDto.stationId);
        const station = await this.stationRepository.findOne({
            where: { id: createFuelPriceDto.stationId }
        });
        if (!station) {
            throw new common_1.NotFoundException(`Station with ID ${createFuelPriceDto.stationId} not found`);
        }
        try {
            const fuelPrice = this.fuelPriceRepository.create({
                stationId: createFuelPriceDto.stationId,
                price: createFuelPriceDto.price,
                fuelType: createFuelPriceDto.fuelType || null,
                notes: createFuelPriceDto.notes || null,
            });
            const savedFuelPrice = await this.fuelPriceRepository.save(fuelPrice);
            console.log(`✅ [FuelPricesService] Fuel price created with ID: ${savedFuelPrice.id}`);
            station.price = createFuelPriceDto.price;
            await this.stationRepository.save(station);
            console.log(`✅ [FuelPricesService] Updated station ${station.id} price to ${createFuelPriceDto.price}`);
            const fuelPriceWithRelations = await this.fuelPriceRepository.findOne({
                where: { id: savedFuelPrice.id },
                relations: ['station']
            });
            if (fuelPriceWithRelations) {
                return fuelPriceWithRelations;
            }
            return savedFuelPrice;
        }
        catch (error) {
            console.error('❌ [FuelPricesService] Error creating fuel price:', error);
            throw error;
        }
    }
    async findByStation(stationId) {
        console.log(`⛽ [FuelPricesService] Finding fuel prices for station: ${stationId}`);
        const fuelPrices = await this.fuelPriceRepository.find({
            where: { stationId },
            relations: ['station'],
            order: { created_at: 'DESC' },
        });
        console.log(`✅ [FuelPricesService] Found ${fuelPrices.length} fuel prices`);
        return fuelPrices;
    }
    async findLatestByStation(stationId) {
        console.log(`⛽ [FuelPricesService] Finding latest fuel price for station: ${stationId}`);
        const fuelPrice = await this.fuelPriceRepository.findOne({
            where: { stationId },
            relations: ['station'],
            order: { created_at: 'DESC' },
        });
        return fuelPrice;
    }
    async findOne(id) {
        console.log(`⛽ [FuelPricesService] Finding fuel price by ID: ${id}`);
        const fuelPrice = await this.fuelPriceRepository.findOne({
            where: { id },
            relations: ['station']
        });
        if (!fuelPrice) {
            console.log(`❌ [FuelPricesService] Fuel price with ID ${id} not found`);
            throw new common_1.NotFoundException(`Fuel price with ID ${id} not found`);
        }
        console.log(`✅ [FuelPricesService] Fuel price found: ${fuelPrice.id}`);
        return fuelPrice;
    }
    async update(id, updateFuelPriceDto) {
        console.log(`⛽ [FuelPricesService] Updating fuel price with ID: ${id}`);
        console.log('⛽ [FuelPricesService] Update data:', JSON.stringify(updateFuelPriceDto, null, 2));
        const fuelPrice = await this.fuelPriceRepository.findOne({
            where: { id },
            relations: ['station']
        });
        if (!fuelPrice) {
            throw new common_1.NotFoundException(`Fuel price with ID ${id} not found`);
        }
        Object.assign(fuelPrice, updateFuelPriceDto);
        const updatedFuelPrice = await this.fuelPriceRepository.save(fuelPrice);
        console.log(`✅ [FuelPricesService] Fuel price updated: ${updatedFuelPrice.id}`);
        if (updateFuelPriceDto.price !== undefined) {
            const latestPrice = await this.findLatestByStation(fuelPrice.stationId);
            if (latestPrice && latestPrice.id === id) {
                const station = await this.stationRepository.findOne({
                    where: { id: fuelPrice.stationId }
                });
                if (station) {
                    station.price = updateFuelPriceDto.price;
                    await this.stationRepository.save(station);
                    console.log(`✅ [FuelPricesService] Updated station ${station.id} price to ${updateFuelPriceDto.price}`);
                }
            }
        }
        const fuelPriceWithRelations = await this.fuelPriceRepository.findOne({
            where: { id: updatedFuelPrice.id },
            relations: ['station']
        });
        if (fuelPriceWithRelations) {
            return fuelPriceWithRelations;
        }
        return updatedFuelPrice;
    }
    async remove(id) {
        console.log(`⛽ [FuelPricesService] Deleting fuel price with ID: ${id}`);
        const fuelPrice = await this.fuelPriceRepository.findOne({
            where: { id },
            relations: ['station']
        });
        if (!fuelPrice) {
            throw new common_1.NotFoundException(`Fuel price with ID ${id} not found`);
        }
        const stationId = fuelPrice.stationId;
        await this.fuelPriceRepository.remove(fuelPrice);
        console.log(`✅ [FuelPricesService] Fuel price deleted: ${fuelPrice.id}`);
        const latestPrice = await this.findLatestByStation(stationId);
        const station = await this.stationRepository.findOne({
            where: { id: stationId }
        });
        if (station) {
            station.price = latestPrice ? latestPrice.price : null;
            await this.stationRepository.save(station);
            console.log(`✅ [FuelPricesService] Updated station ${station.id} price to ${latestPrice ? latestPrice.price : 'null'}`);
        }
    }
};
exports.FuelPricesService = FuelPricesService;
exports.FuelPricesService = FuelPricesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fuel_price_entity_1.FuelPrice)),
    __param(1, (0, typeorm_1.InjectRepository)(station_entity_1.Station)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FuelPricesService);
//# sourceMappingURL=fuel-prices.service.js.map