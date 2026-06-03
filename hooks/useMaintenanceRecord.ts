import { useCallback, useEffect, useState } from 'react';

import { getMaintenanceRecordById } from '@/database/maintenanceRepository';
import type { MaintenanceRecord } from '@/models/maintenanceRecord';
import { useDatabase } from '@/providers/DatabaseProvider';

interface UseMaintenanceRecordResult {
  record: MaintenanceRecord | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useMaintenanceRecord(
  id: string | undefined,
): UseMaintenanceRecordResult {
  const { isReady, refreshKey } = useDatabase();
  const [record, setRecord] = useState<MaintenanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady || !id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getMaintenanceRecordById(id);
      setRecord(result);
      if (!result) {
        setError(new Error('Maintenance record not found'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load maintenance record'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady, id]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { record, isLoading, error, reload };
}
