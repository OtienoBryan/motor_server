import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { KeyAccount } from './key-account.entity';
import { Vehicle } from './vehicle.entity';
import { Station } from './station.entity';

export enum KeyAccountTransactionType {
  SALE = 'SALE',
  PAYMENT = 'PAYMENT',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('key_account_ledger')
export class KeyAccountLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key_account_id' })
  keyAccountId: number;

  @ManyToOne(() => KeyAccount)
  @JoinColumn({ name: 'key_account_id' })
  keyAccount?: KeyAccount;

  @Column({ name: 'vehicle_id', nullable: true })
  vehicleId?: number;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: Vehicle;

  @Column({ name: 'station_id' })
  stationId: number;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'station_id' })
  station?: Station;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: Date;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: KeyAccountTransactionType,
  })
  transactionType: KeyAccountTransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 })
  unitPrice: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  debit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  credit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  balance: number;

  @Column({ name: 'reference_number', type: 'varchar', length: 255, nullable: true })
  referenceNumber?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

