import { useCallback, useEffect, useState } from 'react';

import { getVehicleById } from '@/database/vehicleRepository';
import type { Vehicle } from '@/models/vehicle';
import { useDatabase } from '@/providers/DatabaseProvider';

interface UseVehicleResult {
  vehicle: Vehicle | null;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useVehicle(id: string | undefined): UseVehicleResult {
  const { isReady, refreshKey } = useDatabase();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady || !id) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getVehicleById(id);
      setVehicle(result);
      if (!result) {
        setError(new Error('Vehicle not found'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load vehicle'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady, id]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { vehicle, isLoading, error, reload };
}
