import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import { YearPickerModal } from '@/components/pickers/YearPickerModal';
import {
  dateStringToPickerDate,
  pickerDateToDateString,
  pickerDateToTimeString,
  pickerDateToYear,
  timeStringToPickerDate,
  yearToPickerDate,
} from '@/components/pickers/pickerValues';

export type PickerFieldMode = 'date' | 'time' | 'year';

interface DateTimePickerFieldProps {
  label: string;
  mode: PickerFieldMode;
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
  style?: StyleProp<ViewStyle>;
  minimumDate?: Date;
  maximumDate?: Date;
  /** Show and pick time in 12-hour format; stored value remains HH:mm. */
  use12Hour?: boolean;
}

function pickerValueToDate(mode: PickerFieldMode, value: string | number): Date {
  if (mode === 'year') {
    const year = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
    return yearToPickerDate(Number.isNaN(year) ? new Date().getFullYear() : year);
  }
  if (mode === 'time') {
    return timeStringToPickerDate(String(value));
  }
  return dateStringToPickerDate(String(value));
}

function dateToFieldValue(mode: PickerFieldMode, date: Date): string | number {
  if (mode === 'year') {
    return pickerDateToYear(date);
  }
  if (mode === 'time') {
    return pickerDateToTimeString(date);
  }
  return pickerDateToDateString(date);
}

function displayValue(
  mode: PickerFieldMode,
  value: string | number,
  use12Hour: boolean,
): string {
  if (mode === 'year') {
    return String(value);
  }
  if (mode === 'time' && use12Hour) {
    return dayjs(timeStringToPickerDate(String(value))).format('h:mm A');
  }
  return String(value);
}

function nativePickerMode(mode: PickerFieldMode): 'date' | 'time' {
  return mode === 'time' ? 'time' : 'date';
}

function numericYear(value: string | number): number {
  const year = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  return Number.isNaN(year) ? new Date().getFullYear() : year;
}

export function DateTimePickerField({
  label,
  mode,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  style,
  minimumDate,
  maximumDate,
  use12Hour = false,
}: DateTimePickerFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const pickerDate = pickerValueToDate(mode, value);

  const applyPickerDate = useCallback(
    (date: Date) => {
      onChange(dateToFieldValue(mode, date));
    },
    [mode, onChange],
  );

  const handleValueChange = useCallback(
    (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
      applyPickerDate(selectedDate);
      if (Platform.OS === 'web') {
        setShowPicker(false);
        onBlur?.();
      }
    },
    [applyPickerDate, onBlur],
  );

  const handleDismiss = useCallback(() => {
    setShowPicker(false);
    onBlur?.();
  }, [onBlur]);

  const openPicker = useCallback(() => {
    if (mode === 'year') {
      setShowYearPicker(true);
      return;
    }
    const openValue = pickerValueToDate(mode, value);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: openValue,
        mode: nativePickerMode(mode),
        is24Hour: !use12Hour,
        minimumDate,
        maximumDate,
        onValueChange: (_event, selectedDate) => {
          applyPickerDate(selectedDate);
          onBlur?.();
        },
        onDismiss: () => {
          onBlur?.();
        },
      });
      return;
    }
    setShowPicker(true);
  }, [applyPickerDate, maximumDate, minimumDate, mode, onBlur, use12Hour, value]);

  const dismissYearPicker = useCallback(() => {
    setShowYearPicker(false);
    onBlur?.();
  }, [onBlur]);

  const rightIcon =
    mode === 'time' ? 'clock-outline' : mode === 'year' ? 'calendar-range' : 'calendar';

  return (
    <View style={style}>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.pressable}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={displayValue(mode, value, use12Hour)}
            mode="outlined"
            editable={false}
            showSoftInputOnFocus={false}
            right={<TextInput.Icon icon={rightIcon} />}
            error={error}
            style={styles.input}
          />
        </View>
      </Pressable>
      {helperText ? (
        <HelperText type="error" visible={error}>
          {helperText}
        </HelperText>
      ) : null}
      {showPicker && mode !== 'year' && Platform.OS !== 'android' ? (
        <DateTimePicker
          value={pickerDate}
          mode={nativePickerMode(mode)}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onValueChange={handleValueChange}
          onDismiss={handleDismiss}
          locale={mode === 'time' && !use12Hour ? 'en-GB' : undefined}
          style={styles.picker}
        />
      ) : null}
      {mode === 'year' ? (
        <YearPickerModal
          visible={showYearPicker}
          selectedYear={numericYear(value)}
          onSelect={onChange}
          onDismiss={dismissYearPicker}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  input: {
    marginBottom: 4,
  },
  picker: {
    marginTop: 8,
  },
});
