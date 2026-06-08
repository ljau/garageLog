import { repairStaleVehicleMileages } from '@/database/mileageSync';
import type { Migration } from '@/database/migrations/types';

export const v2RepairStaleMileages: Migration = {
  version: 2,
  async up(db) {
    await repairStaleVehicleMileages(db);
  },
};
