import { useCallback, useEffect, useState } from 'react';

import { getMaintenanceRecordsByVehicleId } from '@/database/maintenanceRepository';
import type { MaintenanceRecord } from '@/models/maintenanceRecord';
import { useDatabase } from '@/providers/DatabaseProvider';

interface UseMaintenanceRecordsResult {
  records: MaintenanceRecord[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useMaintenanceRecords(
  vehicleId: string | undefined,
): UseMaintenanceRecordsResult {
  const { isReady, refreshKey } = useDatabase();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady || !vehicleId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getMaintenanceRecordsByVehicleId(vehicleId);
      setRecords(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load maintenance records'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady, vehicleId]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { records, isLoading, error, reload };
}
