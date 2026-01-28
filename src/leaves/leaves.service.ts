import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffLeave } from '../entities/staff-leave.entity';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(StaffLeave)
    private leavesRepository: Repository<StaffLeave>,
  ) {}

  async findAll(
    staffId?: number,
    status?: string,
    startDate?: string,
    endDate?: string
  ): Promise<StaffLeave[]> {
    console.log('🏖️ [LeavesService] Finding leaves with filters:', { 
      staffId, 
      status,
      startDate,
      endDate
    });

    const query = this.leavesRepository.createQueryBuilder('leave')
      .leftJoinAndSelect('leave.staff', 'staff')
      .leftJoinAndSelect('leave.approver', 'approver')
      .orderBy('leave.applied_at', 'DESC');

    if (staffId) {
      query.andWhere('leave.staff_id = :staffId', { staffId });
    }

    if (status) {
      query.andWhere('leave.status = :status', { status });
    }

    if (startDate) {
      query.andWhere('leave.start_date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('leave.end_date <= :endDate', { endDate });
    }

    const results = await query.getMany();
    console.log('✅ [LeavesService] Found leaves:', results.length);
    return results;
  }

  async findOne(id: number): Promise<StaffLeave | null> {
    return this.leavesRepository.findOne({ 
      where: { id },
      relations: ['staff', 'approver']
    });
  }

  async updateStatus(
    id: number, 
    status: 'approved' | 'rejected' | 'cancelled',
    approvedBy?: number
  ): Promise<StaffLeave> {
    const leave = await this.leavesRepository.findOne({ where: { id } });
    
    if (!leave) {
      throw new Error('Leave request not found');
    }

    leave.status = status;
    if (approvedBy) {
      leave.approvedBy = approvedBy;
    }

    return this.leavesRepository.save(leave);
  }
}
