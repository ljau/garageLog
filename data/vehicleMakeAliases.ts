import { normalizeBrandKey } from '@/data/vehicleBrandFormat';
import type { VehicleCategory } from '@/models/vehicle';

/** Maps display brand name to NHTSA make names, when they differ. */
const NHTSA_MAKE_ALIASES: Partial<
  Record<VehicleCategory, Record<string, readonly string[]>>
> = {
  truck: {
    Fuso: ['MITSUBISHI FUSO'],
    Volvo: ['VOLVO TRUCK', 'VOLVO'],
  },
  car: {
    Volvo: ['VOLVO'],
  },
};

export function nhtsaMakeCandidates(
  category: VehicleCategory,
  brand: string,
): readonly string[] {
  const normalized = normalizeBrandKey(brand);
  const aliases = NHTSA_MAKE_ALIASES[category];
  if (aliases) {
    for (const [displayName, candidates] of Object.entries(aliases)) {
      if (normalizeBrandKey(displayName) === normalized) {
        return candidates;
      }
    }
  }
  return [brand.trim()];
}
