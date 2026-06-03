import { useCallback, useEffect, useState } from 'react';

import { getExpenseSummary, getExpensesByVehicle } from '@/database/expenseRepository';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { ExpenseSummary, VehicleExpense } from '@/models/expenseSummary';

interface UseExpenseSummaryResult {
  summary: ExpenseSummary;
  byVehicle: VehicleExpense[];
  isLoading: boolean;
  error: Error | null;
  reload: () => Promise<void>;
}

const emptySummary: ExpenseSummary = { total: 0, monthly: 0, yearly: 0 };

export function useExpenseSummary(): UseExpenseSummaryResult {
  const { isReady, refreshKey } = useDatabase();
  const [summary, setSummary] = useState<ExpenseSummary>(emptySummary);
  const [byVehicle, setByVehicle] = useState<VehicleExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    if (!isReady) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [expenseSummary, vehicleExpenses] = await Promise.all([
        getExpenseSummary(),
        getExpensesByVehicle(),
      ]);
      setSummary(expenseSummary);
      setByVehicle(vehicleExpenses);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load expense summary'));
    } finally {
      setIsLoading(false);
    }
  }, [isReady]);

  useEffect(() => {
    void reload();
  }, [reload, refreshKey]);

  return { summary, byVehicle, isLoading, error, reload };
}
