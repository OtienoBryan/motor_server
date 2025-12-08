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
exports.StationsController = void 0;
const common_1 = require("@nestjs/common");
const stations_service_1 = require("./stations.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_station_dto_1 = require("./dto/create-station.dto");
const update_station_dto_1 = require("./dto/update-station.dto");
let StationsController = class StationsController {
    stationsService;
    constructor(stationsService) {
        this.stationsService = stationsService;
    }
    async findAll() {
        console.log('🚉 [StationsController] GET /stations');
        return this.stationsService.findAll();
    }
    async findOne(id) {
        console.log(`🚉 [StationsController] GET /stations/${id}`);
        return this.stationsService.findOne(id);
    }
    async create(createStationDto) {
        console.log('🚉 [StationsController] POST /stations');
        console.log('🚉 [StationsController] Create station data:', JSON.stringify(createStationDto, null, 2));
        try {
            const result = await this.stationsService.create(createStationDto);
            console.log('✅ [StationsController] Station created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [StationsController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateStationDto) {
        console.log(`🚉 [StationsController] PUT /stations/${id}`);
        console.log('🚉 [StationsController] Update station data:', updateStationDto);
        return this.stationsService.update(id, updateStationDto);
    }
    async remove(id) {
        console.log(`🚉 [StationsController] DELETE /stations/${id}`);
        await this.stationsService.remove(id);
        return { message: 'Station deleted successfully' };
    }
};
exports.StationsController = StationsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_station_dto_1.CreateStationDto]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_station_dto_1.UpdateStationDto]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StationsController.prototype, "remove", null);
exports.StationsController = StationsController = __decorate([
    (0, common_1.Controller)('stations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [stations_service_1.StationsService])
], StationsController);
//# sourceMappingURL=stations.controller.js.map