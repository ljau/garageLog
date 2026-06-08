import * as Crypto from 'expo-crypto';
import dayjs from 'dayjs';

import { getDatabase } from '@/database/db';
import {
  maybeBumpVehicleMileage,
  recalculateVehicleCurrentMileage,
} from '@/database/mileageSync';
import {
  rowToMaintenanceRecord,
  type MaintenanceRecord,
  type MaintenanceRecordRow,
} from '@/models/maintenanceRecord';
import type { MaintenanceFormValues } from '@/schemas/maintenanceForm';

export async function insertMaintenanceRecord(
  vehicleId: string,
  input: MaintenanceFormValues,
): Promise<MaintenanceRecord> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const createdAt = dayjs().toISOString();
  const notes = input.notes?.trim() || null;
  const cost = input.cost ?? null;

  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync(
      `INSERT INTO maintenance_records (
        id, vehicle_id, type, description, cost, mileage, service_date, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      vehicleId,
      input.type.trim(),
      input.description.trim(),
      cost,
      input.mileage,
      input.serviceDate,
      notes,
      createdAt,
    );

    await maybeBumpVehicleMileage(vehicleId, input.mileage, txn);
  });

  return {
    id,
    vehicleId,
    type: input.type.trim(),
    description: input.description.trim(),
    cost: cost ?? undefined,
    mileage: input.mileage,
    serviceDate: input.serviceDate,
    notes: notes ?? undefined,
    createdAt,
  };
}

export async function getMaintenanceRecordById(
  id: string,
): Promise<MaintenanceRecord | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<MaintenanceRecordRow>(
    `SELECT * FROM maintenance_records WHERE id = ?`,
    id,
  );
  return row ? rowToMaintenanceRecord(row) : null;
}

export async function getMaintenanceRecordsByVehicleId(
  vehicleId: string,
): Promise<MaintenanceRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<MaintenanceRecordRow>(
    `SELECT * FROM maintenance_records WHERE vehicle_id = ? ORDER BY service_date DESC, created_at DESC`,
    vehicleId,
  );
  return rows.map(rowToMaintenanceRecord);
}

export async function updateMaintenanceRecord(
  id: string,
  input: MaintenanceFormValues,
): Promise<MaintenanceRecord> {
  const db = await getDatabase();
  const notes = input.notes?.trim() || null;
  const cost = input.cost ?? null;

  const existing = await db.getFirstAsync<MaintenanceRecordRow>(
    `SELECT * FROM maintenance_records WHERE id = ?`,
    id,
  );

  if (!existing) {
    throw new Error('Maintenance record not found');
  }

  await db.withExclusiveTransactionAsync(async (txn) => {
    const result = await txn.runAsync(
      `UPDATE maintenance_records SET
        type = ?,
        description = ?,
        cost = ?,
        mileage = ?,
        service_date = ?,
        notes = ?
      WHERE id = ?`,
      input.type.trim(),
      input.description.trim(),
      cost,
      input.mileage,
      input.serviceDate,
      notes,
      id,
    );

    if (result.changes === 0) {
      throw new Error('Maintenance record not found');
    }

    await recalculateVehicleCurrentMileage(existing.vehicle_id, txn);
  });

  const row = await db.getFirstAsync<MaintenanceRecordRow>(
    `SELECT * FROM maintenance_records WHERE id = ?`,
    id,
  );

  if (!row) {
    throw new Error('Maintenance record not found');
  }

  return rowToMaintenanceRecord(row);
}

export async function deleteMaintenanceRecord(id: string): Promise<void> {
  const db = await getDatabase();

  const existing = await db.getFirstAsync<MaintenanceRecordRow>(
    `SELECT * FROM maintenance_records WHERE id = ?`,
    id,
  );

  if (!existing) {
    throw new Error('Maintenance record not found');
  }

  await db.withExclusiveTransactionAsync(async (txn) => {
    const result = await txn.runAsync(
      `DELETE FROM maintenance_records WHERE id = ?`,
      id,
    );

    if (result.changes === 0) {
      throw new Error('Maintenance record not found');
    }

    await recalculateVehicleCurrentMileage(existing.vehicle_id, txn);
  });
}
