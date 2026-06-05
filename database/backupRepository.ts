import dayjs from 'dayjs';

import { getDatabase } from '@/database/db';
import { getAllMaintenanceRecords } from '@/database/maintenanceRepository';
import {
  getAllReminders,
  syncScheduledReminderNotifications,
} from '@/database/reminderRepository';
import { getAllVehicles } from '@/database/vehicleRepository';
import { cancelReminderNotification } from '@/lib/notifications';
import type { MaintenanceRecord } from '@/models/maintenanceRecord';
import type { Reminder } from '@/models/reminder';
import type { BackupFile } from '@/schemas/backup';

export interface BackupSnapshotCounts {
  vehicles: number;
  maintenanceRecords: number;
  reminders: number;
}

export async function createBackupSnapshot(): Promise<BackupFile> {
  const [vehicles, maintenanceRecords, reminders] = await Promise.all([
    getAllVehicles(),
    getAllMaintenanceRecords(),
    getAllReminders(),
  ]);

  return {
    version: 1,
    exportedAt: dayjs().toISOString(),
    app: 'GarageLog',
    data: {
      vehicles,
      maintenanceRecords: maintenanceRecords.map(stripMaintenanceForBackup),
      reminders: reminders.map(stripReminderForBackup),
    },
  };
}

export async function restoreBackupSnapshot(backup: BackupFile): Promise<BackupSnapshotCounts> {
  const db = await getDatabase();
  const existingReminders = await getAllReminders();

  for (const reminder of existingReminders) {
    await cancelReminderNotification(reminder.notificationId);
  }

  await db.withExclusiveTransactionAsync(async (txn) => {
    await txn.runAsync(`PRAGMA foreign_keys = ON`);
    await txn.runAsync(`DELETE FROM reminders`);
    await txn.runAsync(`DELETE FROM maintenance_records`);
    await txn.runAsync(`DELETE FROM vehicles`);

    for (const vehicle of backup.data.vehicles) {
      await txn.runAsync(
        `INSERT INTO vehicles (
          id, nickname, brand, model, year, category, plate_number, current_mileage, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        vehicle.id,
        vehicle.nickname,
        vehicle.brand,
        vehicle.model,
        vehicle.year,
        vehicle.category,
        vehicle.plateNumber?.trim() || null,
        vehicle.currentMileage,
        vehicle.createdAt,
      );
    }

    for (const record of backup.data.maintenanceRecords) {
      await txn.runAsync(
        `INSERT INTO maintenance_records (
          id, vehicle_id, type, description, cost, mileage, service_date, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        record.id,
        record.vehicleId,
        record.type,
        record.description,
        record.cost ?? null,
        record.mileage,
        record.serviceDate,
        record.notes?.trim() || null,
        record.createdAt,
      );
    }

    for (const reminder of backup.data.reminders) {
      await txn.runAsync(
        `INSERT INTO reminders (
          id, vehicle_id, type, scheduled_at, notification_id, notes, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        reminder.id,
        reminder.vehicleId,
        reminder.type,
        reminder.scheduledAt,
        null,
        reminder.notes?.trim() || null,
        reminder.createdAt,
        reminder.updatedAt,
      );
    }
  });

  await syncScheduledReminderNotifications();

  return {
    vehicles: backup.data.vehicles.length,
    maintenanceRecords: backup.data.maintenanceRecords.length,
    reminders: backup.data.reminders.length,
  };
}

function stripMaintenanceForBackup(
  record: MaintenanceRecord,
): BackupFile['data']['maintenanceRecords'][number] {
  return {
    id: record.id,
    vehicleId: record.vehicleId,
    type: record.type,
    description: record.description,
    cost: record.cost,
    mileage: record.mileage,
    serviceDate: record.serviceDate,
    notes: record.notes,
    createdAt: record.createdAt,
  };
}

function stripReminderForBackup(
  reminder: Reminder,
): BackupFile['data']['reminders'][number] {
  return {
    id: reminder.id,
    vehicleId: reminder.vehicleId,
    type: reminder.type,
    scheduledAt: reminder.scheduledAt,
    notes: reminder.notes,
    createdAt: reminder.createdAt,
    updatedAt: reminder.updatedAt,
  };
}
