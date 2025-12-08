import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Station } from './station.entity';

@Entity('FuelPrices')
export class FuelPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stationId', type: 'int' })
  stationId: number;

  @ManyToOne(() => Station)
  @JoinColumn({ name: 'stationId' })
  station?: Station;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fuelType: string | null; // e.g., 'Regular', 'Premium', 'Diesel'

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

