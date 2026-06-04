import * as Crypto from 'expo-crypto';
import dayjs from 'dayjs';

import { getDatabase } from '@/database/db';
import { rowToVehicle, type Vehicle, type VehicleRow } from '@/models/vehicle';
import type { VehicleFormValues } from '@/schemas/vehicleForm';

export interface VehicleStats {
  total: number;
  averageMileage: number;
}

export async function insertVehicle(input: VehicleFormValues): Promise<Vehicle> {
  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const createdAt = dayjs().toISOString();
  const nickname = input.nickname?.trim() || '';
  const plateNumber = input.plateNumber?.trim() || null;

  await db.runAsync(
    `INSERT INTO vehicles (
      id, nickname, brand, model, year, category, plate_number, current_mileage, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    nickname,
    input.brand.trim(),
    input.model.trim(),
    input.year,
    input.category,
    plateNumber,
    input.currentMileage,
    createdAt,
  );

  return {
    id,
    nickname,
    brand: input.brand.trim(),
    model: input.model.trim(),
    year: input.year,
    category: input.category,
    plateNumber: plateNumber ?? undefined,
    currentMileage: input.currentMileage,
    createdAt,
  };
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<VehicleRow>(
    `SELECT * FROM vehicles WHERE id = ?`,
    id,
  );
  return row ? rowToVehicle(row) : null;
}

export async function getAllVehicles(): Promise<Vehicle[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<VehicleRow>(
    `SELECT * FROM vehicles ORDER BY created_at DESC`,
  );
  return rows.map(rowToVehicle);
}

export async function getRecentVehicles(limit: number): Promise<Vehicle[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<VehicleRow>(
    `SELECT * FROM vehicles ORDER BY created_at DESC LIMIT ?`,
    limit,
  );
  return rows.map(rowToVehicle);
}

export async function updateVehicle(
  id: string,
  input: VehicleFormValues,
): Promise<Vehicle> {
  const db = await getDatabase();
  const nickname = input.nickname?.trim() || '';
  const plateNumber = input.plateNumber?.trim() || null;

  const result = await db.runAsync(
    `UPDATE vehicles SET
      nickname = ?,
      brand = ?,
      model = ?,
      year = ?,
      category = ?,
      plate_number = ?,
      current_mileage = ?
    WHERE id = ?`,
    nickname,
    input.brand.trim(),
    input.model.trim(),
    input.year,
    input.category,
    plateNumber,
    input.currentMileage,
    id,
  );

  if (result.changes === 0) {
    throw new Error('Vehicle not found');
  }

  const row = await db.getFirstAsync<VehicleRow>(
    `SELECT * FROM vehicles WHERE id = ?`,
    id,
  );

  if (!row) {
    throw new Error('Vehicle not found');
  }

  return rowToVehicle(row);
}

export async function deleteVehicle(id: string): Promise<void> {
  const db = await getDatabase();
  const result = await db.runAsync(`DELETE FROM vehicles WHERE id = ?`, id);

  if (result.changes === 0) {
    throw new Error('Vehicle not found');
  }
}

export async function getVehicleStats(): Promise<VehicleStats> {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ total: number; average_mileage: number | null }>(
    `SELECT COUNT(*) AS total, AVG(current_mileage) AS average_mileage FROM vehicles`,
  );

  return {
    total: result?.total ?? 0,
    averageMileage: Math.round(result?.average_mileage ?? 0),
  };
}
