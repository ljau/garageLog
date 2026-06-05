/** Sentinel value used internally by catalog pickers — never stored in the database. */
export const CATALOG_OTHER_VALUE = '__other__';

export function isKnownCatalogItem(catalog: readonly string[], value: string): boolean {
  if (!value.trim()) {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return catalog.some((item) => item.toLowerCase() === normalized);
}
