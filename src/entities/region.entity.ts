import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Country } from './country.entity';

@Entity('Regions')
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 191 })
  name: string;

  @Column({ name: 'countryId', type: 'int' })
  countryId: number;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'countryId' })
  country?: Country;

  @Column({ type: 'int', nullable: true, default: 0 })
  status: number; // 0 = inactive, 1 = active
}
