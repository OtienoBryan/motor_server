import { LeavesService } from './leaves.service';
import { StaffLeave } from '../entities/staff-leave.entity';
export declare class LeavesController {
    private readonly leavesService;
    constructor(leavesService: LeavesService);
    findAll(staffId?: string, status?: string, startDate?: string, endDate?: string): Promise<StaffLeave[]>;
    findOne(id: number): Promise<StaffLeave | null>;
    updateStatus(id: number, body: {
        status: 'approved' | 'rejected' | 'cancelled';
        approvedBy?: number;
    }): Promise<StaffLeave>;
}
