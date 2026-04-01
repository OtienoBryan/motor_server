"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagersCashApprovalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let ManagersCashApprovalsService = class ManagersCashApprovalsService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async ensureAccountTables(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_accounts (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name ENUM('TILL','BANK') NOT NULL UNIQUE,
        balance DECIMAL(11,2) NOT NULL DEFAULT 0.00,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cash_account_ledger (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        account_id INT(11) NOT NULL,
        submission_id INT(11) NULL,
        entry_type ENUM('CREDIT','DEBIT') NOT NULL,
        amount DECIMAL(11,2) NOT NULL,
        balance_after DECIMAL(11,2) NOT NULL,
        reference VARCHAR(200) NOT NULL,
        comment VARCHAR(255) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_cash_account_ledger_account_id (account_id),
        INDEX idx_cash_account_ledger_submission_id (submission_id)
      )
    `);
    }
    async findAll(status, destination, managerId, startDate, endDate) {
        const conditions = [];
        const params = [];
        if (status) {
            conditions.push('m.status = ?');
            params.push(status);
        }
        if (destination) {
            conditions.push('m.destination = ?');
            params.push(destination);
        }
        if (managerId) {
            conditions.push('m.manager_id = ?');
            params.push(managerId);
        }
        if (startDate) {
            conditions.push('DATE(m.created_at) >= ?');
            params.push(startDate);
        }
        if (endDate) {
            conditions.push('DATE(m.created_at) <= ?');
            params.push(endDate);
        }
        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT
        m.id AS id,
        m.manager_id AS managerId,
        sm.name AS managerName,
        m.amount AS amount,
        m.destination AS destination,
        m.reference AS reference,
        m.comment AS comment,
        m.status AS status,
        m.created_at AS createdAt,
        m.approved_at AS approvedAt,
        m.approved_by AS approvedBy,
        sa.name AS approvedByName,
        m.rejection_reason AS rejectionReason
      FROM manager_till_bank_submissions m
      LEFT JOIN staff sm ON sm.id = m.manager_id
      LEFT JOIN staff sa ON sa.id = m.approved_by
      ${whereClause}
      ORDER BY m.created_at DESC, m.id DESC
    `;
        return this.dataSource.query(query, params);
    }
    async getCashAccounts() {
        const query = `
      SELECT
        id,
        name,
        balance,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM cash_accounts
      ORDER BY name ASC
    `;
        return this.dataSource.query(query);
    }
    async getCashAccountLedger(accountName, entryType, startDate, endDate) {
        const conditions = [];
        const params = [];
        if (accountName) {
            conditions.push('ca.name = ?');
            params.push(accountName);
        }
        if (entryType) {
            conditions.push('cal.entry_type = ?');
            params.push(entryType);
        }
        if (startDate) {
            conditions.push('DATE(cal.created_at) >= ?');
            params.push(startDate);
        }
        if (endDate) {
            conditions.push('DATE(cal.created_at) <= ?');
            params.push(endDate);
        }
        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT
        cal.id AS id,
        cal.account_id AS accountId,
        ca.name AS accountName,
        cal.submission_id AS submissionId,
        sm.name AS sourceManagerName,
        cal.entry_type AS entryType,
        cal.amount AS amount,
        cal.balance_after AS balanceAfter,
        cal.reference AS reference,
        cal.comment AS comment,
        cal.created_at AS createdAt
      FROM cash_account_ledger cal
      INNER JOIN cash_accounts ca ON ca.id = cal.account_id
      LEFT JOIN manager_till_bank_submissions ms ON ms.id = cal.submission_id
      LEFT JOIN staff sm ON sm.id = ms.manager_id
      ${whereClause}
      ORDER BY cal.created_at DESC, cal.id DESC
    `;
        return this.dataSource.query(query, params);
    }
    async approveSubmission(id, approvedBy) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.ensureAccountTables(queryRunner);
            const submissions = await queryRunner.query(`SELECT * FROM manager_till_bank_submissions WHERE id = ? FOR UPDATE`, [id]);
            const submission = submissions?.[0];
            if (!submission) {
                throw new Error(`Submission with id ${id} not found`);
            }
            if (submission.status !== 'pending') {
                throw new Error(`Only pending submissions can be approved`);
            }
            const amount = Number(submission.amount || 0);
            const managerId = Number(submission.manager_id);
            const destination = String(submission.destination || '').toUpperCase();
            const managerRows = await queryRunner.query(`SELECT id, COALESCE(cash_balance, 0) AS cash_balance FROM staff WHERE id = ? FOR UPDATE`, [managerId]);
            const manager = managerRows?.[0];
            if (!manager) {
                throw new Error(`Manager with id ${managerId} not found`);
            }
            const currentManagerBalance = Number(manager.cash_balance || 0);
            if (currentManagerBalance < amount) {
                throw new Error(`Insufficient manager cash balance`);
            }
            const newManagerBalance = currentManagerBalance - amount;
            await queryRunner.query(`UPDATE staff SET cash_balance = ? WHERE id = ?`, [newManagerBalance, managerId]);
            await queryRunner.query(`INSERT INTO attendants_cash_account
          (attendant_id, date, amount_in, amount_out, cash_balance, reference, payment_method)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                managerId,
                new Date().toISOString(),
                0,
                amount,
                newManagerBalance,
                submission.reference,
                destination,
            ]);
            await queryRunner.query(`INSERT IGNORE INTO cash_accounts (name, balance) VALUES (?, 0.00)`, [destination]);
            const accountRows = await queryRunner.query(`SELECT id, COALESCE(balance, 0) AS balance FROM cash_accounts WHERE name = ? FOR UPDATE`, [destination]);
            const account = accountRows?.[0];
            if (!account) {
                throw new Error(`Failed to load destination account`);
            }
            const newAccountBalance = Number(account.balance || 0) + amount;
            await queryRunner.query(`UPDATE cash_accounts SET balance = ? WHERE id = ?`, [newAccountBalance, account.id]);
            await queryRunner.query(`INSERT INTO cash_account_ledger
          (account_id, submission_id, entry_type, amount, balance_after, reference, comment)
         VALUES (?, ?, 'CREDIT', ?, ?, ?, ?)`, [
                account.id,
                id,
                amount,
                newAccountBalance,
                submission.reference,
                submission.comment || null,
            ]);
            await queryRunner.query(`UPDATE manager_till_bank_submissions
         SET status = 'approved',
             approved_at = NOW(),
             approved_by = ?,
             rejection_reason = NULL
         WHERE id = ?`, [approvedBy || null, id]);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async rejectSubmission(id, rejectionReason, approvedBy) {
        const result = await this.dataSource.query(`UPDATE manager_till_bank_submissions
       SET status = 'rejected',
           approved_at = NOW(),
           approved_by = ?,
           rejection_reason = ?
       WHERE id = ? AND status = 'pending'`, [approvedBy || null, rejectionReason, id]);
        if (!result || result.affectedRows === 0) {
            throw new Error('Submission not found or not pending');
        }
    }
};
exports.ManagersCashApprovalsService = ManagersCashApprovalsService;
exports.ManagersCashApprovalsService = ManagersCashApprovalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ManagersCashApprovalsService);
//# sourceMappingURL=managers-cash-approvals.service.js.map