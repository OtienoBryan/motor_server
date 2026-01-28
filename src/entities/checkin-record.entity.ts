import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Staff } from './staff.entity';
import { Station } from './station.entity';

@Entity('checkin_records')
export class CheckinRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'user_name', nullable: true })
  userName: string;

  @Column({ name: 'station_id' })
  stationId: number;

  @Column({ name: 'station_name', nullable: true })
  stationName: string;

  @Column({ name: 'check_in_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  checkInLatitude: number;

  @Column({ name: 'check_in_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  checkInLongitude: number;

  @Column({ name: 'check_out_latitude', type: 'decimal', precision: 10, scale: 8, nullable: true })
  checkOutLatitude: number;

  @Column({ name: 'check_out_longitude', type: 'decimal', precision: 11, scale: 8, nullable: true })
  checkOutLongitude: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ name: 'time_in', type: 'datetime', nullable: true })
  timeIn: Date;

  @Column({ name: 'time_out', type: 'datetime', nullable: true })
  timeOut: Date;

  @Column({ name: 'qr_data', nullable: true })
  qrData: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Staff, { eager: true })
  @JoinColumn({ name: 'user_id' })
  staff: Staff;

  @ManyToOne(() => Station, { eager: true })
  @JoinColumn({ name: 'station_id' })
  station: Station;
}
