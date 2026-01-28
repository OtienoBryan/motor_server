import { Repository } from 'typeorm';
import { StaffLeave } from '../entities/staff-leave.entity';
export declare class LeavesService {
    private leavesRepository;
    constructor(leavesRepository: Repository<StaffLeave>);
    findAll(staffId?: number, status?: string, startDate?: string, endDate?: string): Promise<StaffLeave[]>;
    findOne(id: number): Promise<StaffLeave | null>;
    updateStatus(id: number, status: 'approved' | 'rejected' | 'cancelled', approvedBy?: number): Promise<StaffLeave>;
}
