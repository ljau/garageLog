import { t } from '@/lib/i18n';
import type { VehicleCategory } from '@/models/vehicle';

export function vehicleCategoryLabel(category: VehicleCategory): string {
  switch (category) {
    case 'motorcycle':
      return t('vehicleCategory_motorcycle');
    case 'car':
      return t('vehicleCategory_car');
    case 'truck':
      return t('vehicleCategory_truck');
    case 'other':
      return t('vehicleCategory_other');
  }
}

export function vehicleCategoryIcon(category: VehicleCategory): string {
  switch (category) {
    case 'motorcycle':
      return 'motorbike';
    case 'car':
      return 'car';
    case 'truck':
      return 'truck';
    case 'other':
      return 'dots-horizontal-circle';
  }
}
