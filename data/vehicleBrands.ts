import { getBrandCatalog } from '@/data/vehicleBrandCatalog';
import { normalizeBrandKey } from '@/data/vehicleBrandFormat';
import type { VehicleCategory } from '@/models/vehicle';

export function brandsForCategory(category: VehicleCategory): readonly string[] {
  if (category === 'other') {
    return [];
  }
  return getBrandCatalog()[category];
}

export function isKnownBrand(category: VehicleCategory, brand: string): boolean {
  if (!brand.trim()) {
    return false;
  }
  const normalized = normalizeBrandKey(brand);
  return brandsForCategory(category).some((item) => normalizeBrandKey(item) === normalized);
}
