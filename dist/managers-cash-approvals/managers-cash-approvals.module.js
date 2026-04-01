"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagersCashApprovalsModule = void 0;
const common_1 = require("@nestjs/common");
const managers_cash_approvals_controller_1 = require("./managers-cash-approvals.controller");
const managers_cash_approvals_service_1 = require("./managers-cash-approvals.service");
let ManagersCashApprovalsModule = class ManagersCashApprovalsModule {
};
exports.ManagersCashApprovalsModule = ManagersCashApprovalsModule;
exports.ManagersCashApprovalsModule = ManagersCashApprovalsModule = __decorate([
    (0, common_1.Module)({
        controllers: [managers_cash_approvals_controller_1.ManagersCashApprovalsController],
        providers: [managers_cash_approvals_service_1.ManagersCashApprovalsService],
        exports: [managers_cash_approvals_service_1.ManagersCashApprovalsService],
    })
], ManagersCashApprovalsModule);
//# sourceMappingURL=managers-cash-approvals.module.js.map