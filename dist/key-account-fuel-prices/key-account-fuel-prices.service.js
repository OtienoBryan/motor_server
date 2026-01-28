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
exports.KeyAccountFuelPricesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const key_account_fuel_price_entity_1 = require("../entities/key-account-fuel-price.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
const staff_entity_1 = require("../entities/staff.entity");
let KeyAccountFuelPricesService = class KeyAccountFuelPricesService {
    keyAccountFuelPriceRepository;
    keyAccountRepository;
    staffRepository;
    constructor(keyAccountFuelPriceRepository, keyAccountRepository, staffRepository) {
        this.keyAccountFuelPriceRepository = keyAccountFuelPriceRepository;
        this.keyAccountRepository = keyAccountRepository;
        this.staffRepository = staffRepository;
    }
    async create(createKeyAccountFuelPriceDto) {
        console.log('⛽ [KeyAccountFuelPricesService] Creating fuel price history entry');
        console.log('⛽ [KeyAccountFuelPricesService] DTO data:', JSON.stringify(createKeyAccountFuelPriceDto, null, 2));
        const keyAccount = await this.keyAccountRepository.findOne({
            where: { id: createKeyAccountFuelPriceDto.keyAccountId },
        });
        if (!keyAccount) {
            throw new common_1.NotFoundException(`Key account with ID ${createKeyAccountFuelPriceDto.keyAccountId} not found`);
        }
        const fuelPrice = this.keyAccountFuelPriceRepository.create({
            keyAccountId: createKeyAccountFuelPriceDto.keyAccountId,
            price: createKeyAccountFuelPriceDto.price,
            notes: createKeyAccountFuelPriceDto.notes || null,
            updatedBy: createKeyAccountFuelPriceDto.updatedBy || null,
        });
        const savedFuelPrice = await this.keyAccountFuelPriceRepository.save(fuelPrice);
        console.log(`✅ [KeyAccountFuelPricesService] Fuel price history entry created with ID: ${savedFuelPrice.id}`);
        return savedFuelPrice;
    }
    async findByKeyAccount(keyAccountId) {
        console.log(`⛽ [KeyAccountFuelPricesService] Finding fuel price history for key account: ${keyAccountId}`);
        const fuelPrices = await this.keyAccountFuelPriceRepository.find({
            where: { keyAccountId },
            order: { created_at: 'DESC' },
            relations: ['keyAccount', 'updatedByStaff'],
        });
        console.log(`✅ [KeyAccountFuelPricesService] Found ${fuelPrices.length} fuel price history entries`);
        return fuelPrices;
    }
    async findLatestByKeyAccount(keyAccountId) {
        console.log(`⛽ [KeyAccountFuelPricesService] Finding latest fuel price for key account: ${keyAccountId}`);
        const latestFuelPrice = await this.keyAccountFuelPriceRepository.findOne({
            where: { keyAccountId },
            order: { created_at: 'DESC' },
            relations: ['keyAccount', 'updatedByStaff'],
        });
        if (latestFuelPrice) {
            console.log(`✅ [KeyAccountFuelPricesService] Latest fuel price found: ${latestFuelPrice.price}`);
        }
        else {
            console.log(`ℹ️ [KeyAccountFuelPricesService] No fuel price history found for key account ${keyAccountId}`);
        }
        return latestFuelPrice;
    }
    async findOne(id) {
        console.log(`⛽ [KeyAccountFuelPricesService] Finding fuel price history entry by ID: ${id}`);
        const fuelPrice = await this.keyAccountFuelPriceRepository.findOne({
            where: { id },
            relations: ['keyAccount', 'updatedByStaff'],
        });
        if (!fuelPrice) {
            console.log(`❌ [KeyAccountFuelPricesService] Fuel price history entry with ID ${id} not found`);
            throw new common_1.NotFoundException(`Fuel price history entry with ID ${id} not found`);
        }
        console.log(`✅ [KeyAccountFuelPricesService] Fuel price history entry found`);
        return fuelPrice;
    }
    async update(id, updateKeyAccountFuelPriceDto) {
        console.log(`⛽ [KeyAccountFuelPricesService] Updating fuel price history entry with ID: ${id}`);
        console.log('⛽ [KeyAccountFuelPricesService] Update data:', JSON.stringify(updateKeyAccountFuelPriceDto, null, 2));
        const fuelPrice = await this.keyAccountFuelPriceRepository.findOne({ where: { id } });
        if (!fuelPrice) {
            throw new common_1.NotFoundException(`Fuel price history entry with ID ${id} not found`);
        }
        Object.assign(fuelPrice, updateKeyAccountFuelPriceDto);
        const updatedFuelPrice = await this.keyAccountFuelPriceRepository.save(fuelPrice);
        console.log(`✅ [KeyAccountFuelPricesService] Fuel price history entry updated`);
        const fuelPriceWithRelations = await this.keyAccountFuelPriceRepository.findOne({
            where: { id: updatedFuelPrice.id },
            relations: ['keyAccount', 'updatedByStaff'],
        });
        if (fuelPriceWithRelations) {
            return fuelPriceWithRelations;
        }
        return updatedFuelPrice;
    }
    async remove(id) {
        console.log(`⛽ [KeyAccountFuelPricesService] Deleting fuel price history entry with ID: ${id}`);
        const fuelPrice = await this.keyAccountFuelPriceRepository.findOne({ where: { id } });
        if (!fuelPrice) {
            throw new common_1.NotFoundException(`Fuel price history entry with ID ${id} not found`);
        }
        await this.keyAccountFuelPriceRepository.remove(fuelPrice);
        console.log(`✅ [KeyAccountFuelPricesService] Fuel price history entry deleted`);
    }
};
exports.KeyAccountFuelPricesService = KeyAccountFuelPricesService;
exports.KeyAccountFuelPricesService = KeyAccountFuelPricesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(key_account_fuel_price_entity_1.KeyAccountFuelPrice)),
    __param(1, (0, typeorm_1.InjectRepository)(key_account_entity_1.KeyAccount)),
    __param(2, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], KeyAccountFuelPricesService);
//# sourceMappingURL=key-account-fuel-prices.service.js.map