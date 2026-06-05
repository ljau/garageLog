import { zodResolver } from '@hookform/resolvers/zod';
import { createContext, useContext, type ReactNode } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
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
  children: ReactNode;
  webNotice?: string | null;
}

interface ReminderFormSubmitProps {
  submitLabel: string;
  onSubmit: (values: ReminderFormValues) => Promise<void>;
  submitError?: string | null;
}

const ReminderFormOptionsContext = createContext<{ webNotice?: string | null }>({});

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

export function ReminderForm({ defaultValues, children, webNotice }: ReminderFormProps) {
  const methods = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <ReminderFormOptionsContext.Provider value={{ webNotice }}>
        {children}
      </ReminderFormOptionsContext.Provider>
    </FormProvider>
  );
}

export function ReminderFormFields() {
  const { webNotice } = useContext(ReminderFormOptionsContext);
  const {
    control,
    formState: { errors },
  } = useFormContext<ReminderFormValues>();

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
    </>
  );
}

export function ReminderFormSubmit({
  submitLabel,
  onSubmit,
  submitError,
}: ReminderFormSubmitProps) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<ReminderFormValues>();

  return (
    <>
      {submitError ? (
        <HelperText type="error" visible>
          {submitError}
        </HelperText>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}>
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
});
