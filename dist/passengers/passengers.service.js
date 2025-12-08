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
exports.PassengersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const passenger_entity_1 = require("../entities/passenger.entity");
let PassengersService = class PassengersService {
    passengerRepository;
    constructor(passengerRepository) {
        this.passengerRepository = passengerRepository;
    }
    async create(createPassengerDto) {
        console.log('👤 [PassengersService] Creating new passenger:', createPassengerDto.name);
        let pnr;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;
        while (!isUnique && attempts < maxAttempts) {
            pnr = this.generatePNR();
            const existing = await this.passengerRepository.findOne({
                where: { pnr }
            });
            if (!existing) {
                isUnique = true;
            }
            attempts++;
        }
        if (!isUnique) {
            throw new Error('Failed to generate unique PNR after multiple attempts');
        }
        const passenger = this.passengerRepository.create({
            pnr: pnr,
            name: createPassengerDto.name,
            email: createPassengerDto.email || null,
            contact: createPassengerDto.contact || null,
            nationality: createPassengerDto.nationality || null,
            identification: createPassengerDto.identification || null,
            age: createPassengerDto.age || null,
            title: createPassengerDto.title || null,
        });
        const savedPassenger = await this.passengerRepository.save(passenger);
        console.log(`✅ [PassengersService] Passenger created with ID: ${savedPassenger.id}, PNR: ${savedPassenger.pnr}`);
        return savedPassenger;
    }
    generatePNR() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const numbers = '0123456789';
        let pnr = '';
        for (let i = 0; i < 6; i++) {
            pnr += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        for (let i = 0; i < 4; i++) {
            pnr += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }
        return pnr;
    }
};
exports.PassengersService = PassengersService;
exports.PassengersService = PassengersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(passenger_entity_1.Passenger)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PassengersService);
//# sourceMappingURL=passengers.service.js.map