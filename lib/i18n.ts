const en = {
  appName: 'GarageLog',
  dashboard: 'Dashboard',
  vehicles: 'Vehicles',
  addVehicle: 'Add Vehicle',
  totalVehicles: 'Total vehicles',
  averageMileage: 'Average mileage',
  nextUp: 'Next up',
  noUpcomingReminders: 'Nothing due soon',
  noUpcomingRemindersDescription:
    'Schedule oil changes, insurance renewals, or tire rotations to see them here.',
  reminderDueInDays: 'in {count} days',
  reminderDueToday: 'today',
  reminderDueTomorrow: 'tomorrow',
  reminderOverdue: 'overdue',
  recentVehicles: 'Recent vehicles',
  noVehiclesYet: 'No vehicles yet',
  noVehiclesDescription: 'Add your first vehicle to start tracking your garage.',
  viewAllVehicles: 'View all vehicles',
  nickname: 'Nickname',
  nicknameOptional: 'Nickname (optional)',
  vehicleCategory: 'Category',
  vehicleCategory_motorcycle: 'Motorcycle',
  vehicleCategory_car: 'Car',
  vehicleCategory_truck: 'Truck',
  vehicleCategory_other: 'Other',
  brand: 'Brand',
  brandCustom: 'Brand name',
  brandSearch: 'Search brands…',
  brandNoResults: 'No matching brands',
  catalogOther: 'Other',
  model: 'Model',
  modelCustom: 'Model name',
  modelSearch: 'Search models…',
  modelNoResults: 'No matching models',
  modelSelectBrandFirst: 'Select a brand first',
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
  maintenance: 'Maintenance',
  maintenanceHistory: 'Maintenance history',
  addMaintenance: 'Add maintenance',
  editMaintenance: 'Edit maintenance',
  saveMaintenance: 'Save maintenance',
  updateMaintenance: 'Update maintenance',
  maintenanceSaved: 'Maintenance record saved',
  maintenanceUpdated: 'Maintenance record updated',
  deleteMaintenance: 'Delete maintenance',
  deleteMaintenanceTitle: 'Delete maintenance record?',
  deleteMaintenanceMessage: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
  maintenanceDeleted: 'Maintenance record deleted',
  maintenanceNotFound: 'Maintenance record not found',
  noMaintenanceYet: 'No maintenance records yet',
  noMaintenanceDescription: 'Log your first service to start tracking maintenance history.',
  viewMaintenanceHistory: 'View maintenance history',
  maintenanceType: 'Type',
  maintenanceTypeCustom: 'Custom type',
  maintenanceTypeSearch: 'Search types…',
  maintenanceTypeNoResults: 'No matching types',
  description: 'Description',
  costOptional: 'Cost (optional)',
  mileage: 'Mileage',
  serviceDate: 'Service date',
  notesOptional: 'Notes (optional)',
  reminders: 'Reminders',
  reminderHistory: 'Reminders',
  addReminder: 'Add reminder',
  editReminder: 'Edit reminder',
  saveReminder: 'Save reminder',
  updateReminder: 'Update reminder',
  reminderSaved: 'Reminder scheduled',
  reminderUpdated: 'Reminder updated',
  deleteReminder: 'Delete reminder',
  deleteReminderTitle: 'Delete reminder?',
  deleteReminderMessage:
    'Are you sure you want to delete the {name} reminder? This action cannot be undone.',
  reminderDeleted: 'Reminder deleted',
  reminderNotFound: 'Reminder not found',
  noRemindersYet: 'No reminders yet',
  noRemindersDescription:
    'Schedule oil changes, insurance renewals, or tire rotations and get notified when they are due.',
  viewReminders: 'View reminders',
  reminderType: 'Reminder type',
  scheduledDate: 'Date',
  scheduledTime: 'Time',
  reminderType_oil_change: 'Oil change',
  reminderType_insurance_renewal: 'Insurance renewal',
  reminderType_tire_rotation: 'Tire rotation',
  reminderNotificationTitle: '{type} reminder',
  reminderNotificationBody: '{type} for {vehicle} is due soon.',
  reminderChannelName: 'Garage reminders',
  reminderMustBeFuture: 'Choose a date and time in the future.',
  notificationPermissionDenied:
    'Notification permission is required to schedule reminders. Enable notifications in Settings.',
  notificationsUnavailableOnWeb:
    'Local notifications are not available on web. Reminders are saved but will not alert on this platform.',
  notificationsUnavailableInExpoGo:
    'Local notifications are not available in Expo Go on Android. Reminders are saved; use a development build (npx expo run:android) to receive alerts.',
  reminderPastDue: 'Past due',
  expenseSummary: 'Expenses',
  totalExpenses: 'Total expenses',
  monthlyExpenses: 'This month',
  yearlyExpenses: 'This year',
  monthlyExpensesPeriod: 'Based on maintenance in {period}',
  yearlyExpensesPeriod: 'Calendar year {period}',
  expensesByVehicle: 'Expenses by vehicle',
  noExpensesYet: 'No expenses recorded',
  noExpensesDescription:
    'Add maintenance records with a cost to see your expense summary here.',
  noVehicleExpenses: 'No vehicle has logged costs yet.',
  expenseRecordCount: '{count} records',
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
