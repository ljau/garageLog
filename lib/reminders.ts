import { t } from '@/lib/i18n';
import type { ReminderType } from '@/models/reminder';

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
