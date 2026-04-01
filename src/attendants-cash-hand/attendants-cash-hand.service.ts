import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface AttendantCashSummaryRow {
  attendantId: number;
  attendantName: string;
  role: string | null;
  cashBalance: number;
}

export interface AttendantCashLedgerRow {
  id: number;
  attendantId: number;
  date: string;
  amountIn: number;
  amountOut: number;
  cashBalance: number;
  reference: string;
  paymentMethod: string;
}

@Injectable()
export class AttendantsCashHandService {
  constructor(private dataSource: DataSource) {}

  async getSummary(): Promise<AttendantCashSummaryRow[]> {
    const query = `
      SELECT
        s.id AS attendantId,
        s.name AS attendantName,
        s.role AS role,
        COALESCE(s.cash_balance, 0) AS cashBalance
      FROM staff s
      WHERE LOWER(COALESCE(s.role, '')) IN ('attendant', 'manager', 'employee')
      ORDER BY s.name ASC
    `;

    return this.dataSource.query(query);
  }

  async getLedger(attendantId: number): Promise<AttendantCashLedgerRow[]> {
    const query = `
      SELECT
        aca.id AS id,
        aca.attendant_id AS attendantId,
        aca.date AS date,
        aca.amount_in AS amountIn,
        aca.amount_out AS amountOut,
        aca.cash_balance AS cashBalance,
        aca.reference AS reference,
        aca.payment_method AS paymentMethod
      FROM attendants_cash_account aca
      WHERE aca.attendant_id = ?
      ORDER BY aca.id DESC
    `;

    return this.dataSource.query(query, [attendantId]);
  }
}
