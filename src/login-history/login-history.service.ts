import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginHistory } from '../entities/login-history.entity';
import { Staff } from '../entities/staff.entity';

@Injectable()
export class LoginHistoryService {
  constructor(
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async findAll(startDate?: string, endDate?: string, userId?: number) {
    console.log('📋 [LoginHistoryService] Finding all login history', { startDate, endDate, userId });
    
    try {
      const queryBuilder = this.loginHistoryRepository.createQueryBuilder('lh');

      if (userId) {
        queryBuilder.andWhere('lh.userId = :userId', { userId });
      }

      if (startDate) {
        queryBuilder.andWhere('lh.sessionStart >= :startDate', { startDate: `${startDate} 00:00:00` });
      }

      if (endDate) {
        queryBuilder.andWhere('lh.sessionStart <= :endDate', { endDate: `${endDate} 23:59:59` });
      }

      queryBuilder.orderBy('lh.sessionStart', 'DESC');

      const loginHistory = await queryBuilder.getMany();
      console.log(`📋 [LoginHistoryService] Raw query returned ${loginHistory.length} records`);

    // Fetch staff information for each login history entry
    const userIds = [...new Set(loginHistory.map(lh => lh.userId).filter(id => id !== null && id !== undefined))];
    const staffMap = new Map<number, Staff>();
    
    if (userIds.length > 0) {
      const staffMembers = await this.staffRepository.find({
        where: userIds.map(id => ({ id })),
      });
      staffMembers.forEach(staff => {
        staffMap.set(staff.id, staff);
      });
    }

      // Always calculate duration from sessionStart and sessionEnd
      const result = loginHistory.map(lh => {
        let calculatedDuration: number | null = null;
        
        // Always calculate duration from sessionStart and sessionEnd
        if (lh.sessionStart && lh.sessionEnd) {
          try {
            const start = new Date(lh.sessionStart);
            const end = new Date(lh.sessionEnd);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
              calculatedDuration = Math.floor((end.getTime() - start.getTime()) / 1000); // Duration in seconds
            }
          } catch (error) {
            console.warn(`⚠️ [LoginHistoryService] Error calculating duration for entry ${lh.id}:`, error);
          }
        }

        return {
          ...lh,
          duration: calculatedDuration, // Always use calculated duration
          staff: lh.userId ? staffMap.get(lh.userId) || null : null,
        };
      });

      console.log(`✅ [LoginHistoryService] Found ${result.length} login history entries`);
      return result;
    } catch (error) {
      console.error('❌ [LoginHistoryService] Error finding login history:', error);
      throw error;
    }
  }

  async findByUserId(userId: number, startDate?: string, endDate?: string) {
    console.log(`📋 [LoginHistoryService] Finding login history for userId: ${userId}`, { startDate, endDate });
    
    try {
      const queryBuilder = this.loginHistoryRepository.createQueryBuilder('lh')
        .where('lh.userId = :userId', { userId });

      if (startDate) {
        queryBuilder.andWhere('lh.sessionStart >= :startDate', { startDate: `${startDate} 00:00:00` });
      }

      if (endDate) {
        queryBuilder.andWhere('lh.sessionStart <= :endDate', { endDate: `${endDate} 23:59:59` });
      }

      queryBuilder.orderBy('lh.sessionStart', 'DESC');

      const loginHistory = await queryBuilder.getMany();

      // Fetch staff information
      const staff = await this.staffRepository.findOne({ where: { id: userId } });

      // Always calculate duration from sessionStart and sessionEnd
      return loginHistory.map(lh => {
        let calculatedDuration: number | null = null;
        
        // Always calculate duration from sessionStart and sessionEnd
        if (lh.sessionStart && lh.sessionEnd) {
          try {
            const start = new Date(lh.sessionStart);
            const end = new Date(lh.sessionEnd);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
              calculatedDuration = Math.floor((end.getTime() - start.getTime()) / 1000); // Duration in seconds
            }
          } catch (error) {
            console.warn(`⚠️ [LoginHistoryService] Error calculating duration for entry ${lh.id}:`, error);
          }
        }

        return {
          ...lh,
          duration: calculatedDuration, // Always use calculated duration
          staff: staff || null,
        };
      });
    } catch (error) {
      console.error(`❌ [LoginHistoryService] Error finding login history for userId ${userId}:`, error);
      throw error;
    }
  }
}
