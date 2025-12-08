import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Station } from '../entities/station.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
  ) {}

  async create(createDto: CreateSaleDto): Promise<Sale> {
    console.log('💰 [SalesService] Creating sale');
    
    // Verify station exists
    const station = await this.stationRepository.findOne({
      where: { id: createDto.stationId }
    });
    
    if (!station) {
      throw new NotFoundException(`Station with ID ${createDto.stationId} not found`);
    }

    // Create sale entry
    const saleData: Partial<Sale> = {
      stationId: createDto.stationId,
      clientType: createDto.clientType,
      quantity: createDto.quantity,
      unitPrice: createDto.unitPrice,
      totalAmount: createDto.totalAmount,
      saleDate: new Date(createDto.saleDate),
    };

    // Add optional fields only if they have values
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

    const sale = this.saleRepository.create(saleData);
    const savedSale = await this.saleRepository.save(sale);
    
    console.log(`✅ [SalesService] Sale created with ID: ${savedSale.id}`);

    // Reload with relations
    const saleWithRelations = await this.saleRepository.findOne({
      where: { id: savedSale.id },
      relations: ['station', 'keyAccount', 'vehicle']
    });

    return saleWithRelations || savedSale;
  }

  async findAll(stationId?: number, keyAccountId?: number): Promise<Sale[]> {
    console.log('💰 [SalesService] Finding all sales');
    
    const where: any = {};
    if (stationId) {
      where.stationId = stationId;
    }
    if (keyAccountId) {
      where.keyAccountId = keyAccountId;
    }
    
    const sales = await this.saleRepository.find({
      where,
      relations: ['station', 'keyAccount', 'vehicle'],
      order: { saleDate: 'DESC' },
    });
    
    console.log(`✅ [SalesService] Found ${sales.length} sales`);
    return sales;
  }

  async findOne(id: number): Promise<Sale> {
    console.log(`💰 [SalesService] Finding sale by ID: ${id}`);
    
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['station', 'keyAccount', 'vehicle']
    });
    
    if (!sale) {
      console.log(`❌ [SalesService] Sale with ID ${id} not found`);
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    
    console.log(`✅ [SalesService] Sale found`);
    return sale;
  }
}

