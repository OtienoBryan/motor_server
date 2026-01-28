import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
  HYBRID = 'hybrid',
}

@Entity('conversions')
export class Conversion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'owner_full_name', type: 'varchar', length: 255 })
  ownerFullName: string;

  @Column({ name: 'national_id', type: 'varchar', length: 50, nullable: true })
  nationalId?: string;

  @Column({ name: 'passport_id', type: 'varchar', length: 50, nullable: true })
  passportId?: string;

  @Column({ type: 'varchar', length: 50 })
  contact: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email?: string;

  @Column({ name: 'vehicle_registration', type: 'varchar', length: 50 })
  vehicleRegistration: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  make?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model?: string;

  @Column({ name: 'year_of_manufacture', type: 'int', nullable: true })
  yearOfManufacture?: number;

  @Column({ name: 'engine_capacity', type: 'int', nullable: true })
  engineCapacity?: number;

  @Column({ name: 'vin_chassis_number', type: 'varchar', length: 100, nullable: true })
  vinChassisNumber?: string;

  @Column({
    name: 'current_fuel_type',
    type: 'enum',
    enum: FuelType,
    default: FuelType.PETROL,
  })
  currentFuelType: FuelType;

  @Column({ name: 'logbook_number', type: 'varchar', length: 100, nullable: true })
  logbookNumber?: string;

  @Column({ name: 'scheduled_date', type: 'datetime', nullable: true })
  scheduledDate?: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ['pending', 'approved', 'declined', 'completed'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'declined' | 'completed';

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ name: 'conversion_description', type: 'text', nullable: true })
  conversionDescription?: string;

  @Column({ name: 'conversion_date', type: 'date', nullable: true })
  conversionDate?: Date;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

