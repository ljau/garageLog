import dayjs from 'dayjs';
import { Platform } from 'react-native';

import { t } from '@/lib/i18n';
import {
  areLocalNotificationsAvailable,
  loadNotificationsModule,
} from '@/lib/notificationsModule';
import { reminderTypeLabel } from '@/lib/reminders';
import type { Reminder, ReminderType } from '@/models/reminder';

export { areLocalNotificationsAvailable } from '@/lib/notificationsModule';

export const REMINDER_NOTIFICATION_CHANNEL_ID = 'garagelog-reminders';

export async function ensureNotificationInfrastructure(): Promise<void> {
  const Notifications = await loadNotificationsModule();
  if (!Notifications || Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(REMINDER_NOTIFICATION_CHANNEL_ID, {
    name: t('reminderChannelName'),
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!areLocalNotificationsAvailable()) {
    return false;
  }

  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    return false;
  }

  await ensureNotificationInfrastructure();

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === 'granted') {
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function buildReminderNotificationContent(
  type: ReminderType,
  vehicleNickname: string,
  reminderId: string,
  vehicleId: string,
) {
  return {
    title: t('reminderNotificationTitle', { type: reminderTypeLabel(type) }),
    body: t('reminderNotificationBody', {
      type: reminderTypeLabel(type),
      vehicle: vehicleNickname,
    }),
    data: {
      reminderId,
      vehicleId,
      url: `/vehicles/${vehicleId}/reminders`,
    },
    ...(Platform.OS === 'android'
      ? { channelId: REMINDER_NOTIFICATION_CHANNEL_ID }
      : {}),
  };
}

export async function scheduleReminderNotification(
  reminder: Reminder,
  vehicleNickname: string,
): Promise<string | null> {
  if (!areLocalNotificationsAvailable()) {
    return null;
  }

  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    return null;
  }

  const triggerDate = dayjs(reminder.scheduledAt);
  if (!triggerDate.isAfter(dayjs())) {
    throw new Error(t('reminderMustBeFuture'));
  }

  const granted = await requestNotificationPermissions();
  if (!granted) {
    throw new Error(t('notificationPermissionDenied'));
  }

  return Notifications.scheduleNotificationAsync({
    content: buildReminderNotificationContent(
      reminder.type,
      vehicleNickname,
      reminder.id,
      reminder.vehicleId,
    ),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate.toDate(),
    },
  });
}

export async function cancelReminderNotification(
  notificationId: string | null,
): Promise<void> {
  if (!notificationId || !areLocalNotificationsAvailable()) {
    return;
  }

  const Notifications = await loadNotificationsModule();
  if (!Notifications) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Notification may already have fired or been cleared by the OS.
  }
}
