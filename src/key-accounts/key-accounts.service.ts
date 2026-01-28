import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeyAccount } from '../entities/key-account.entity';
import { CreateKeyAccountDto } from './dto/create-key-account.dto';
import { UpdateKeyAccountDto } from './dto/update-key-account.dto';
import { KeyAccountFuelPricesService } from '../key-account-fuel-prices/key-account-fuel-prices.service';

@Injectable()
export class KeyAccountsService {
  constructor(
    @InjectRepository(KeyAccount)
    private keyAccountRepository: Repository<KeyAccount>,
    @Inject(forwardRef(() => KeyAccountFuelPricesService))
    private keyAccountFuelPricesService: KeyAccountFuelPricesService,
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
        fuel_price: createKeyAccountDto.fuel_price !== undefined ? createKeyAccountDto.fuel_price : null,
      });
      
      const savedKeyAccount = await this.keyAccountRepository.save(keyAccount);
      console.log(`✅ [KeyAccountsService] Key account created with ID: ${savedKeyAccount.id}`);
      
      // Create fuel price history entry if fuel_price is provided
      // Note: updatedBy will be set by the controller from the authenticated user
      if (createKeyAccountDto.fuel_price !== undefined && createKeyAccountDto.fuel_price !== null) {
        try {
          await this.keyAccountFuelPricesService.create({
            keyAccountId: savedKeyAccount.id,
            price: createKeyAccountDto.fuel_price,
            notes: 'Initial fuel price',
            updatedBy: null // Will be set by controller if called via API
          });
        } catch (error) {
          console.error('⚠️ [KeyAccountsService] Failed to create fuel price history entry:', error);
          // Don't fail the key account creation if history entry fails
        }
      }
      
      return savedKeyAccount;
    } catch (error) {
      console.error('❌ [KeyAccountsService] Error creating key account:', error);
      throw error;
    }
  }

  async update(id: number, updateKeyAccountDto: UpdateKeyAccountDto, staffId?: number): Promise<KeyAccount> {
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
    
    // Check if fuel_price is being updated and create history entry
    const fuelPriceChanged = updateKeyAccountDto.fuel_price !== undefined && 
                            updateKeyAccountDto.fuel_price !== keyAccount.fuel_price;
    const oldFuelPrice = keyAccount.fuel_price;
    
    Object.assign(keyAccount, updateKeyAccountDto);
    const updatedKeyAccount = await this.keyAccountRepository.save(keyAccount);
    console.log(`✅ [KeyAccountsService] Key account updated: ${updatedKeyAccount.name}`);
    
    // Create fuel price history entry if fuel price changed
    if (fuelPriceChanged) {
      try {
        const newPrice = updateKeyAccountDto.fuel_price;
        if (newPrice !== null && newPrice !== undefined) {
          await this.keyAccountFuelPricesService.create({
            keyAccountId: updatedKeyAccount.id,
            price: newPrice,
            notes: oldFuelPrice !== null ? `Updated from ${oldFuelPrice} to ${newPrice}` : 'Fuel price set',
            updatedBy: staffId || null
          });
          console.log(`✅ [KeyAccountsService] Created fuel price history entry for key account ${updatedKeyAccount.id} by staff ${staffId}`);
        }
      } catch (error) {
        console.error('⚠️ [KeyAccountsService] Failed to create fuel price history entry:', error);
        // Don't fail the update if history entry fails
      }
    }
    
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

