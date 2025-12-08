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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station = void 0;
const typeorm_1 = require("typeorm");
const region_entity_1 = require("./region.entity");
let Station = class Station {
    id;
    name;
    regionId;
    region;
    contact;
    price;
    lpgQuantity;
};
exports.Station = Station;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Station.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 191 }),
    __metadata("design:type", String)
], Station.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'regionId', type: 'int' }),
    __metadata("design:type", Number)
], Station.prototype, "regionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => region_entity_1.Region),
    (0, typeorm_1.JoinColumn)({ name: 'regionId' }),
    __metadata("design:type", region_entity_1.Region)
], Station.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Station.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Station.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'lpgQuantity' }),
    __metadata("design:type", Number)
], Station.prototype, "lpgQuantity", void 0);
exports.Station = Station = __decorate([
    (0, typeorm_1.Entity)('Stations')
], Station);
//# sourceMappingURL=station.entity.js.map