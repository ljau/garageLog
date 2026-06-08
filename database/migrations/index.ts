import type { Migration } from '@/database/migrations/types';
import { v1AddVehicleCategory } from '@/database/migrations/v1_add_vehicle_category';
import { v2RepairStaleMileages } from '@/database/migrations/v2_repair_stale_mileages';
import { v3MaintenanceIndexes } from '@/database/migrations/v3_maintenance_indexes';

export const migrations: readonly Migration[] = [
  v1AddVehicleCategory,
  v2RepairStaleMileages,
  v3MaintenanceIndexes,
];
