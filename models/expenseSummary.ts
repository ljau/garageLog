export interface ExpenseSummary {
  total: number;
  monthly: number;
  yearly: number;
}

export interface VehicleExpense {
  vehicleId: string;
  nickname: string;
  brand: string;
  model: string;
  year: number;
  total: number;
  recordCount: number;
}

export interface VehicleExpenseRow {
  vehicle_id: string;
  nickname: string;
  brand: string;
  model: string;
  year: number;
  total: number;
  record_count: number;
}
