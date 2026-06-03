import { useMemo } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import { YEAR_MIN, yearMax } from '@/components/pickers/pickerValues';
import { t } from '@/lib/i18n';

interface YearPickerModalProps {
  visible: boolean;
  selectedYear: number;
  onSelect: (year: number) => void;
  onDismiss: () => void;
}

function buildYearOptions(): number[] {
  const years: number[] = [];
  for (let year = yearMax(); year >= YEAR_MIN; year -= 1) {
    years.push(year);
  }
  return years;
}

export function YearPickerModal({
  visible,
  selectedYear,
  onSelect,
  onDismiss,
}: YearPickerModalProps) {
  const theme = useTheme();
  const years = useMemo(() => buildYearOptions(), []);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.colors.surface }]}
          onPress={(event) => event.stopPropagation()}>
          <Text variant="titleMedium" style={styles.title}>
            {t('year')}
          </Text>
          <FlatList
            data={years}
            keyExtractor={(item) => String(item)}
            style={styles.list}
            initialScrollIndex={Math.max(
              0,
              years.findIndex((year) => year === selectedYear),
            )}
            getItemLayout={(_, index) => ({
              length: YEAR_ROW_HEIGHT,
              offset: YEAR_ROW_HEIGHT * index,
              index,
            })}
            renderItem={({ item }) => {
              const selected = item === selectedYear;
              return (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    onDismiss();
                  }}
                  style={[
                    styles.row,
                    selected && { backgroundColor: theme.colors.primaryContainer },
                  ]}>
                  <Text
                    variant="bodyLarge"
                    style={selected ? { color: theme.colors.primary } : undefined}>
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
          <Button onPress={onDismiss} style={styles.cancel}>
            {t('cancel')}
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const YEAR_ROW_HEIGHT = 48;

const styles = StyleSheet.create({
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
  list: {
    flexGrow: 0,
  },
  row: {
    height: YEAR_ROW_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cancel: {
    marginTop: 8,
    marginHorizontal: 8,
  },
});
