import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper';

import { DateTimePickerField } from '@/components/pickers/DateTimePickerField';
import { reminderTypeLabel } from '@/lib/reminders';
import { t } from '@/lib/i18n';
import { REMINDER_TYPES, type Reminder, type ReminderType } from '@/models/reminder';
import {
  defaultReminderFormValues,
  reminderFormSchema,
  scheduledAtToReminderForm,
  type ReminderFormValues,
} from '@/schemas/reminderForm';

interface ReminderFormProps {
  defaultValues: ReminderFormValues;
  submitLabel: string;
  onSubmit: (values: ReminderFormValues) => Promise<void>;
  submitError?: string | null;
  webNotice?: string | null;
}

export function reminderToFormValues(reminder: Reminder): ReminderFormValues {
  return scheduledAtToReminderForm(
    reminder.scheduledAt,
    reminder.type,
    reminder.notes ?? '',
  );
}

export { defaultReminderFormValues };

const typeOptions = REMINDER_TYPES.map((type) => ({
  value: type,
  label: reminderTypeLabel(type),
}));

export function ReminderForm({
  defaultValues,
  submitLabel,
  onSubmit,
  submitError,
  webNotice,
}: ReminderFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues,
  });

  return (
    <>
      <Text variant="labelLarge" style={styles.label}>
        {t('reminderType')}
      </Text>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={(next) => {
              if (next) {
                onChange(next as ReminderType);
              }
            }}
            buttons={typeOptions}
            style={styles.typeButtons}
          />
        )}
      />
      {errors.type ? (
        <HelperText type="error" visible>
          {errors.type.message}
        </HelperText>
      ) : null}

      <Controller
        control={control}
        name="scheduledDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <DateTimePickerField
            label={t('scheduledDate')}
            mode="date"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={Boolean(errors.scheduledDate)}
            helperText={errors.scheduledDate?.message}
            style={styles.field}
          />
        )}
      />

      <Controller
        control={control}
        name="scheduledTime"
        render={({ field: { onChange, onBlur, value } }) => (
          <DateTimePickerField
            label={t('scheduledTime')}
            mode="time"
            use12Hour
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={Boolean(errors.scheduledTime)}
            helperText={errors.scheduledTime?.message}
            style={styles.field}
          />
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('notesOptional')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            multiline
            style={styles.field}
          />
        )}
      />

      {webNotice ? (
        <HelperText type="info" visible style={styles.webNotice}>
          {webNotice}
        </HelperText>
      ) : null}

      {submitError ? (
        <HelperText type="error" visible>
          {submitError}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submit}>
        {submitLabel}
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
  },
  typeButtons: {
    marginBottom: 8,
  },
  field: {
    marginTop: 12,
  },
  webNotice: {
    marginTop: 8,
  },
  submit: {
    marginTop: 24,
  },
});
