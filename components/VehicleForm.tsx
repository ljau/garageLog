import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type Control, type FieldErrors } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { DateTimePickerField } from '@/components/pickers/DateTimePickerField';
import { VehicleCategoryPickerField } from '@/components/pickers/VehicleCategoryPickerField';
import { t } from '@/lib/i18n';
import {
  parseIntegerField,
  vehicleFormSchema,
  type VehicleFormValues,
} from '@/schemas/vehicleForm';

interface VehicleFormProps {
  defaultValues: VehicleFormValues;
  submitLabel: string;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  submitError?: string | null;
}

export function vehicleToFormValues(vehicle: {
  nickname?: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleFormValues['category'];
  plateNumber?: string;
  currentMileage: number;
}): VehicleFormValues {
  return {
    category: vehicle.category,
    nickname: vehicle.nickname ?? '',
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    plateNumber: vehicle.plateNumber ?? '',
    currentMileage: vehicle.currentMileage,
  };
}

export function VehicleForm({
  defaultValues,
  submitLabel,
  onSubmit,
  submitError,
}: VehicleFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
  });

  return (
    <>
      <VehicleFormFields control={control} errors={errors} />

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

interface VehicleFormFieldsProps {
  control: Control<VehicleFormValues>;
  errors: FieldErrors<VehicleFormValues>;
}

function VehicleFormFields({ control, errors }: VehicleFormFieldsProps) {
  return (
    <>
      <Controller
        control={control}
        name="category"
        render={({ field: { onChange, onBlur, value } }) => (
          <VehicleCategoryPickerField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={!!errors.category}
            helperText={errors.category?.message}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="brand"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label={t('brand')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              error={!!errors.brand}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.brand}>
              {errors.brand?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="model"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label={t('model')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              error={!!errors.model}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.model}>
              {errors.model?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        control={control}
        name="year"
        render={({ field: { onChange, onBlur, value } }) => (
          <DateTimePickerField
            label={t('year')}
            mode="year"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={!!errors.year}
            helperText={errors.year?.message}
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="nickname"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('nicknameOptional')}
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="plateNumber"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label={t('plateNumberOptional')}
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            mode="outlined"
            autoCapitalize="characters"
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="currentMileage"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              label={t('currentMileage')}
              value={String(value)}
              onChangeText={(text) => onChange(parseIntegerField(text, value))}
              onBlur={onBlur}
              mode="outlined"
              keyboardType="number-pad"
              error={!!errors.currentMileage}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.currentMileage}>
              {errors.currentMileage?.message}
            </HelperText>
          </>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 4,
  },
  submit: {
    marginTop: 16,
  },
});
