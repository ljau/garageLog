import { z } from 'zod';

import { REMINDER_TYPES } from '@/models/reminder';
import { VEHICLE_CATEGORIES } from '@/models/vehicle';

const vehicleBackupSchema = z.object({
  id: z.string().uuid(),
  nickname: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int(),
  category: z.enum(VEHICLE_CATEGORIES),
  plateNumber: z.string().optional(),
  currentMileage: z.number().int().min(0),
  createdAt: z.string(),
});

const maintenanceBackupSchema = z.object({
  id: z.string().uuid(),
  vehicleId: z.string().uuid(),
  type: z.string(),
  description: z.string(),
  cost: z.number().min(0).optional(),
  mileage: z.number().int().min(0),
  serviceDate: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

const reminderBackupSchema = z.object({
  id: z.string().uuid(),
  vehicleId: z.string().uuid(),
  type: z.enum(REMINDER_TYPES),
  scheduledAt: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const backupFileSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  app: z.literal('GarageLog'),
  data: z.object({
    vehicles: z.array(vehicleBackupSchema),
    maintenanceRecords: z.array(maintenanceBackupSchema),
    reminders: z.array(reminderBackupSchema),
  }),
});

export type BackupFile = z.infer<typeof backupFileSchema>;
export type BackupVehicle = z.infer<typeof vehicleBackupSchema>;
export type BackupMaintenanceRecord = z.infer<typeof maintenanceBackupSchema>;
export type BackupReminder = z.infer<typeof reminderBackupSchema>;

export class InvalidBackupError extends Error {
  constructor() {
    super('Invalid backup file');
    this.name = 'InvalidBackupError';
  }
}

export function parseBackupFile(raw: unknown): BackupFile {
  const parsed = backupFileSchema.parse(raw);
  validateBackupReferences(parsed);
  return parsed;
}

function validateBackupReferences(backup: BackupFile): void {
  const vehicleIds = new Set(backup.data.vehicles.map((vehicle) => vehicle.id));

  for (const record of backup.data.maintenanceRecords) {
    if (!vehicleIds.has(record.vehicleId)) {
      throw new InvalidBackupError();
    }
  }

  for (const reminder of backup.data.reminders) {
    if (!vehicleIds.has(reminder.vehicleId)) {
      throw new InvalidBackupError();
    }
  }
}
