import { useMemo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { SearchableCatalogPickerField } from '@/components/pickers/SearchableCatalogPickerField';
import { modelsForVehicle } from '@/data/vehicleModels';
import { t } from '@/lib/i18n';
import type { VehicleCategory } from '@/models/vehicle';

interface VehicleModelPickerFieldProps {
  category: VehicleCategory;
  brand: string;
  value: string;
  onChange: (model: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  style?: StyleProp<ViewStyle>;
}

export function VehicleModelPickerField({
  category,
  brand,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  style,
}: VehicleModelPickerFieldProps) {
  const catalogModels = useMemo(() => modelsForVehicle(category, brand), [category, brand]);
  const brandSelected = !!brand.trim();

  return (
    <SearchableCatalogPickerField
      label={t('model')}
      searchPlaceholder={t('modelSearch')}
      customLabel={t('modelCustom')}
      noResultsLabel={t('modelNoResults')}
      catalogItems={catalogModels}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      style={style}
      disabled={!brandSelected}
      disabledHint={t('modelSelectBrandFirst')}
    />
  );
}
