import { useCallback, useEffect, useState } from 'react';

import {
  getDashboardReminders,
  type DashboardReminder,
} from '@/database/reminderRepository';
import { useDatabase } from '@/providers/DatabaseProvider';

interface UseDashboardRemindersResult {
  reminders: DashboardReminder[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useDashboardReminders(limit = 5): UseDashboardRemindersResult {
  const { isReady, refreshKey } = useDatabase();
  const [reminders, setReminders] = useState<DashboardReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getDashboardReminders(limit);
      setReminders(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load reminders'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady, limit]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { reminders, isLoading, error, reload };
}
