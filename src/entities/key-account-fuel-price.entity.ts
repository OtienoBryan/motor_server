import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { KeyAccount } from './key-account.entity';
import { Staff } from './staff.entity';

@Entity('KeyAccountFuelPrices')
export class KeyAccountFuelPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'keyAccountId', type: 'int' })
  keyAccountId: number;

  @ManyToOne(() => KeyAccount)
  @JoinColumn({ name: 'keyAccountId' })
  keyAccount?: KeyAccount;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'updatedBy', type: 'int', nullable: true })
  updatedBy: number | null;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'updatedBy' })
  updatedByStaff?: Staff;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
