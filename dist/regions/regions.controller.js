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
exports.RegionsController = void 0;
const common_1 = require("@nestjs/common");
const regions_service_1 = require("./regions.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_region_dto_1 = require("./dto/create-region.dto");
const update_region_dto_1 = require("./dto/update-region.dto");
let RegionsController = class RegionsController {
    regionsService;
    constructor(regionsService) {
        this.regionsService = regionsService;
    }
    async findAll() {
        console.log('🌍 [RegionsController] GET /regions');
        return this.regionsService.findAll();
    }
    async create(createRegionDto) {
        console.log('🌍 [RegionsController] POST /regions');
        console.log('🌍 [RegionsController] Create region data:', JSON.stringify(createRegionDto, null, 2));
        try {
            const result = await this.regionsService.create(createRegionDto);
            console.log('✅ [RegionsController] Region created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [RegionsController] Error in create:', error);
            throw error;
        }
    }
    async update(id, updateRegionDto) {
        console.log(`🌍 [RegionsController] PUT /regions/${id}`);
        console.log('🌍 [RegionsController] Update region data:', updateRegionDto);
        return this.regionsService.update(id, updateRegionDto);
    }
    async remove(id) {
        console.log(`🌍 [RegionsController] DELETE /regions/${id}`);
        await this.regionsService.remove(id);
        return { message: 'Region deleted successfully' };
    }
};
exports.RegionsController = RegionsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_region_dto_1.CreateRegionDto]),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_region_dto_1.UpdateRegionDto]),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegionsController.prototype, "remove", null);
exports.RegionsController = RegionsController = __decorate([
    (0, common_1.Controller)('regions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [regions_service_1.RegionsService])
], RegionsController);
//# sourceMappingURL=regions.controller.js.map