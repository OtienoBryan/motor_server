import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Station } from './station.entity';

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT'
}

@Entity('InventoryLedger')
export class InventoryLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stationId', type: 'int' })
  stationId: number;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'stationId' })
  station?: Station;

  // Legacy field - kept for backward compatibility during migration
  @Column({ 
    type: 'enum', 
    enum: TransactionType,
    name: 'transactionType',
    nullable: true
  })
  transactionType?: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0, name: 'quantityIn' })
  quantityIn: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0, name: 'quantityOut' })
  quantityOut: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'balance' })
  balance: number;

  // Legacy fields - kept for backward compatibility during migration
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quantity?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0, name: 'previousQuantity' })
  previousQuantity?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'newQuantity' })
  newQuantity?: number;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'referenceNumber' })
  referenceNumber: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'int', nullable: true, name: 'createdBy' })
  createdBy: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

