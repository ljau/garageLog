export const REMINDER_TYPES = [
  'oil_change',
  'insurance_renewal',
  'tire_rotation',
] as const;

export type ReminderType = (typeof REMINDER_TYPES)[number];

export interface Reminder {
  id: string;
  vehicleId: string;
  type: ReminderType;
  scheduledAt: string;
  notificationId: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderRow {
  id: string;
  vehicle_id: string;
  type: string;
  scheduled_at: string;
  notification_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function rowToReminder(row: ReminderRow): Reminder {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    type: row.type as ReminderType,
    scheduledAt: row.scheduled_at,
    notificationId: row.notification_id,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isReminderType(value: string): value is ReminderType {
  return (REMINDER_TYPES as readonly string[]).includes(value);
}
