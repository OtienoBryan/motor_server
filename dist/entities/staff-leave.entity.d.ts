import { Staff } from './staff.entity';
export declare class StaffLeave {
    id: number;
    staffId: number;
    leaveTypeId: number;
    startDate: string;
    endDate: string;
    reason: string;
    attachmentUrl: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    isHalfDay: number;
    approvedBy: number;
    appliedAt: Date;
    updatedAt: Date;
    staff: Staff;
    approver: Staff;
}
