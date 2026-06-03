export interface Vehicle {
  id: string;
  nickname: string;
  brand: string;
  model: string;
  year: number;
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
  plate_number: string | null;
  current_mileage: number;
  created_at: string;
}

export function rowToVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    nickname: row.nickname,
    brand: row.brand,
    model: row.model,
    year: row.year,
    plateNumber: row.plate_number ?? undefined,
    currentMileage: row.current_mileage,
    createdAt: row.created_at,
  };
}
