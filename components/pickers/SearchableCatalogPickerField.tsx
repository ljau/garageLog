import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';

import { CATALOG_OTHER_VALUE, isKnownCatalogItem } from '@/data/vehicleCatalog';
import { t } from '@/lib/i18n';

interface SearchableCatalogPickerFieldProps {
  label: string;
  searchPlaceholder: string;
  customLabel: string;
  noResultsLabel: string;
  catalogItems: readonly string[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  disabledHint?: string;
}

const ROW_HEIGHT = 48;

export function SearchableCatalogPickerField({
  label,
  searchPlaceholder,
  customLabel,
  noResultsLabel,
  catalogItems,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  style,
  disabled = false,
  disabledHint,
}: SearchableCatalogPickerFieldProps) {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(
    () => !!value && !isKnownCatalogItem(catalogItems, value),
  );

  const usesCatalog = catalogItems.length > 0 && !disabled;

  useEffect(() => {
    setIsOtherSelected(!!value && !isKnownCatalogItem(catalogItems, value));
  }, [catalogItems]);

  useEffect(() => {
    if (value && isKnownCatalogItem(catalogItems, value)) {
      setIsOtherSelected(false);
    }
  }, [value, catalogItems]);

  const usesCustomValue = usesCatalog && isOtherSelected;

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matches = query
      ? catalogItems.filter((item) => item.toLowerCase().includes(query))
      : catalogItems;
    return [...matches, CATALOG_OTHER_VALUE];
  }, [catalogItems, searchQuery]);

  const closeModal = () => {
    setModalVisible(false);
    setSearchQuery('');
    onBlur?.();
  };

  const openModal = () => {
    if (!usesCatalog) {
      return;
    }
    setSearchQuery('');
    setModalVisible(true);
  };

  const selectItem = (item: string) => {
    if (item === CATALOG_OTHER_VALUE) {
      setIsOtherSelected(true);
      if (!value || isKnownCatalogItem(catalogItems, value)) {
        onChange('');
      }
      closeModal();
      return;
    }
    setIsOtherSelected(false);
    onChange(item);
    closeModal();
  };

  const displayValue = usesCustomValue ? t('catalogOther') : value;

  if (!usesCatalog) {
    return (
      <View style={style}>
        <TextInput
          label={label}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          mode="outlined"
          error={error}
          editable={!disabled}
          placeholder={disabled ? disabledHint : undefined}
        />
        {helperText ? (
          <HelperText type="error" visible={error}>
            {helperText}
          </HelperText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={style}>
      <Pressable onPress={openModal}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={displayValue}
            mode="outlined"
            editable={false}
            error={error}
            right={<TextInput.Icon icon="menu-down" />}
          />
        </View>
      </Pressable>

      {usesCustomValue ? (
        <TextInput
          label={customLabel}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          mode="outlined"
          error={error}
          autoFocus
          style={styles.customInput}
        />
      ) : null}

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
              {label}
            </Text>
            <TextInput
              mode="outlined"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.search}
              dense
              left={<TextInput.Icon icon="magnify" />}
            />
            <FlatList
              data={filteredItems}
              keyExtractor={(item) => item}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isOther = item === CATALOG_OTHER_VALUE;
                const selected = isOther ? usesCustomValue : item === value;
                return (
                  <Pressable
                    onPress={() => selectItem(item)}
                    style={[
                      styles.row,
                      selected && { backgroundColor: theme.colors.primaryContainer },
                    ]}>
                    <Text
                      variant="bodyLarge"
                      style={selected ? { color: theme.colors.primary } : undefined}>
                      {isOther ? t('catalogOther') : item}
                    </Text>
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <Text variant="bodyMedium" style={styles.empty}>
                  {noResultsLabel}
                </Text>
              }
            />
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
  customInput: {
    marginTop: 4,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 24,
  },
  sheet: {
    borderRadius: 12,
    maxHeight: '70%',
    paddingVertical: 16,
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  search: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    flexGrow: 0,
  },
  row: {
    height: ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  empty: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    opacity: 0.7,
  },
  cancel: {
    marginTop: 8,
    marginHorizontal: 8,
  },
});
