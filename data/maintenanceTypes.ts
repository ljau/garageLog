/** Common maintenance categories shown in the type picker. Stored values match these labels. */
export const MAINTENANCE_TYPE_PRESETS = [
  'Oil change',
  'Brakes',
  'Tires',
  'Tire rotation',
  'Inspection',
  'Battery',
  'Fluids',
  'Filters',
  'Belts & hoses',
  'Suspension',
  'Exhaust',
  'Transmission',
  'Cooling system',
  'Electrical',
  'Body & paint',
] as const;

export type MaintenanceTypePreset = (typeof MAINTENANCE_TYPE_PRESETS)[number];

export function maintenanceTypePresets(): readonly string[] {
  return MAINTENANCE_TYPE_PRESETS;
}

export function isKnownMaintenanceType(type: string): boolean {
  if (!type.trim()) {
    return false;
  }
  const normalized = type.trim().toLowerCase();
  return MAINTENANCE_TYPE_PRESETS.some((item) => item.toLowerCase() === normalized);
}
