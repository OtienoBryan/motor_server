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
exports.KeyAccountsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const key_account_entity_1 = require("../entities/key-account.entity");
let KeyAccountsService = class KeyAccountsService {
    keyAccountRepository;
    constructor(keyAccountRepository) {
        this.keyAccountRepository = keyAccountRepository;
    }
    async findAll() {
        console.log('🏢 [KeyAccountsService] Finding all key accounts');
        const keyAccounts = await this.keyAccountRepository.find({
            order: { name: 'ASC' },
        });
        console.log(`✅ [KeyAccountsService] Found ${keyAccounts.length} key accounts`);
        return keyAccounts;
    }
    async findOne(id) {
        console.log(`🏢 [KeyAccountsService] Finding key account by ID: ${id}`);
        const keyAccount = await this.keyAccountRepository.findOne({
            where: { id },
        });
        if (!keyAccount) {
            console.log(`❌ [KeyAccountsService] Key account with ID ${id} not found`);
            throw new common_1.NotFoundException(`Key account with ID ${id} not found`);
        }
        console.log(`✅ [KeyAccountsService] Key account found: ${keyAccount.name}`);
        return keyAccount;
    }
    async create(createKeyAccountDto) {
        console.log('🏢 [KeyAccountsService] Creating new key account:', createKeyAccountDto.name);
        console.log('🏢 [KeyAccountsService] DTO data:', JSON.stringify(createKeyAccountDto, null, 2));
        const existingAccount = await this.keyAccountRepository.findOne({
            where: { account_number: createKeyAccountDto.account_number },
        });
        if (existingAccount) {
            throw new Error(`Account number ${createKeyAccountDto.account_number} already exists`);
        }
        try {
            const keyAccount = this.keyAccountRepository.create({
                name: createKeyAccountDto.name,
                email: createKeyAccountDto.email,
                contact: createKeyAccountDto.contact,
                account_number: createKeyAccountDto.account_number,
                description: createKeyAccountDto.description || null,
                is_active: createKeyAccountDto.is_active !== undefined ? createKeyAccountDto.is_active : 1,
            });
            const savedKeyAccount = await this.keyAccountRepository.save(keyAccount);
            console.log(`✅ [KeyAccountsService] Key account created with ID: ${savedKeyAccount.id}`);
            return savedKeyAccount;
        }
        catch (error) {
            console.error('❌ [KeyAccountsService] Error creating key account:', error);
            throw error;
        }
    }
    async update(id, updateKeyAccountDto) {
        console.log(`🏢 [KeyAccountsService] Updating key account with ID: ${id}`);
        console.log('🏢 [KeyAccountsService] Update data:', JSON.stringify(updateKeyAccountDto, null, 2));
        const keyAccount = await this.keyAccountRepository.findOne({ where: { id } });
        if (!keyAccount) {
            throw new common_1.NotFoundException(`Key account with ID ${id} not found`);
        }
        if (updateKeyAccountDto.account_number && updateKeyAccountDto.account_number !== keyAccount.account_number) {
            const existingAccount = await this.keyAccountRepository.findOne({
                where: { account_number: updateKeyAccountDto.account_number },
            });
            if (existingAccount) {
                throw new Error(`Account number ${updateKeyAccountDto.account_number} already exists`);
            }
        }
        Object.assign(keyAccount, updateKeyAccountDto);
        const updatedKeyAccount = await this.keyAccountRepository.save(keyAccount);
        console.log(`✅ [KeyAccountsService] Key account updated: ${updatedKeyAccount.name}`);
        return updatedKeyAccount;
    }
    async remove(id) {
        console.log(`🏢 [KeyAccountsService] Deleting key account with ID: ${id}`);
        const keyAccount = await this.keyAccountRepository.findOne({ where: { id } });
        if (!keyAccount) {
            throw new common_1.NotFoundException(`Key account with ID ${id} not found`);
        }
        await this.keyAccountRepository.remove(keyAccount);
        console.log(`✅ [KeyAccountsService] Key account deleted: ${keyAccount.name}`);
    }
};
exports.KeyAccountsService = KeyAccountsService;
exports.KeyAccountsService = KeyAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(key_account_entity_1.KeyAccount)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], KeyAccountsService);
//# sourceMappingURL=key-accounts.service.js.map