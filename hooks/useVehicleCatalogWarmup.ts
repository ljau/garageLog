import { useEffect } from 'react';

import { useDatabase } from '@/providers/DatabaseProvider';

export function useVehicleCatalogWarmup(): void {
  const { isReady } = useDatabase();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const timer = setTimeout(() => {
      void import('@/data/vehicleBrandCatalog').then(({ getBrandCatalog }) => {
        getBrandCatalog();
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [isReady]);
}
