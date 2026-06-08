import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

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
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
    onBlur?.();
  };

  const selectCategory = (category: VehicleCategory) => {
    onChange(category);
    closeModal();
  };

  const iconName = vehicleCategoryIcon(value) as keyof typeof MaterialCommunityIcons.glyphMap;

  return (
    <View style={style}>
      <Pressable onPress={() => setModalVisible(true)}>
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

      {helperText ? (
        <HelperText type="error" visible={error}>
          {helperText}
        </HelperText>
      ) : null}

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={styles.backdrop} onPress={closeModal}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.colors.surface }]}
            onPress={(event) => event.stopPropagation()}>
            <Text variant="titleMedium" style={styles.title}>
              {t('vehicleCategory')}
            </Text>
            {VEHICLE_CATEGORIES.map((category) => {
              const selected = category === value;
              const itemIcon = vehicleCategoryIcon(
                category,
              ) as keyof typeof MaterialCommunityIcons.glyphMap;

              return (
                <Pressable
                  key={category}
                  onPress={() => selectCategory(category)}
                  style={[
                    styles.row,
                    selected && { backgroundColor: theme.colors.primaryContainer },
                  ]}>
                  <MaterialCommunityIcons
                    name={itemIcon}
                    size={24}
                    color={selected ? theme.colors.primary : theme.colors.onSurfaceVariant}
                  />
                  <Text
                    variant="bodyLarge"
                    style={selected ? { color: theme.colors.primary } : undefined}>
                    {vehicleCategoryLabel(category)}
                  </Text>
                </Pressable>
              );
            })}
            <Button onPress={closeModal} style={styles.cancel}>
              {t('cancel')}
            </Button>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 24,
  },
  sheet: {
    borderRadius: 12,
    paddingVertical: 16,
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  row: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  cancel: {
    marginTop: 8,
    marginHorizontal: 8,
  },
});
