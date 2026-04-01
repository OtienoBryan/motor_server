import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

export interface VisibilityReportRow {
  id: number;
  opening: number | null;
  openingImage: string | null;
  openAt: string | null;
  stationId: number;
  userId: number;
  report_date: string | null;
  reportId: number;
  nozzleId: number;
  closing: number | null;
  closingImage: string | null;
  closedAt: string | null;
}

@Injectable()
export class VisibilityReportsService {
  constructor(private dataSource: DataSource) {}

  async findAll(
    startDate?: string,
    endDate?: string,
    stationId?: number,
    userId?: number,
  ): Promise<VisibilityReportRow[]> {
    console.log('📋 [VisibilityReportsService] Finding visibility reports with filters:', {
      startDate,
      endDate,
      stationId,
      userId,
    });

    const conditions: string[] = [];
    const params: any[] = [];

    if (startDate) {
      conditions.push('DATE(vr.report_date) >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('DATE(vr.report_date) <= ?');
      params.push(endDate);
    }
    if (stationId) {
      conditions.push('vr.stationId = ?');
      params.push(stationId);
    }
    if (userId) {
      conditions.push('vr.userId = ?');
      params.push(userId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT
        vr.id,
        vr.opening,
        vr.openingImage,
        vr.openAt,
        vr.stationId,
        vr.userId,
        vr.report_date,
        vr.reportId,
        vr.nozzleId,
        vr.closing,
        vr.closingImage,
        vr.closedAt
      FROM VisibilityReport vr
      ${whereClause}
      ORDER BY vr.report_date DESC, vr.openAt DESC, vr.id DESC
    `;

    const rows = await this.dataSource.query(query, params);
    console.log(`✅ [VisibilityReportsService] Found ${rows.length} visibility report rows`);
    return rows;
  }
}
