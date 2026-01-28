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
exports.LoyaltyPointsLedgerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loyalty_points_ledger_entity_1 = require("../entities/loyalty-points-ledger.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
const key_account_ledger_entity_1 = require("../entities/key-account-ledger.entity");
const station_entity_1 = require("../entities/station.entity");
let LoyaltyPointsLedgerService = class LoyaltyPointsLedgerService {
    loyaltyPointsLedgerRepository;
    keyAccountRepository;
    keyAccountLedgerRepository;
    stationRepository;
    dataSource;
    constructor(loyaltyPointsLedgerRepository, keyAccountRepository, keyAccountLedgerRepository, stationRepository, dataSource) {
        this.loyaltyPointsLedgerRepository = loyaltyPointsLedgerRepository;
        this.keyAccountRepository = keyAccountRepository;
        this.keyAccountLedgerRepository = keyAccountLedgerRepository;
        this.stationRepository = stationRepository;
        this.dataSource = dataSource;
    }
    async findAll(keyAccountId) {
        const where = {};
        if (keyAccountId) {
            where.keyAccountId = keyAccountId;
        }
        return this.loyaltyPointsLedgerRepository.find({
            where,
            relations: ['keyAccount', 'sale'],
            order: { createdAt: 'DESC' },
        });
    }
    async redeemPoints(keyAccountId, pointsToRedeem, stationId, referenceNumber, createdBy) {
        console.log(`🎁 [LoyaltyPointsLedgerService] Redeeming ${pointsToRedeem} points for key account ${keyAccountId}`);
        if (pointsToRedeem <= 0) {
            throw new common_1.BadRequestException('Points to redeem must be greater than 0');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const station = await queryRunner.manager.findOne(station_entity_1.Station, {
                where: { id: stationId },
            });
            if (!station) {
                throw new common_1.NotFoundException(`Station with ID ${stationId} not found`);
            }
            const keyAccount = await queryRunner.manager.findOne(key_account_entity_1.KeyAccount, {
                where: { id: keyAccountId },
            });
            if (!keyAccount) {
                throw new common_1.NotFoundException(`Key account with ID ${keyAccountId} not found`);
            }
            const currentPointsResult = await queryRunner.manager.query(`SELECT loyalty_points as points FROM KeyAccounts WHERE id = ?`, [keyAccountId]);
            const currentPoints = Number(currentPointsResult?.[0]?.points ?? 0);
            if (currentPoints < pointsToRedeem) {
                throw new common_1.BadRequestException(`Insufficient points. Current balance: ${currentPoints}, requested: ${pointsToRedeem}`);
            }
            const newPointsBalance = currentPoints - pointsToRedeem;
            const cashValue = (pointsToRedeem / 100) * 10;
            const previousLedgerEntry = await queryRunner.manager.findOne(key_account_ledger_entity_1.KeyAccountLedger, {
                where: { keyAccountId: keyAccountId },
                order: { createdAt: 'DESC' }
            });
            const previousBalance = previousLedgerEntry ? Number(previousLedgerEntry.balance) : 0;
            const newAccountBalance = previousBalance - cashValue;
            await queryRunner.manager.query(`UPDATE KeyAccounts SET loyalty_points = loyalty_points - ? WHERE id = ?`, [pointsToRedeem, keyAccountId]);
            const pointsLedgerRow = {
                keyAccountId: keyAccountId,
                transactionDate: new Date(),
                litres: 0,
                pointsRate: 0,
                pointsAwarded: -pointsToRedeem,
                balanceAfter: newPointsBalance,
                referenceNumber: referenceNumber,
                description: `Points redemption: -${pointsToRedeem.toFixed(2)} points (Value: ${cashValue.toFixed(2)} KES)`,
                createdBy: createdBy,
            };
            const pointsLedgerEntity = this.loyaltyPointsLedgerRepository.create(pointsLedgerRow);
            await queryRunner.manager.save(loyalty_points_ledger_entity_1.LoyaltyPointsLedger, pointsLedgerEntity);
            const accountLedgerRow = {
                keyAccountId: keyAccountId,
                stationId: stationId,
                transactionDate: new Date(),
                transactionType: key_account_ledger_entity_1.KeyAccountTransactionType.PAYMENT,
                quantity: 0,
                unitPrice: 0,
                totalAmount: cashValue,
                debit: 0,
                credit: cashValue,
                balance: newAccountBalance,
                referenceNumber: referenceNumber || `REDEEM-${pointsToRedeem}-PTS`,
                description: `Loyalty points redemption: ${pointsToRedeem.toFixed(2)} points redeemed for ${cashValue.toFixed(2)} KES`,
                notes: `Points redemption - ${pointsToRedeem.toFixed(2)} points`,
                createdBy: createdBy,
            };
            const accountLedgerEntity = this.keyAccountLedgerRepository.create(accountLedgerRow);
            await queryRunner.manager.save(key_account_ledger_entity_1.KeyAccountLedger, accountLedgerEntity);
            await queryRunner.commitTransaction();
            console.log(`✅ [LoyaltyPointsLedgerService] Redeemed ${pointsToRedeem} points (${cashValue.toFixed(2)} KES) for key account ${keyAccountId}`);
            console.log(`✅ [LoyaltyPointsLedgerService] Created key account ledger entry - balance: ${previousBalance} → ${newAccountBalance}`);
            return pointsLedgerEntity;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(`❌ [LoyaltyPointsLedgerService] Error redeeming points:`, error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.LoyaltyPointsLedgerService = LoyaltyPointsLedgerService;
exports.LoyaltyPointsLedgerService = LoyaltyPointsLedgerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loyalty_points_ledger_entity_1.LoyaltyPointsLedger)),
    __param(1, (0, typeorm_1.InjectRepository)(key_account_entity_1.KeyAccount)),
    __param(2, (0, typeorm_1.InjectRepository)(key_account_ledger_entity_1.KeyAccountLedger)),
    __param(3, (0, typeorm_1.InjectRepository)(station_entity_1.Station)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], LoyaltyPointsLedgerService);
//# sourceMappingURL=loyalty-points-ledger.service.js.map