import { useCallback, useEffect, useState } from 'react';

import { getReminderById } from '@/database/reminderRepository';
import type { Reminder } from '@/models/reminder';
import { useDatabase } from '@/providers/DatabaseProvider';

interface UseReminderResult {
  reminder: Reminder | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useReminder(id: string | undefined): UseReminderResult {
  const { isReady, refreshKey } = useDatabase();
  const [reminder, setReminder] = useState<Reminder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady || !id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getReminderById(id);
      setReminder(result);
      if (!result) {
        setError(new Error('Reminder not found'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load reminder'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady, id]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { reminder, isLoading, error, reload };
}
