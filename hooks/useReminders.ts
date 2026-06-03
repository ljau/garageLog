import { useCallback, useEffect, useState } from 'react';

import { getRemindersByVehicleId } from '@/database/reminderRepository';
import type { Reminder } from '@/models/reminder';
import { useDatabase } from '@/providers/DatabaseProvider';

interface UseRemindersResult {
  reminders: Reminder[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useReminders(vehicleId: string | undefined): UseRemindersResult {
  const { isReady, refreshKey } = useDatabase();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady || !vehicleId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getRemindersByVehicleId(vehicleId);
      setReminders(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load reminders'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady, vehicleId]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { reminders, isLoading, error, reload };
}
