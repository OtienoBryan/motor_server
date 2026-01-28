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
exports.ConversionsController = void 0;
const common_1 = require("@nestjs/common");
const conversions_service_1 = require("./conversions.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_conversion_dto_1 = require("./dto/create-conversion.dto");
let ConversionsController = class ConversionsController {
    conversionsService;
    constructor(conversionsService) {
        this.conversionsService = conversionsService;
    }
    async create(createDto) {
        console.log('🔧 [ConversionsController] POST /conversions');
        console.log('🔧 [ConversionsController] Request body:', JSON.stringify(createDto, null, 2));
        try {
            const result = await this.conversionsService.create(createDto);
            console.log('✅ [ConversionsController] Conversion created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [ConversionsController] Error creating conversion:', error);
            console.error('❌ [ConversionsController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            throw error;
        }
    }
    async findAll() {
        console.log('🔧 [ConversionsController] GET /conversions');
        try {
            const result = await this.conversionsService.findAll();
            console.log(`✅ [ConversionsController] Successfully retrieved ${result.length} conversions`);
            return result;
        }
        catch (error) {
            console.error('❌ [ConversionsController] Error fetching conversions:', error);
            console.error('❌ [ConversionsController] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            console.error('❌ [ConversionsController] Error code:', error?.code);
            console.error('❌ [ConversionsController] Error message:', error instanceof Error ? error.message : String(error));
            if (error instanceof Error) {
                throw new Error(`Failed to fetch conversions: ${error.message}`);
            }
            throw error;
        }
    }
    async findOne(id) {
        console.log(`🔧 [ConversionsController] GET /conversions/${id}`);
        return this.conversionsService.findOne(id);
    }
    async update(id, updateDto) {
        console.log(`🔧 [ConversionsController] PUT /conversions/${id}`);
        console.log('🔧 [ConversionsController] Update data:', JSON.stringify(updateDto, null, 2));
        try {
            const result = await this.conversionsService.update(id, updateDto);
            console.log('✅ [ConversionsController] Conversion updated successfully');
            return result;
        }
        catch (error) {
            console.error('❌ [ConversionsController] Error updating conversion:', error);
            throw error;
        }
    }
};
exports.ConversionsController = ConversionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_conversion_dto_1.CreateConversionDto]),
    __metadata("design:returntype", Promise)
], ConversionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConversionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConversionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ConversionsController.prototype, "update", null);
exports.ConversionsController = ConversionsController = __decorate([
    (0, common_1.Controller)('conversions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [conversions_service_1.ConversionsService])
], ConversionsController);
//# sourceMappingURL=conversions.controller.js.map