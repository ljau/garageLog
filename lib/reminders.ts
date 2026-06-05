import dayjs from 'dayjs';

import { t } from '@/lib/i18n';
import type { ReminderType } from '@/models/reminder';

export interface ReminderDueStatus {
  label: string;
  isOverdue: boolean;
}

export function reminderTypeLabel(type: ReminderType): string {
  switch (type) {
    case 'oil_change':
      return t('reminderType_oil_change');
    case 'insurance_renewal':
      return t('reminderType_insurance_renewal');
    case 'tire_rotation':
      return t('reminderType_tire_rotation');
  }
}

export function reminderTypeIcon(type: ReminderType): string {
  switch (type) {
    case 'oil_change':
      return 'oil';
    case 'insurance_renewal':
      return 'shield-car';
    case 'tire_rotation':
      return 'tire';
  }
}

export function formatReminderDueStatus(scheduledAt: string): ReminderDueStatus {
  const today = dayjs().startOf('day');
  const dueDay = dayjs(scheduledAt).startOf('day');
  const diffDays = dueDay.diff(today, 'day');

  if (diffDays < 0) {
    return { label: t('reminderOverdue'), isOverdue: true };
  }
  if (diffDays === 0) {
    return { label: t('reminderDueToday'), isOverdue: false };
  }
  if (diffDays === 1) {
    return { label: t('reminderDueTomorrow'), isOverdue: false };
  }

  return {
    label: t('reminderDueInDays', { count: String(diffDays) }),
    isOverdue: false,
  };
}
