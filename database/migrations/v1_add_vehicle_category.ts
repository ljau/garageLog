import type { Migration } from '@/database/migrations/types';

export const v1AddVehicleCategory: Migration = {
  version: 1,
  async up(db) {
    const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(vehicles)`);
    const hasCategory = columns.some((column) => column.name === 'category');

    if (!hasCategory) {
      await db.execAsync(
        `ALTER TABLE vehicles ADD COLUMN category TEXT NOT NULL DEFAULT 'car';`,
      );
    }
  },
};
