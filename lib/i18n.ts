const en = {
  appName: 'GarageLog',
  dashboard: 'Dashboard',
  vehicles: 'Vehicles',
  addVehicle: 'Add Vehicle',
  totalVehicles: 'Total vehicles',
  averageMileage: 'Average mileage',
  recentVehicles: 'Recent vehicles',
  noVehiclesYet: 'No vehicles yet',
  noVehiclesDescription: 'Add your first vehicle to start tracking your garage.',
  viewAllVehicles: 'View all vehicles',
  nickname: 'Nickname',
  brand: 'Brand',
  model: 'Model',
  year: 'Year',
  plateNumber: 'Plate number',
  plateNumberOptional: 'Plate number (optional)',
  currentMileage: 'Current mileage',
  saveVehicle: 'Save vehicle',
  vehicleSaved: 'Vehicle saved',
  editVehicle: 'Edit vehicle',
  vehicleDetails: 'Vehicle details',
  updateVehicle: 'Update vehicle',
  vehicleUpdated: 'Vehicle updated',
  deleteVehicle: 'Delete vehicle',
  deleteVehicleTitle: 'Delete vehicle?',
  deleteVehicleMessage: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
  vehicleDeleted: 'Vehicle deleted',
  vehicleNotFound: 'Vehicle not found',
  cancel: 'Cancel',
  delete: 'Delete',
  edit: 'Edit',
  addedOn: 'Added on',
  loading: 'Loading…',
  databaseError: 'Could not load data. Please restart the app.',
  mileageUnit: 'km',
} as const;

type TranslationKey = keyof typeof en;

const catalogs = { en } as const;

type Locale = keyof typeof catalogs;

let locale: Locale = 'en';

export function setLocale(next: Locale): void {
  locale = next;
}

export function getLocale(): Locale {
  return locale;
}

export function t(key: TranslationKey, params?: Record<string, string>): string {
  let text: string = catalogs[locale][key];
  if (params) {
    for (const [paramKey, value] of Object.entries(params)) {
      text = text.replace(`{${paramKey}}`, value);
    }
  }
  return text;
}

export type { TranslationKey };
