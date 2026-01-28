import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckinRecord } from '../entities/checkin-record.entity';

@Injectable()
export class CheckinRecordsService {
  constructor(
    @InjectRepository(CheckinRecord)
    private checkinRecordsRepository: Repository<CheckinRecord>,
  ) {}

  async findAll(
    startDate?: string,
    endDate?: string,
    userId?: number,
    stationId?: number
  ): Promise<CheckinRecord[]> {
    console.log('📋 [CheckinRecordsService] Finding records with filters:', { 
      startDate, 
      endDate, 
      userId,
      stationId 
    });

    const query = this.checkinRecordsRepository.createQueryBuilder('checkin')
      .leftJoinAndSelect('checkin.staff', 'staff')
      .leftJoinAndSelect('checkin.station', 'station')
      .orderBy('checkin.time_in', 'DESC');

    if (userId) {
      query.andWhere('checkin.user_id = :userId', { userId });
    }

    if (stationId) {
      query.andWhere('checkin.station_id = :stationId', { stationId });
    }

    if (startDate) {
      query.andWhere('DATE(checkin.time_in) >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('DATE(checkin.time_in) <= :endDate', { endDate });
    }

    const results = await query.getMany();
    console.log('✅ [CheckinRecordsService] Found records:', results.length);
    return results;
  }

  async findOne(id: number): Promise<CheckinRecord | null> {
    return this.checkinRecordsRepository.findOne({ 
      where: { id },
      relations: ['staff', 'station']
    });
  }
}
