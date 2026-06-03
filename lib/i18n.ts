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

export function t(key: TranslationKey): string {
  return catalogs[locale][key];
}

export type { TranslationKey };
