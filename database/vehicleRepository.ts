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
  const plateNumber = input.plateNumber?.trim() || null;

  await db.runAsync(
    `INSERT INTO vehicles (
      id, nickname, brand, model, year, plate_number, current_mileage, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    input.nickname.trim(),
    input.brand.trim(),
    input.model.trim(),
    input.year,
    plateNumber,
    input.currentMileage,
    createdAt,
  );

  return {
    id,
    nickname: input.nickname.trim(),
    brand: input.brand.trim(),
    model: input.model.trim(),
    year: input.year,
    plateNumber: plateNumber ?? undefined,
    currentMileage: input.currentMileage,
    createdAt,
  };
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
