const ALWAYS_UPPERCASE = new Set(['BMW', 'GMC', 'KTM', 'RAM', 'SEAT', 'UD', 'BYD', 'DS']);

const NHTSA_DISPLAY_NAMES: Record<string, string> = {
  ram: 'Ram',
  'mitsubishi fuso': 'Fuso',
  'volvo truck': 'Volvo',
};

export function normalizeBrandKey(brand: string): string {
  return brand.trim().toLowerCase();
}

export function formatNhtsaBrandName(makeName: string): string {
  const normalized = normalizeBrandKey(makeName);
  const override = NHTSA_DISPLAY_NAMES[normalized];
  if (override) {
    return override;
  }

  if (makeName !== makeName.toUpperCase()) {
    return makeName;
  }

  const words = makeName.split(/(\s+|\/|-)/);
  return words
    .map((word) => {
      if (!/^[A-Z0-9]+$/.test(word)) {
        return word;
      }
      const upper = word.toUpperCase();
      if (ALWAYS_UPPERCASE.has(upper)) {
        return upper;
      }
      if (word.length <= 3 && /^[A-Z]+$/.test(word)) {
        return upper;
      }
      return word.charAt(0) + word.slice(1).toLowerCase();
    })
    .join('');
}

export function mergeBrandNames(brands: Iterable<string>): string[] {
  const byKey = new Map<string, string>();

  for (const brand of brands) {
    const trimmed = brand.trim();
    if (!trimmed) {
      continue;
    }
    const key = normalizeBrandKey(trimmed);
    const existing = byKey.get(key);
    if (!existing || trimmed.length > existing.length) {
      byKey.set(key, trimmed);
    }
  }

  return [...byKey.values()].sort((a, b) => a.localeCompare(b));
}
