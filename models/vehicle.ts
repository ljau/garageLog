export const VEHICLE_CATEGORIES = ['motorcycle', 'car', 'truck', 'other'] as const;

export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export const DEFAULT_VEHICLE_CATEGORY: VehicleCategory = 'car';

export interface Vehicle {
  id: string;
  nickname: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  plateNumber?: string;
  currentMileage: number;
  createdAt: string;
}

export interface VehicleRow {
  id: string;
  nickname: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  plate_number: string | null;
  current_mileage: number;
  created_at: string;
}

function parseVehicleCategory(value: string): VehicleCategory {
  if ((VEHICLE_CATEGORIES as readonly string[]).includes(value)) {
    return value as VehicleCategory;
  }
  return DEFAULT_VEHICLE_CATEGORY;
}

export function rowToVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    nickname: row.nickname,
    brand: row.brand,
    model: row.model,
    year: row.year,
    category: parseVehicleCategory(row.category),
    plateNumber: row.plate_number ?? undefined,
    currentMileage: row.current_mileage,
    createdAt: row.created_at,
  };
}
