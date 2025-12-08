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
exports.KeyAccountLedgerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const key_account_ledger_entity_1 = require("../entities/key-account-ledger.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
let KeyAccountLedgerService = class KeyAccountLedgerService {
    keyAccountLedgerRepository;
    keyAccountRepository;
    dataSource;
    constructor(keyAccountLedgerRepository, keyAccountRepository, dataSource) {
        this.keyAccountLedgerRepository = keyAccountLedgerRepository;
        this.keyAccountRepository = keyAccountRepository;
        this.dataSource = dataSource;
    }
    async create(createDto) {
        console.log('💰 [KeyAccountLedgerService] Creating key account ledger entry');
        const keyAccount = await this.keyAccountRepository.findOne({
            where: { id: createDto.keyAccountId }
        });
        if (!keyAccount) {
            throw new common_1.NotFoundException(`Key account with ID ${createDto.keyAccountId} not found`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const previousEntry = await queryRunner.manager.findOne(key_account_ledger_entity_1.KeyAccountLedger, {
                where: { keyAccountId: createDto.keyAccountId },
                order: { createdAt: 'DESC' }
            });
            const previousBalance = previousEntry ? Number(previousEntry.balance) : 0;
            let debit = 0;
            let credit = 0;
            let newBalance = previousBalance;
            if (createDto.transactionType === key_account_ledger_entity_1.KeyAccountTransactionType.SALE) {
                debit = createDto.totalAmount;
                credit = 0;
                newBalance = previousBalance + debit;
            }
            else if (createDto.transactionType === key_account_ledger_entity_1.KeyAccountTransactionType.PAYMENT) {
                debit = 0;
                credit = createDto.totalAmount;
                newBalance = previousBalance - credit;
            }
            else if (createDto.transactionType === key_account_ledger_entity_1.KeyAccountTransactionType.ADJUSTMENT) {
                debit = createDto.debit || 0;
                credit = createDto.credit || 0;
                newBalance = previousBalance + debit - credit;
            }
            const ledgerData = {
                keyAccountId: createDto.keyAccountId,
                stationId: createDto.stationId,
                transactionDate: new Date(createDto.transactionDate),
                transactionType: createDto.transactionType,
                quantity: createDto.quantity || 0,
                unitPrice: createDto.unitPrice || 0,
                totalAmount: createDto.totalAmount,
                debit: debit,
                credit: credit,
                balance: newBalance,
            };
            if (createDto.vehicleId) {
                ledgerData.vehicleId = createDto.vehicleId;
            }
            if (createDto.referenceNumber) {
                ledgerData.referenceNumber = createDto.referenceNumber;
            }
            if (createDto.description) {
                ledgerData.description = createDto.description;
            }
            if (createDto.notes) {
                ledgerData.notes = createDto.notes;
            }
            if (createDto.createdBy) {
                ledgerData.createdBy = createDto.createdBy;
            }
            const ledgerEntry = this.keyAccountLedgerRepository.create(ledgerData);
            console.log('💰 [KeyAccountLedgerService] Saving ledger entry:', JSON.stringify(ledgerEntry, null, 2));
            const savedLedger = await queryRunner.manager.save(key_account_ledger_entity_1.KeyAccountLedger, ledgerEntry);
            await queryRunner.commitTransaction();
            console.log(`✅ [KeyAccountLedgerService] Key account ledger entry created with ID: ${savedLedger.id}`);
            const ledgerWithRelations = await this.keyAccountLedgerRepository.findOne({
                where: { id: savedLedger.id },
                relations: ['keyAccount', 'vehicle', 'station']
            });
            return ledgerWithRelations || savedLedger;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ [KeyAccountLedgerService] Error creating key account ledger entry:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(keyAccountId) {
        console.log('💰 [KeyAccountLedgerService] Finding all key account ledger entries');
        const where = {};
        if (keyAccountId) {
            where.keyAccountId = keyAccountId;
        }
        const entries = await this.keyAccountLedgerRepository.find({
            where,
            relations: ['keyAccount', 'vehicle', 'station'],
            order: { createdAt: 'DESC' },
        });
        console.log(`✅ [KeyAccountLedgerService] Found ${entries.length} ledger entries`);
        return entries;
    }
    async findOne(id) {
        console.log(`💰 [KeyAccountLedgerService] Finding ledger entry by ID: ${id}`);
        const entry = await this.keyAccountLedgerRepository.findOne({
            where: { id },
            relations: ['keyAccount', 'vehicle', 'station']
        });
        if (!entry) {
            console.log(`❌ [KeyAccountLedgerService] Ledger entry with ID ${id} not found`);
            throw new common_1.NotFoundException(`Key account ledger entry with ID ${id} not found`);
        }
        console.log(`✅ [KeyAccountLedgerService] Ledger entry found`);
        return entry;
    }
    async findByKeyAccount(keyAccountId) {
        console.log(`💰 [KeyAccountLedgerService] Finding ledger entries for key account: ${keyAccountId}`);
        const entries = await this.keyAccountLedgerRepository.find({
            where: { keyAccountId },
            relations: ['keyAccount', 'vehicle', 'station'],
            order: { createdAt: 'DESC' },
        });
        console.log(`✅ [KeyAccountLedgerService] Found ${entries.length} entries for key account ${keyAccountId}`);
        return entries;
    }
};
exports.KeyAccountLedgerService = KeyAccountLedgerService;
exports.KeyAccountLedgerService = KeyAccountLedgerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(key_account_ledger_entity_1.KeyAccountLedger)),
    __param(1, (0, typeorm_1.InjectRepository)(key_account_entity_1.KeyAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], KeyAccountLedgerService);
//# sourceMappingURL=key-account-ledger.service.js.map