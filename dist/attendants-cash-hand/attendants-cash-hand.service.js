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
exports.AttendantsCashHandService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AttendantsCashHandService = class AttendantsCashHandService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getSummary() {
        const query = `
      SELECT
        s.id AS attendantId,
        s.name AS attendantName,
        s.role AS role,
        COALESCE(s.cash_balance, 0) AS cashBalance
      FROM staff s
      WHERE LOWER(COALESCE(s.role, '')) IN ('attendant', 'manager', 'employee')
      ORDER BY s.name ASC
    `;
        return this.dataSource.query(query);
    }
    async getLedger(attendantId) {
        const query = `
      SELECT
        aca.id AS id,
        aca.attendant_id AS attendantId,
        aca.date AS date,
        aca.amount_in AS amountIn,
        aca.amount_out AS amountOut,
        aca.cash_balance AS cashBalance,
        aca.reference AS reference,
        aca.payment_method AS paymentMethod
      FROM attendants_cash_account aca
      WHERE aca.attendant_id = ?
      ORDER BY aca.id DESC
    `;
        return this.dataSource.query(query, [attendantId]);
    }
};
exports.AttendantsCashHandService = AttendantsCashHandService;
exports.AttendantsCashHandService = AttendantsCashHandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AttendantsCashHandService);
//# sourceMappingURL=attendants-cash-hand.service.js.map