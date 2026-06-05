import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  type Control,
  type FieldErrors,
} from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { DateTimePickerField } from '@/components/pickers/DateTimePickerField';
import { MaintenanceTypePickerField } from '@/components/pickers/MaintenanceTypePickerField';
import { t } from '@/lib/i18n';
import {
  maintenanceFormSchema,
  parseOptionalCost,
  type MaintenanceFormValues,
} from '@/schemas/maintenanceForm';
import { parseIntegerField } from '@/schemas/vehicleForm';
import type { MaintenanceRecord } from '@/models/maintenanceRecord';

interface MaintenanceFormProps {
  defaultValues: MaintenanceFormValues;
  children: ReactNode;
}

interface MaintenanceFormSubmitProps {
  submitLabel: string;
  onSubmit: (values: MaintenanceFormValues) => Promise<void>;
  submitError?: string | null;
}

export function maintenanceRecordToFormValues(
  record: MaintenanceRecord,
): MaintenanceFormValues {
  return {
    type: record.type,
    description: record.description,
    cost: record.cost,
    mileage: record.mileage,
    serviceDate: record.serviceDate,
    notes: record.notes ?? '',
  };
}

export function defaultMaintenanceFormValues(
  mileage = 0,
): MaintenanceFormValues {
  return {
    type: '',
    description: '',
    cost: undefined,
    mileage,
    serviceDate: dayjs().format('YYYY-MM-DD'),
    notes: '',
  };
}

export function MaintenanceForm({ defaultValues, children }: MaintenanceFormProps) {
  const methods = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

export function MaintenanceFormFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<MaintenanceFormValues>();

  return <MaintenanceFormFieldsInner control={control} errors={errors} />;
}

export function MaintenanceFormSubmit({
  submitLabel,
  onSubmit,
  submitError,
}: MaintenanceFormSubmitProps) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<MaintenanceFormValues>();

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

interface MaintenanceFormFieldsProps {
  control: Control<MaintenanceFormValues>;
  errors: FieldErrors<MaintenanceFormValues>;
}

function MaintenanceFormFieldsInner({ control, errors }: MaintenanceFormFieldsProps) {
  return (
    <>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, onBlur, value } }) => (
          <MaintenanceTypePickerField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={!!errors.type}
            helperText={errors.type?.message}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label={t('description')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              error={!!errors.description}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.description}>
              {errors.description?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="serviceDate"
        render={({ field: { onChange, onBlur, value } }) => (
          <DateTimePickerField
            label={t('serviceDate')}
            mode="date"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={!!errors.serviceDate}
            helperText={errors.serviceDate?.message}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="mileage"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label={t('mileage')}
              value={String(value)}
              onChangeText={(text) => onChange(parseIntegerField(text, value))}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="number-pad"
              error={!!errors.mileage}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.mileage}>
              {errors.mileage?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="cost"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label={t('costOptional')}
              value={value != null ? String(value) : ''}
              onChangeText={(text) => onChange(parseOptionalCost(text))}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="decimal-pad"
              error={!!errors.cost}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.cost}>
              {errors.cost?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('notesOptional')}
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 4,
  },
});
