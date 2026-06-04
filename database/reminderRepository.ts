import * as Crypto from 'expo-crypto';
import dayjs from 'dayjs';

import { getDatabase } from '@/database/db';
import { getVehicleById } from '@/database/vehicleRepository';
import {
  cancelReminderNotification,
  scheduleReminderNotification,
} from '@/lib/notifications';
import { formatVehicleDisplayName } from '@/lib/format';
import {
  rowToReminder,
  type Reminder,
  type ReminderRow,
  type ReminderType,
} from '@/models/reminder';
import {
  reminderFormToScheduledAt,
  type ReminderFormValues,
} from '@/schemas/reminderForm';

async function scheduleAndPersistNotification(
  reminder: Reminder,
  vehicleNickname: string,
): Promise<string | null> {
  const notificationId = await scheduleReminderNotification(reminder, vehicleNickname);
  const db = await getDatabase();
  const updatedAt = dayjs().toISOString();

  await db.runAsync(
    `UPDATE reminders SET notification_id = ?, updated_at = ? WHERE id = ?`,
    notificationId,
    updatedAt,
    reminder.id,
  );

  return notificationId;
}

export async function insertReminder(
  vehicleId: string,
  input: ReminderFormValues,
): Promise<Reminder> {
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  const db = await getDatabase();
  const id = Crypto.randomUUID();
  const now = dayjs().toISOString();
  const scheduledAt = reminderFormToScheduledAt(input);
  const notes = input.notes?.trim() || null;

  await db.runAsync(
    `INSERT INTO reminders (
      id, vehicle_id, type, scheduled_at, notification_id, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    vehicleId,
    input.type,
    scheduledAt,
    null,
    notes,
    now,
    now,
  );

  const reminder: Reminder = {
    id,
    vehicleId,
    type: input.type,
    scheduledAt,
    notificationId: null,
    notes: notes ?? undefined,
    createdAt: now,
    updatedAt: now,
  };

  const notificationId = await scheduleAndPersistNotification(
    reminder,
    formatVehicleDisplayName(vehicle),
  );
  return { ...reminder, notificationId, updatedAt: dayjs().toISOString() };
}

export async function updateReminder(
  id: string,
  input: ReminderFormValues,
): Promise<Reminder> {
  const existing = await getReminderById(id);
  if (!existing) {
    throw new Error('Reminder not found');
  }

  const vehicle = await getVehicleById(existing.vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  await cancelReminderNotification(existing.notificationId);

  const db = await getDatabase();
  const updatedAt = dayjs().toISOString();
  const scheduledAt = reminderFormToScheduledAt(input);
  const notes = input.notes?.trim() || null;

  const result = await db.runAsync(
    `UPDATE reminders SET
      type = ?,
      scheduled_at = ?,
      notification_id = ?,
      notes = ?,
      updated_at = ?
    WHERE id = ?`,
    input.type,
    scheduledAt,
    null,
    notes,
    updatedAt,
    id,
  );

  if (result.changes === 0) {
    throw new Error('Reminder not found');
  }

  const reminder: Reminder = {
    ...existing,
    type: input.type,
    scheduledAt,
    notificationId: null,
    notes: notes ?? undefined,
    updatedAt,
  };

  const notificationId = await scheduleAndPersistNotification(
    reminder,
    formatVehicleDisplayName(vehicle),
  );
  return { ...reminder, notificationId };
}

export async function deleteReminder(id: string): Promise<void> {
  const existing = await getReminderById(id);
  if (!existing) {
    throw new Error('Reminder not found');
  }

  await cancelReminderNotification(existing.notificationId);

  const db = await getDatabase();
  const result = await db.runAsync(`DELETE FROM reminders WHERE id = ?`, id);

  if (result.changes === 0) {
    throw new Error('Reminder not found');
  }
}

export async function getReminderById(id: string): Promise<Reminder | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ReminderRow>(
    `SELECT * FROM reminders WHERE id = ?`,
    id,
  );
  return row ? rowToReminder(row) : null;
}

export async function getRemindersByVehicleId(vehicleId: string): Promise<Reminder[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ReminderRow>(
    `SELECT * FROM reminders WHERE vehicle_id = ? ORDER BY scheduled_at ASC`,
    vehicleId,
  );
  return rows.map(rowToReminder);
}

export async function getUpcomingReminders(): Promise<Reminder[]> {
  const db = await getDatabase();
  const now = dayjs().toISOString();
  const rows = await db.getAllAsync<ReminderRow>(
    `SELECT * FROM reminders WHERE scheduled_at > ? ORDER BY scheduled_at ASC`,
    now,
  );
  return rows.map(rowToReminder);
}

export async function syncScheduledReminderNotifications(): Promise<void> {
  const reminders = await getUpcomingReminders();

  for (const reminder of reminders) {
    const vehicle = await getVehicleById(reminder.vehicleId);
    if (!vehicle) {
      continue;
    }

    await cancelReminderNotification(reminder.notificationId);
    await scheduleAndPersistNotification(reminder, formatVehicleDisplayName(vehicle));
  }
}
