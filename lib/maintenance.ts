import type { MciIconName } from '@/components/IconCircle';

const MAINTENANCE_TYPE_ICONS: Record<string, MciIconName> = {
  'oil change': 'oil',
  brakes: 'car-brake-abs',
  tires: 'tire',
  'tire rotation': 'sync',
  inspection: 'clipboard-check-outline',
  battery: 'car-battery',
  fluids: 'water-outline',
  filters: 'air-filter',
  'belts & hoses': 'pipe',
  suspension: 'car-settings',
  exhaust: 'smoke',
  transmission: 'cog-transfer',
  'cooling system': 'thermometer-lines',
  electrical: 'lightning-bolt',
  'body & paint': 'spray',
};

export function maintenanceTypeIcon(type: string): MciIconName {
  const normalized = type.trim().toLowerCase();
  return MAINTENANCE_TYPE_ICONS[normalized] ?? 'wrench';
}
