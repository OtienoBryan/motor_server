import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Staff } from './staff.entity';

@Entity('staff_leaves')
export class StaffLeave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'staff_id' })
  staffId: number;

  @Column({ name: 'leave_type_id' })
  leaveTypeId: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'attachment_url', length: 500, nullable: true })
  attachmentUrl: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';

  @Column({ name: 'is_half_day', type: 'tinyint', default: 0 })
  isHalfDay: number;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: number;

  @CreateDateColumn({ name: 'applied_at' })
  appliedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Staff, { eager: true })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @ManyToOne(() => Staff, { eager: true })
  @JoinColumn({ name: 'approved_by' })
  approver: Staff;
}
