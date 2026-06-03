import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

export type NotificationsModule = typeof import('expo-notifications');

let loadPromise: Promise<NotificationsModule | null> | null = null;
let handlerConfigured = false;

/** Local scheduling is unavailable on web and in Expo Go on Android (SDK 53+). */
export function areLocalNotificationsAvailable(): boolean {
  if (Platform.OS === 'web') {
    return false;
  }
  if (Platform.OS === 'android' && isRunningInExpoGo()) {
    return false;
  }
  return true;
}

export async function loadNotificationsModule(): Promise<NotificationsModule | null> {
  if (!areLocalNotificationsAvailable()) {
    return null;
  }

  if (!loadPromise) {
    loadPromise = import('expo-notifications')
      .then((Notifications) => {
        if (!handlerConfigured) {
          Notifications.setNotificationHandler({
            handleNotification: async () => ({
              shouldPlaySound: true,
              shouldSetBadge: false,
              shouldShowBanner: true,
              shouldShowList: true,
            }),
          });
          handlerConfigured = true;
        }
        return Notifications;
      })
      .catch(() => null);
  }

  return loadPromise;
}
