import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customer_cards')
export class CustomerCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key_account_id', type: 'int' })
  key_account_id: number;

  @Column({ name: 'account_type', type: 'varchar', length: 20 })
  account_type: string;

  @Column({ name: 'card_format', type: 'varchar', length: 20 })
  card_format: string;

  @Column({ name: 'status', type: 'varchar', length: 32, default: 'pending' })
  status: string;

  @Column({ name: 'last_four', type: 'varchar', length: 4, nullable: true })
  last_four: string | null;

  @Column({ name: 'created_at', type: 'datetime', nullable: true })
  created_at: Date | null;

  /** Full PAN — never selected by default (PCI). */
  @Column({ name: 'pan_full', type: 'varchar', length: 19, nullable: true, select: false })
  pan_full: string | null;

  @Column({ name: 'expiry_mm_yy', type: 'varchar', length: 5, nullable: true })
  expiry_mm_yy: string | null;

  /** CVC — never selected by default. */
  @Column({ name: 'cvc', type: 'varchar', length: 4, nullable: true, select: false })
  cvc: string | null;

  @Column({ name: 'points_history', type: 'double', default: 0 })
  points_history: number;

  @Column({ name: 'amount_balance', type: 'double', default: 0 })
  amount_balance: number;
}
