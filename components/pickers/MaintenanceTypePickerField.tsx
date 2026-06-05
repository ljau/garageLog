import { useMemo } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

import { SearchableCatalogPickerField } from '@/components/pickers/SearchableCatalogPickerField';
import { maintenanceTypePresets } from '@/data/maintenanceTypes';
import { t } from '@/lib/i18n';

interface MaintenanceTypePickerFieldProps {
  value: string;
  onChange: (type: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  style?: StyleProp<ViewStyle>;
}

export function MaintenanceTypePickerField({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  style,
}: MaintenanceTypePickerFieldProps) {
  const catalogTypes = useMemo(() => maintenanceTypePresets(), []);

  return (
    <SearchableCatalogPickerField
      label={t('maintenanceType')}
      searchPlaceholder={t('maintenanceTypeSearch')}
      customLabel={t('maintenanceTypeCustom')}
      noResultsLabel={t('maintenanceTypeNoResults')}
      catalogItems={catalogTypes}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      style={style}
    />
  );
}
