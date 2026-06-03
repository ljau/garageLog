import { Platform } from 'react-native';

import { areLocalNotificationsAvailable } from '@/lib/notificationsModule';
import { t } from '@/lib/i18n';

export function getNotificationUnavailableNotice(): string | null {
  if (Platform.OS === 'web') {
    return t('notificationsUnavailableOnWeb');
  }
  if (!areLocalNotificationsAvailable()) {
    return t('notificationsUnavailableInExpoGo');
  }
  return null;
}
