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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("../entities/vehicle.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
let VehiclesService = class VehiclesService {
    vehicleRepository;
    keyAccountRepository;
    constructor(vehicleRepository, keyAccountRepository) {
        this.vehicleRepository = vehicleRepository;
        this.keyAccountRepository = keyAccountRepository;
    }
    async findByKeyAccount(keyAccountId) {
        console.log(`🚗 [VehiclesService] Finding vehicles for key account: ${keyAccountId}`);
        const vehicles = await this.vehicleRepository.find({
            where: { key_account_id: keyAccountId },
            order: { created_at: 'DESC' },
        });
        console.log(`✅ [VehiclesService] Found ${vehicles.length} vehicles`);
        return vehicles;
    }
    async findOne(id) {
        console.log(`🚗 [VehiclesService] Finding vehicle by ID: ${id}`);
        const vehicle = await this.vehicleRepository.findOne({
            where: { id },
            relations: ['keyAccount'],
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle with ID ${id} not found`);
        }
        return vehicle;
    }
    async create(createVehicleDto) {
        console.log('🚗 [VehiclesService] Creating new vehicle:', createVehicleDto.registration_number);
        const keyAccount = await this.keyAccountRepository.findOne({
            where: { id: createVehicleDto.key_account_id },
        });
        if (!keyAccount) {
            throw new common_1.NotFoundException(`Key account with ID ${createVehicleDto.key_account_id} not found`);
        }
        const existingVehicle = await this.vehicleRepository.findOne({
            where: {
                key_account_id: createVehicleDto.key_account_id,
                registration_number: createVehicleDto.registration_number,
            },
        });
        if (existingVehicle) {
            throw new Error(`Registration number ${createVehicleDto.registration_number} already exists for this account`);
        }
        try {
            const vehicle = this.vehicleRepository.create({
                key_account_id: createVehicleDto.key_account_id,
                registration_number: createVehicleDto.registration_number,
                model: createVehicleDto.model,
                driver_name: createVehicleDto.driver_name,
                driver_contact: createVehicleDto.driver_contact,
            });
            const savedVehicle = await this.vehicleRepository.save(vehicle);
            console.log(`✅ [VehiclesService] Vehicle created with ID: ${savedVehicle.id}`);
            return savedVehicle;
        }
        catch (error) {
            console.error('❌ [VehiclesService] Error creating vehicle:', error);
            throw error;
        }
    }
    async update(id, updateVehicleDto) {
        console.log(`🚗 [VehiclesService] Updating vehicle with ID: ${id}`);
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle with ID ${id} not found`);
        }
        if (updateVehicleDto.registration_number && updateVehicleDto.registration_number !== vehicle.registration_number) {
            const existingVehicle = await this.vehicleRepository.findOne({
                where: {
                    key_account_id: vehicle.key_account_id,
                    registration_number: updateVehicleDto.registration_number,
                },
            });
            if (existingVehicle) {
                throw new Error(`Registration number ${updateVehicleDto.registration_number} already exists for this account`);
            }
        }
        Object.assign(vehicle, updateVehicleDto);
        const updatedVehicle = await this.vehicleRepository.save(vehicle);
        console.log(`✅ [VehiclesService] Vehicle updated: ${updatedVehicle.registration_number}`);
        return updatedVehicle;
    }
    async remove(id) {
        console.log(`🚗 [VehiclesService] Deleting vehicle with ID: ${id}`);
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle with ID ${id} not found`);
        }
        await this.vehicleRepository.remove(vehicle);
        console.log(`✅ [VehiclesService] Vehicle deleted: ${vehicle.registration_number}`);
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(key_account_entity_1.KeyAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map