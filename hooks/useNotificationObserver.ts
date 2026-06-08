import { router } from 'expo-router';
import { useEffect } from 'react';

import { navigateToRoute } from '@/lib/navigation';
import { areLocalNotificationsAvailable, loadNotificationsModule } from '@/lib/notificationsModule';

function redirectFromNotificationUrl(data: Record<string, unknown> | undefined): void {
  const url = data?.url;
  if (typeof url === 'string') {
    navigateToRoute(url as Parameters<typeof router.navigate>[0]);
  }
}

export function useNotificationObserver(): void {
  useEffect(() => {
    if (!areLocalNotificationsAvailable()) {
      return;
    }

    let subscription: { remove: () => void } | undefined;
    let cancelled = false;

    async function setup() {
      const Notifications = await loadNotificationsModule();
      if (!Notifications || cancelled) {
        return;
      }

      const response = Notifications.getLastNotificationResponse();
      if (response?.notification) {
        redirectFromNotificationUrl(response.notification.request.content.data);
      }

      subscription = Notifications.addNotificationResponseReceivedListener((nextResponse) => {
        redirectFromNotificationUrl(nextResponse.notification.request.content.data);
      });
    }

    void setup();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);
}
