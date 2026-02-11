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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../entities/sale.entity");
const sale_entity_2 = require("../entities/sale.entity");
const station_entity_1 = require("../entities/station.entity");
const key_account_entity_1 = require("../entities/key-account.entity");
const loyalty_points_ledger_entity_1 = require("../entities/loyalty-points-ledger.entity");
let SalesService = class SalesService {
    saleRepository;
    stationRepository;
    keyAccountRepository;
    loyaltyPointsLedgerRepository;
    dataSource;
    constructor(saleRepository, stationRepository, keyAccountRepository, loyaltyPointsLedgerRepository, dataSource) {
        this.saleRepository = saleRepository;
        this.stationRepository = stationRepository;
        this.keyAccountRepository = keyAccountRepository;
        this.loyaltyPointsLedgerRepository = loyaltyPointsLedgerRepository;
        this.dataSource = dataSource;
    }
    async create(createDto) {
        console.log('💰 [SalesService] Creating sale');
        const station = await this.stationRepository.findOne({
            where: { id: createDto.stationId }
        });
        if (!station) {
            throw new common_1.NotFoundException(`Station with ID ${createDto.stationId} not found`);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const saleData = {
                stationId: createDto.stationId,
                clientType: createDto.clientType,
                quantity: createDto.quantity,
                unitPrice: createDto.unitPrice,
                totalAmount: createDto.totalAmount,
                saleDate: new Date(createDto.saleDate),
            };
            if (createDto.keyAccountId) {
                saleData.keyAccountId = createDto.keyAccountId;
            }
            if (createDto.vehicleId) {
                saleData.vehicleId = createDto.vehicleId;
            }
            if (createDto.referenceNumber) {
                saleData.referenceNumber = createDto.referenceNumber;
            }
            if (createDto.notes) {
                saleData.notes = createDto.notes;
            }
            if (createDto.createdBy) {
                saleData.createdBy = createDto.createdBy;
            }
            if (createDto.paymentMethod) {
                saleData.paymentMethod = createDto.paymentMethod;
            }
            const sale = this.saleRepository.create(saleData);
            const savedSale = await queryRunner.manager.save(sale_entity_1.Sale, sale);
            console.log(`✅ [SalesService] Sale created with ID: ${savedSale.id}`);
            console.log(`🔍 [SalesService] Checking loyalty points eligibility:`);
            console.log(`   - clientType: ${createDto.clientType} (type: ${typeof createDto.clientType})`);
            console.log(`   - KEY_ACCOUNT enum: ${sale_entity_2.ClientType.KEY_ACCOUNT}`);
            console.log(`   - keyAccountId: ${createDto.keyAccountId}`);
            console.log(`   - Comparison: ${createDto.clientType === sale_entity_2.ClientType.KEY_ACCOUNT}`);
            if (createDto.clientType === sale_entity_2.ClientType.KEY_ACCOUNT && createDto.keyAccountId) {
                try {
                    console.log(`🎁 [SalesService] Processing loyalty points for key account sale`);
                    const pointsRate = 10;
                    const litres = Number(createDto.quantity) || 0;
                    const pointsToAdd = litres * pointsRate;
                    console.log(`📊 [SalesService] Points calculation: ${litres}L × ${pointsRate} = ${pointsToAdd} points`);
                    console.log(`🔍 [SalesService] Looking up key account ID: ${createDto.keyAccountId}`);
                    const keyAccount = await queryRunner.manager.findOne(key_account_entity_1.KeyAccount, {
                        where: { id: createDto.keyAccountId },
                    });
                    if (!keyAccount) {
                        console.error(`❌ [SalesService] Key account ${createDto.keyAccountId} not found!`);
                        throw new common_1.NotFoundException(`Key account with ID ${createDto.keyAccountId} not found`);
                    }
                    console.log(`✅ [SalesService] Key account found: ${keyAccount.name} (ID: ${keyAccount.id})`);
                    console.log(`🔍 [SalesService] Fetching current loyalty points balance...`);
                    let currentPointsResult;
                    try {
                        currentPointsResult = await queryRunner.manager
                            .createQueryBuilder()
                            .select('ka.loyalty_points', 'points')
                            .from(key_account_entity_1.KeyAccount, 'ka')
                            .where('ka.id = :id', { id: createDto.keyAccountId })
                            .getRawOne();
                        console.log(`📊 [SalesService] Raw query result:`, JSON.stringify(currentPointsResult));
                    }
                    catch (queryError) {
                        console.error(`❌ [SalesService] Error fetching current points:`, queryError);
                        console.error(`❌ [SalesService] Query error message:`, queryError instanceof Error ? queryError.message : String(queryError));
                        console.error(`❌ [SalesService] Query error stack:`, queryError instanceof Error ? queryError.stack : 'No stack');
                        throw queryError;
                    }
                    const previousPoints = Number(currentPointsResult?.points ?? 0);
                    const newPointsBalance = previousPoints + pointsToAdd;
                    console.log(`📊 [SalesService] Points balance: ${previousPoints} + ${pointsToAdd} = ${newPointsBalance}`);
                    console.log(`🔄 [SalesService] Updating loyalty points in database...`);
                    console.log(`   SQL: UPDATE KeyAccounts SET loyalty_points = COALESCE(loyalty_points, 0) + ${pointsToAdd} WHERE id = ${createDto.keyAccountId}`);
                    let updateResult;
                    try {
                        updateResult = await queryRunner.manager.query(`UPDATE KeyAccounts SET loyalty_points = COALESCE(loyalty_points, 0) + ? WHERE id = ?`, [pointsToAdd, createDto.keyAccountId]);
                        console.log(`📊 [SalesService] Update query result:`, JSON.stringify(updateResult));
                        console.log(`✅ [SalesService] Update query executed successfully`);
                    }
                    catch (updateError) {
                        console.error(`❌ [SalesService] Error updating loyalty points:`, updateError);
                        console.error(`❌ [SalesService] Update error message:`, updateError instanceof Error ? updateError.message : String(updateError));
                        console.error(`❌ [SalesService] Update error code:`, updateError?.code);
                        console.error(`❌ [SalesService] Update error stack:`, updateError instanceof Error ? updateError.stack : 'No stack');
                        throw updateError;
                    }
                    console.log(`🔍 [SalesService] Verifying points update...`);
                    let verifyResult;
                    try {
                        verifyResult = await queryRunner.manager.query(`SELECT loyalty_points as points FROM KeyAccounts WHERE id = ?`, [createDto.keyAccountId]);
                        console.log(`📊 [SalesService] Verification query result:`, JSON.stringify(verifyResult));
                    }
                    catch (verifyError) {
                        console.error(`❌ [SalesService] Error verifying points:`, verifyError);
                        console.error(`❌ [SalesService] Verify error message:`, verifyError instanceof Error ? verifyError.message : String(verifyError));
                        console.error(`❌ [SalesService] Verify error stack:`, verifyError instanceof Error ? verifyError.stack : 'No stack');
                        throw verifyError;
                    }
                    const verifiedPoints = Number(verifyResult?.[0]?.points ?? 0);
                    console.log(`📊 [SalesService] Verified points: ${verifiedPoints}, Expected: ${newPointsBalance}`);
                    if (Math.abs(verifiedPoints - newPointsBalance) > 0.01) {
                        console.warn(`⚠️ [SalesService] Points mismatch! Expected ${newPointsBalance}, got ${verifiedPoints}`);
                    }
                    else {
                        console.log(`✅ [SalesService] Points balance verified successfully: ${verifiedPoints}`);
                    }
                    console.log(`🎁 [SalesService] Incremented ${pointsToAdd} loyalty points for key account ${createDto.keyAccountId} (${previousPoints} → ${newPointsBalance})`);
                    console.log(`📝 [SalesService] Creating loyalty points ledger entry...`);
                    try {
                        const ledgerRow = {
                            keyAccountId: createDto.keyAccountId,
                            saleId: savedSale.id,
                            transactionDate: new Date(createDto.saleDate),
                            litres,
                            pointsRate,
                            pointsAwarded: pointsToAdd,
                            balanceAfter: newPointsBalance,
                            referenceNumber: createDto.referenceNumber,
                            description: `Loyalty points: +${pointsToAdd.toFixed(2)} (${litres.toFixed(2)}L × ${pointsRate})`,
                            createdBy: createDto.createdBy,
                        };
                        console.log(`📊 [SalesService] Ledger row data:`, JSON.stringify(ledgerRow, null, 2));
                        const ledgerEntity = this.loyaltyPointsLedgerRepository.create(ledgerRow);
                        const savedLedger = await queryRunner.manager.save(loyalty_points_ledger_entity_1.LoyaltyPointsLedger, ledgerEntity);
                        console.log(`✅ [SalesService] Created loyalty points ledger entry ID: ${savedLedger.id}`);
                    }
                    catch (ledgerError) {
                        console.error(`❌ [SalesService] Error creating ledger entry:`, ledgerError);
                        console.error(`❌ [SalesService] Ledger error message:`, ledgerError instanceof Error ? ledgerError.message : String(ledgerError));
                        console.error(`❌ [SalesService] Ledger error code:`, ledgerError?.code);
                        console.error(`❌ [SalesService] Ledger error stack:`, ledgerError instanceof Error ? ledgerError.stack : 'No stack');
                        console.warn(`⚠️ [SalesService] Continuing despite ledger error...`);
                    }
                    console.log(`✅ [SalesService] Loyalty points processing completed successfully`);
                }
                catch (pointsError) {
                    console.error(`❌ [SalesService] CRITICAL ERROR in loyalty points processing:`, pointsError);
                    console.error(`❌ [SalesService] Error type:`, pointsError?.constructor?.name);
                    console.error(`❌ [SalesService] Error message:`, pointsError instanceof Error ? pointsError.message : String(pointsError));
                    console.error(`❌ [SalesService] Error code:`, pointsError?.code);
                    console.error(`❌ [SalesService] Error stack:`, pointsError instanceof Error ? pointsError.stack : 'No stack');
                    throw pointsError;
                }
            }
            else {
                console.log(`ℹ️ [SalesService] Skipping loyalty points - not a key account sale`);
                console.log(`   Reason: clientType=${createDto.clientType} !== ${sale_entity_2.ClientType.KEY_ACCOUNT} OR keyAccountId=${createDto.keyAccountId} is falsy`);
            }
            await queryRunner.commitTransaction();
            const saleWithRelations = await this.saleRepository.findOne({
                where: { id: savedSale.id },
                relations: ['station', 'keyAccount', 'vehicle'],
            });
            return saleWithRelations || savedSale;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('❌ [SalesService] Error creating sale (with loyalty points):', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(stationId, keyAccountId, clientType) {
        console.log('💰 [SalesService] Finding all sales');
        console.log(`🔍 [SalesService] Filters - stationId: ${stationId}, keyAccountId: ${keyAccountId}, clientType: ${clientType}`);
        const queryBuilder = this.saleRepository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.station', 'station')
            .leftJoinAndSelect('sale.vehicle', 'vehicle');
        if (clientType) {
            queryBuilder.innerJoinAndSelect('sale.keyAccount', 'keyAccount');
            console.log(`🔍 [SalesService] Using INNER JOIN to filter by client_type from KeyAccounts table: ${clientType}`);
        }
        else {
            queryBuilder.leftJoinAndSelect('sale.keyAccount', 'keyAccount');
        }
        const whereConditions = [];
        const whereParams = {};
        if (stationId) {
            whereConditions.push('sale.stationId = :stationId');
            whereParams.stationId = stationId;
        }
        if (keyAccountId) {
            whereConditions.push('sale.keyAccountId = :keyAccountId');
            whereParams.keyAccountId = keyAccountId;
        }
        if (clientType) {
            whereConditions.push('keyAccount.client_type = :clientType');
            whereParams.clientType = clientType;
        }
        if (whereConditions.length > 0) {
            queryBuilder.where(whereConditions.join(' AND '), whereParams);
        }
        queryBuilder.orderBy('sale.saleDate', 'DESC');
        const sales = await queryBuilder.getMany();
        console.log(`✅ [SalesService] Found ${sales.length} sales`);
        return sales;
    }
    async findOne(id) {
        console.log(`💰 [SalesService] Finding sale by ID: ${id}`);
        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['station', 'keyAccount', 'vehicle']
        });
        if (!sale) {
            console.log(`❌ [SalesService] Sale with ID ${id} not found`);
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        console.log(`✅ [SalesService] Sale found`);
        return sale;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(station_entity_1.Station)),
    __param(2, (0, typeorm_1.InjectRepository)(key_account_entity_1.KeyAccount)),
    __param(3, (0, typeorm_1.InjectRepository)(loyalty_points_ledger_entity_1.LoyaltyPointsLedger)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SalesService);
//# sourceMappingURL=sales.service.js.map