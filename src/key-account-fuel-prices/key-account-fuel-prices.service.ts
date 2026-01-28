import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeyAccountFuelPrice } from '../entities/key-account-fuel-price.entity';
import { KeyAccount } from '../entities/key-account.entity';
import { Staff } from '../entities/staff.entity';
import { CreateKeyAccountFuelPriceDto } from './dto/create-key-account-fuel-price.dto';
import { UpdateKeyAccountFuelPriceDto } from './dto/update-key-account-fuel-price.dto';

@Injectable()
export class KeyAccountFuelPricesService {
  constructor(
    @InjectRepository(KeyAccountFuelPrice)
    private keyAccountFuelPriceRepository: Repository<KeyAccountFuelPrice>,
    @InjectRepository(KeyAccount)
    private keyAccountRepository: Repository<KeyAccount>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async create(createKeyAccountFuelPriceDto: CreateKeyAccountFuelPriceDto): Promise<KeyAccountFuelPrice> {
    console.log('⛽ [KeyAccountFuelPricesService] Creating fuel price history entry');
    console.log('⛽ [KeyAccountFuelPricesService] DTO data:', JSON.stringify(createKeyAccountFuelPriceDto, null, 2));

    // Verify key account exists
    const keyAccount = await this.keyAccountRepository.findOne({
      where: { id: createKeyAccountFuelPriceDto.keyAccountId },
    });

    if (!keyAccount) {
      throw new NotFoundException(`Key account with ID ${createKeyAccountFuelPriceDto.keyAccountId} not found`);
    }

    const fuelPrice = this.keyAccountFuelPriceRepository.create({
      keyAccountId: createKeyAccountFuelPriceDto.keyAccountId,
      price: createKeyAccountFuelPriceDto.price,
      notes: createKeyAccountFuelPriceDto.notes || null,
      updatedBy: createKeyAccountFuelPriceDto.updatedBy || null,
    });

    const savedFuelPrice = await this.keyAccountFuelPriceRepository.save(fuelPrice);
    console.log(`✅ [KeyAccountFuelPricesService] Fuel price history entry created with ID: ${savedFuelPrice.id}`);

    return savedFuelPrice;
  }

  async findByKeyAccount(keyAccountId: number): Promise<KeyAccountFuelPrice[]> {
    console.log(`⛽ [KeyAccountFuelPricesService] Finding fuel price history for key account: ${keyAccountId}`);

    const fuelPrices = await this.keyAccountFuelPriceRepository.find({
      where: { keyAccountId },
      order: { created_at: 'DESC' },
      relations: ['keyAccount', 'updatedByStaff'],
    });

    console.log(`✅ [KeyAccountFuelPricesService] Found ${fuelPrices.length} fuel price history entries`);
    return fuelPrices;
  }

  async findLatestByKeyAccount(keyAccountId: number): Promise<KeyAccountFuelPrice | null> {
    console.log(`⛽ [KeyAccountFuelPricesService] Finding latest fuel price for key account: ${keyAccountId}`);

    const latestFuelPrice = await this.keyAccountFuelPriceRepository.findOne({
      where: { keyAccountId },
      order: { created_at: 'DESC' },
      relations: ['keyAccount', 'updatedByStaff'],
    });

    if (latestFuelPrice) {
      console.log(`✅ [KeyAccountFuelPricesService] Latest fuel price found: ${latestFuelPrice.price}`);
    } else {
      console.log(`ℹ️ [KeyAccountFuelPricesService] No fuel price history found for key account ${keyAccountId}`);
    }

    return latestFuelPrice;
  }

  async findOne(id: number): Promise<KeyAccountFuelPrice> {
    console.log(`⛽ [KeyAccountFuelPricesService] Finding fuel price history entry by ID: ${id}`);

    const fuelPrice = await this.keyAccountFuelPriceRepository.findOne({
      where: { id },
      relations: ['keyAccount', 'updatedByStaff'],
    });

    if (!fuelPrice) {
      console.log(`❌ [KeyAccountFuelPricesService] Fuel price history entry with ID ${id} not found`);
      throw new NotFoundException(`Fuel price history entry with ID ${id} not found`);
    }

    console.log(`✅ [KeyAccountFuelPricesService] Fuel price history entry found`);
    return fuelPrice;
  }

  async update(id: number, updateKeyAccountFuelPriceDto: UpdateKeyAccountFuelPriceDto): Promise<KeyAccountFuelPrice> {
    console.log(`⛽ [KeyAccountFuelPricesService] Updating fuel price history entry with ID: ${id}`);
    console.log('⛽ [KeyAccountFuelPricesService] Update data:', JSON.stringify(updateKeyAccountFuelPriceDto, null, 2));

    const fuelPrice = await this.keyAccountFuelPriceRepository.findOne({ where: { id } });

    if (!fuelPrice) {
      throw new NotFoundException(`Fuel price history entry with ID ${id} not found`);
    }

    Object.assign(fuelPrice, updateKeyAccountFuelPriceDto);
    const updatedFuelPrice = await this.keyAccountFuelPriceRepository.save(fuelPrice);
    console.log(`✅ [KeyAccountFuelPricesService] Fuel price history entry updated`);

    // Reload with relations
    const fuelPriceWithRelations = await this.keyAccountFuelPriceRepository.findOne({
      where: { id: updatedFuelPrice.id },
      relations: ['keyAccount', 'updatedByStaff'],
    });

    if (fuelPriceWithRelations) {
      return fuelPriceWithRelations;
    }
    return updatedFuelPrice;
  }

  async remove(id: number): Promise<void> {
    console.log(`⛽ [KeyAccountFuelPricesService] Deleting fuel price history entry with ID: ${id}`);

    const fuelPrice = await this.keyAccountFuelPriceRepository.findOne({ where: { id } });

    if (!fuelPrice) {
      throw new NotFoundException(`Fuel price history entry with ID ${id} not found`);
    }

    await this.keyAccountFuelPriceRepository.remove(fuelPrice);
    console.log(`✅ [KeyAccountFuelPricesService] Fuel price history entry deleted`);
  }
}
