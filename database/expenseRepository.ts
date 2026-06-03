import dayjs from 'dayjs';

import { getDatabase } from '@/database/db';
import type { ExpenseSummary, VehicleExpense, VehicleExpenseRow } from '@/models/expenseSummary';

function rowToVehicleExpense(row: VehicleExpenseRow): VehicleExpense {
  return {
    vehicleId: row.vehicle_id,
    nickname: row.nickname,
    brand: row.brand,
    model: row.model,
    year: row.year,
    total: row.total,
    recordCount: row.record_count,
  };
}

export async function getTotalExpenses(): Promise<number> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ total: number | null }>(
    `SELECT COALESCE(SUM(cost), 0) AS total
     FROM maintenance_records
     WHERE cost IS NOT NULL`,
  );
  return result?.total ?? 0;
}

export async function getMonthlyExpenses(referenceDate = dayjs()): Promise<number> {
  const db = await getDatabase();
  const period = referenceDate.format('YYYY-MM');
  const result = await db.getFirstAsync<{ total: number | null }>(
    `SELECT COALESCE(SUM(cost), 0) AS total
     FROM maintenance_records
     WHERE cost IS NOT NULL
       AND strftime('%Y-%m', service_date) = ?`,
    period,
  );
  return result?.total ?? 0;
}

export async function getYearlyExpenses(referenceDate = dayjs()): Promise<number> {
  const db = await getDatabase();
  const year = referenceDate.format('YYYY');
  const result = await db.getFirstAsync<{ total: number | null }>(
    `SELECT COALESCE(SUM(cost), 0) AS total
     FROM maintenance_records
     WHERE cost IS NOT NULL
       AND strftime('%Y', service_date) = ?`,
    year,
  );
  return result?.total ?? 0;
}

export async function getExpenseSummary(): Promise<ExpenseSummary> {
  const [total, monthly, yearly] = await Promise.all([
    getTotalExpenses(),
    getMonthlyExpenses(),
    getYearlyExpenses(),
  ]);
  return { total, monthly, yearly };
}

export async function getExpensesByVehicle(): Promise<VehicleExpense[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<VehicleExpenseRow>(
    `SELECT
       v.id AS vehicle_id,
       v.nickname,
       v.brand,
       v.model,
       v.year,
       COALESCE(SUM(m.cost), 0) AS total,
       COUNT(m.id) AS record_count
     FROM vehicles v
     LEFT JOIN maintenance_records m
       ON m.vehicle_id = v.id AND m.cost IS NOT NULL
     GROUP BY v.id
     ORDER BY total DESC, v.nickname ASC`,
  );
  return rows.map(rowToVehicleExpense);
}
