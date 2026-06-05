import { useMemo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { SearchableCatalogPickerField } from '@/components/pickers/SearchableCatalogPickerField';
import { brandsForCategory } from '@/data/vehicleBrands';
import { t } from '@/lib/i18n';
import type { VehicleCategory } from '@/models/vehicle';

interface VehicleBrandPickerFieldProps {
  category: VehicleCategory;
  value: string;
  onChange: (brand: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  style?: StyleProp<ViewStyle>;
}

export function VehicleBrandPickerField({
  category,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  style,
}: VehicleBrandPickerFieldProps) {
  const catalogBrands = useMemo(() => brandsForCategory(category), [category]);

  return (
    <SearchableCatalogPickerField
      label={t('brand')}
      searchPlaceholder={t('brandSearch')}
      customLabel={t('brandCustom')}
      noResultsLabel={t('brandNoResults')}
      catalogItems={catalogBrands}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      style={style}
    />
  );
}
