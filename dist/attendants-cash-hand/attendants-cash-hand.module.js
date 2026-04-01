"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendantsCashHandModule = void 0;
const common_1 = require("@nestjs/common");
const attendants_cash_hand_controller_1 = require("./attendants-cash-hand.controller");
const attendants_cash_hand_service_1 = require("./attendants-cash-hand.service");
let AttendantsCashHandModule = class AttendantsCashHandModule {
};
exports.AttendantsCashHandModule = AttendantsCashHandModule;
exports.AttendantsCashHandModule = AttendantsCashHandModule = __decorate([
    (0, common_1.Module)({
        controllers: [attendants_cash_hand_controller_1.AttendantsCashHandController],
        providers: [attendants_cash_hand_service_1.AttendantsCashHandService],
        exports: [attendants_cash_hand_service_1.AttendantsCashHandService],
    })
], AttendantsCashHandModule);
//# sourceMappingURL=attendants-cash-hand.module.js.map