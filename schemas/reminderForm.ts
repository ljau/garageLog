import dayjs from 'dayjs';
import { z } from 'zod';

import { REMINDER_TYPES } from '@/models/reminder';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const reminderFormSchema = z
  .object({
    type: z.enum(REMINDER_TYPES),
    scheduledDate: z
      .string()
      .regex(dateRegex, 'Use YYYY-MM-DD')
      .refine((value) => dayjs(value, 'YYYY-MM-DD', true).isValid(), 'Invalid date'),
    scheduledTime: z.string().regex(timeRegex, 'Invalid time'),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const scheduledAt = dayjs(
      `${data.scheduledDate}T${data.scheduledTime}:00`,
    );
    if (!scheduledAt.isAfter(dayjs())) {
      ctx.addIssue({
        code: 'custom',
        message: 'Reminder must be scheduled in the future',
        path: ['scheduledDate'],
      });
    }
  });

export type ReminderFormValues = z.infer<typeof reminderFormSchema>;

export function reminderFormToScheduledAt(values: ReminderFormValues): string {
  return dayjs(`${values.scheduledDate}T${values.scheduledTime}:00`).toISOString();
}

export function scheduledAtToReminderForm(
  scheduledAt: string,
  type: ReminderFormValues['type'],
  notes = '',
): ReminderFormValues {
  const date = dayjs(scheduledAt);
  return {
    type,
    scheduledDate: date.format('YYYY-MM-DD'),
    scheduledTime: date.format('HH:mm'),
    notes,
  };
}

export function defaultReminderFormValues(): ReminderFormValues {
  const scheduled = dayjs().add(1, 'day').hour(9).minute(0).second(0);
  return {
    type: 'oil_change',
    scheduledDate: scheduled.format('YYYY-MM-DD'),
    scheduledTime: scheduled.format('HH:mm'),
    notes: '',
  };
}
