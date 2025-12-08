import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateKeyAccountDto } from './dto/create-key-account.dto';
import { UpdateKeyAccountDto } from './dto/update-key-account.dto';

@Injectable()
export class KeyAccountsService {
  constructor(
    @InjectRepository(KeyAccount)
    private keyAccountRepository: Repository<KeyAccount>,
  ) {}

  async findAll(): Promise<KeyAccount[]> {
    console.log('🏢 [KeyAccountsService] Finding all key accounts');
    
    const keyAccounts = await this.keyAccountRepository.find({
      order: { name: 'ASC' },
    });
    
    console.log(`✅ [KeyAccountsService] Found ${keyAccounts.length} key accounts`);
    return keyAccounts;
  }

  async findOne(id: number): Promise<KeyAccount> {
    console.log(`🏢 [KeyAccountsService] Finding key account by ID: ${id}`);
    
    const keyAccount = await this.keyAccountRepository.findOne({
      where: { id },
    });
    
    if (!keyAccount) {
      console.log(`❌ [KeyAccountsService] Key account with ID ${id} not found`);
      throw new NotFoundException(`Key account with ID ${id} not found`);
    }
    
    console.log(`✅ [KeyAccountsService] Key account found: ${keyAccount.name}`);
    return keyAccount;
  }

  async create(createKeyAccountDto: CreateKeyAccountDto): Promise<KeyAccount> {
    console.log('🏢 [KeyAccountsService] Creating new key account:', createKeyAccountDto.name);
    console.log('🏢 [KeyAccountsService] DTO data:', JSON.stringify(createKeyAccountDto, null, 2));
    
    // Check if account number already exists
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
    } catch (error) {
      console.error('❌ [KeyAccountsService] Error creating key account:', error);
      throw error;
    }
  }

  async update(id: number, updateKeyAccountDto: UpdateKeyAccountDto): Promise<KeyAccount> {
    console.log(`🏢 [KeyAccountsService] Updating key account with ID: ${id}`);
    console.log('🏢 [KeyAccountsService] Update data:', JSON.stringify(updateKeyAccountDto, null, 2));
    
    const keyAccount = await this.keyAccountRepository.findOne({ where: { id } });
    
    if (!keyAccount) {
      throw new NotFoundException(`Key account with ID ${id} not found`);
    }
    
    // If account_number is being updated, check if it already exists
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

  async remove(id: number): Promise<void> {
    console.log(`🏢 [KeyAccountsService] Deleting key account with ID: ${id}`);
    
    const keyAccount = await this.keyAccountRepository.findOne({ where: { id } });
    
    if (!keyAccount) {
      throw new NotFoundException(`Key account with ID ${id} not found`);
    }
    
    await this.keyAccountRepository.remove(keyAccount);
    console.log(`✅ [KeyAccountsService] Key account deleted: ${keyAccount.name}`);
  }
}

