import { useCallback, useEffect, useState } from 'react';

import {
  getAllVehicles,
  getRecentVehicles,
  getVehicleStats,
  type VehicleStats,
} from '@/database/vehicleRepository';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { Vehicle } from '@/models/vehicle';

interface UseVehiclesResult {
  vehicles: Vehicle[];
  stats: VehicleStats;
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useVehicles(): UseVehiclesResult {
  const { isReady, refreshKey } = useDatabase();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<VehicleStats>({ total: 0, averageMileage: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [allVehicles, vehicleStats] = await Promise.all([
        getAllVehicles(),
        getVehicleStats(),
      ]);
      setVehicles(allVehicles);
      setStats(vehicleStats);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load vehicles'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { vehicles, stats, isLoading, error, reload };
}

interface UseRecentVehiclesResult {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

export function useRecentVehicles(limit = 3): UseRecentVehiclesResult {
  const { isReady, refreshKey } = useDatabase();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const recent = await getRecentVehicles(limit);
      setVehicles(recent);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load recent vehicles'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady, limit]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { vehicles, isLoading, error, reload };
}
