import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { HelperText, Menu, TextInput, useTheme } from 'react-native-paper';

import { t } from '@/lib/i18n';
import { vehicleCategoryIcon, vehicleCategoryLabel } from '@/lib/vehicles';
import { VEHICLE_CATEGORIES, type VehicleCategory } from '@/models/vehicle';

interface VehicleCategoryPickerFieldProps {
  value: VehicleCategory;
  onChange: (category: VehicleCategory) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  style?: StyleProp<ViewStyle>;
}

export function VehicleCategoryPickerField({
  value,
  onChange,
  onBlur,
  error,
  helperText,
  style,
}: VehicleCategoryPickerFieldProps) {
  const theme = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => {
    setMenuVisible(false);
    onBlur?.();
  };

  const selectCategory = (category: VehicleCategory) => {
    onChange(category);
    closeMenu();
  };

  const iconName = vehicleCategoryIcon(value) as keyof typeof MaterialCommunityIcons.glyphMap;

  return (
    <View style={style}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Pressable onPress={openMenu}>
            <View pointerEvents="none">
              <TextInput
                label={t('vehicleCategory')}
                value={vehicleCategoryLabel(value)}
                mode="outlined"
                editable={false}
                error={error}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialCommunityIcons
                        name={iconName}
                        size={24}
                        color={theme.colors.onSurfaceVariant}
                      />
                    )}
                  />
                }
                right={<TextInput.Icon icon="menu-down" />}
              />
            </View>
          </Pressable>
        }>
        {VEHICLE_CATEGORIES.map((category) => (
          <Menu.Item
            key={category}
            title={vehicleCategoryLabel(category)}
            leadingIcon={vehicleCategoryIcon(category)}
            onPress={() => selectCategory(category)}
          />
        ))}
      </Menu>
      {helperText ? (
        <HelperText type="error" visible={error}>
          {helperText}
        </HelperText>
      ) : null}
    </View>
  );
}
