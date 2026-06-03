import { useEffect } from 'react';
import type { ReactNode } from 'react';

import { syncScheduledReminderNotifications } from '@/database/reminderRepository';
import { ensureNotificationInfrastructure } from '@/lib/notifications';
import { useDatabase } from '@/providers/DatabaseProvider';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isReady } = useDatabase();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    let cancelled = false;

    async function init() {
      try {
        await ensureNotificationInfrastructure();
        if (!cancelled) {
          await syncScheduledReminderNotifications();
        }
      } catch {
        // Sync failures should not block the app; reminders can be rescheduled on edit.
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, [isReady]);

  return children;
}
