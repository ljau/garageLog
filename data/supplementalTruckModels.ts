/** Offline model lists for heavy-truck brands missing from the NHTSA database. */
export const SUPPLEMENTAL_TRUCK_MODELS: Record<string, readonly string[]> = {
  DAF: [
    'CF',
    'LF',
    'XD',
    'XF',
    'XG',
    'XG+',
    'XB',
    'XB Electric',
    'CF Electric',
    'LF Electric',
  ],
  Iveco: [
    'Daily',
    'Eurocargo',
    'S-Way',
    'X-Way',
    'T-Way',
    'eDaily',
    'eEurocargo',
  ],
  MAN: ['TGX', 'TGS', 'TGL', 'TGM', 'TGE', 'eTGX', 'eTGS', 'eTGL'],
  'Renault Trucks': ['C', 'D', 'K', 'T', 'E-Tech T', 'E-Tech C', 'E-Tech D'],
  Scania: [
    'G Series',
    'P Series',
    'R Series',
    'S Series',
    'L Series',
    'XT',
    'R Electric',
    'P Electric',
  ],
  'UD Trucks': ['Croner', 'Kuzer', 'Quon', 'Quester'],
};

export function supplementalTruckBrandNames(): string[] {
  return Object.keys(SUPPLEMENTAL_TRUCK_MODELS).sort((a, b) => a.localeCompare(b));
}

export function supplementalTruckModelsForBrand(brand: string): readonly string[] {
  const normalizedBrand = brand.trim().toLowerCase();
  const entry = Object.entries(SUPPLEMENTAL_TRUCK_MODELS).find(
    ([name]) => name.toLowerCase() === normalizedBrand,
  );
  return entry?.[1] ?? [];
}
