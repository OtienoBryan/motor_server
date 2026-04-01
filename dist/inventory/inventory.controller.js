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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_inventory_ledger_dto_1 = require("./dto/create-inventory-ledger.dto");
const update_inventory_ledger_dto_1 = require("./dto/update-inventory-ledger.dto");
const create_delivery_approval_dto_1 = require("./dto/create-delivery-approval.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async create(createInventoryLedgerDto) {
        console.log('📦 [InventoryController] POST /inventory');
        console.log('📦 [InventoryController] Create inventory ledger data:', JSON.stringify(createInventoryLedgerDto, null, 2));
        try {
            const result = await this.inventoryService.create(createInventoryLedgerDto);
            console.log('✅ [InventoryController] Inventory ledger entry created successfully:', result.id);
            return result;
        }
        catch (error) {
            console.error('❌ [InventoryController] Error in create:', error);
            throw error;
        }
    }
    async createDeliveryApproval(createDeliveryApprovalDto) {
        console.log('📦 [InventoryController] POST /inventory/delivery-approvals');
        return this.inventoryService.createDeliveryApproval(createDeliveryApprovalDto);
    }
    async getDeliveryApprovals(status, stationId, startDate, endDate) {
        return this.inventoryService.getDeliveryApprovals(status, stationId ? Number(stationId) : undefined, startDate, endDate);
    }
    async findAll(stationId) {
        console.log('📦 [InventoryController] GET /inventory');
        if (stationId) {
            return this.inventoryService.findByStation(Number(stationId));
        }
        return this.inventoryService.findAll();
    }
    async getStationInventory() {
        console.log('📦 [InventoryController] GET /inventory/stations');
        return this.inventoryService.getStationInventory();
    }
    async getReport() {
        console.log('📦 [InventoryController] GET /inventory/report');
        return this.inventoryService.findAll();
    }
    async findOne(id) {
        console.log(`📦 [InventoryController] GET /inventory/${id}`);
        return this.inventoryService.findOne(id);
    }
    async update(id, updateInventoryLedgerDto) {
        console.log(`📦 [InventoryController] PUT /inventory/${id}`);
        console.log('📦 [InventoryController] Update inventory ledger data:', updateInventoryLedgerDto);
        return this.inventoryService.update(id, updateInventoryLedgerDto);
    }
    async remove(id) {
        console.log(`📦 [InventoryController] DELETE /inventory/${id}`);
        await this.inventoryService.remove(id);
        return { message: 'Inventory ledger entry deleted successfully' };
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_ledger_dto_1.CreateInventoryLedgerDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('delivery-approvals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_approval_dto_1.CreateDeliveryApprovalDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "createDeliveryApproval", null);
__decorate([
    (0, common_1.Get)('delivery-approvals'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('stationId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getDeliveryApprovals", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('stationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getStationInventory", null);
__decorate([
    (0, common_1.Get)('report'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_inventory_ledger_dto_1.UpdateInventoryLedgerDto]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map