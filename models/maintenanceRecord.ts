export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  description: string;
  cost?: number;
  mileage: number;
  serviceDate: string;
  notes?: string;
  createdAt: string;
}

export interface MaintenanceRecordRow {
  id: string;
  vehicle_id: string;
  type: string;
  description: string;
  cost: number | null;
  mileage: number;
  service_date: string;
  notes: string | null;
  created_at: string;
}

export function rowToMaintenanceRecord(row: MaintenanceRecordRow): MaintenanceRecord {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    type: row.type,
    description: row.description,
    cost: row.cost ?? undefined,
    mileage: row.mileage,
    serviceDate: row.service_date,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
  };
}
