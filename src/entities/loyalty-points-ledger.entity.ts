import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { KeyAccount } from './key-account.entity';
import { Sale } from './sale.entity';

@Entity('loyalty_points_ledger')
export class LoyaltyPointsLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key_account_id' })
  keyAccountId: number;

  @ManyToOne(() => KeyAccount)
  @JoinColumn({ name: 'key_account_id' })
  keyAccount?: KeyAccount;

  @Column({ name: 'sale_id', nullable: true })
  saleId?: number;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'sale_id' })
  sale?: Sale;

  @Column({ name: 'transaction_date', type: 'datetime' })
  transactionDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  litres: number;

  @Column({ name: 'points_rate', type: 'decimal', precision: 10, scale: 2, default: 10 })
  pointsRate: number;

  @Column({ name: 'points_awarded', type: 'decimal', precision: 15, scale: 2, default: 0 })
  pointsAwarded: number;

  @Column({ name: 'balance_after', type: 'decimal', precision: 15, scale: 2, default: 0 })
  balanceAfter: number;

  @Column({ name: 'reference_number', type: 'varchar', length: 255, nullable: true })
  referenceNumber?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

