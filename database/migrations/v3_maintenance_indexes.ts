import type { Migration } from '@/database/migrations/types';

export const v3MaintenanceIndexes: Migration = {
  version: 3,
  async up(db) {
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_maintenance_vehicle_id
      ON maintenance_records(vehicle_id);

      CREATE INDEX IF NOT EXISTS idx_maintenance_service_date
      ON maintenance_records(service_date);

      CREATE INDEX IF NOT EXISTS idx_maintenance_cost
      ON maintenance_records(cost)
      WHERE cost IS NOT NULL;
    `);
  },
};
