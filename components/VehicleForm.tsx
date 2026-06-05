import { useEffect, useRef, type ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  type Control,
  type FieldErrors,
} from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

import { DateTimePickerField } from '@/components/pickers/DateTimePickerField';
import { VehicleBrandPickerField } from '@/components/pickers/VehicleBrandPickerField';
import { VehicleCategoryPickerField } from '@/components/pickers/VehicleCategoryPickerField';
import { VehicleModelPickerField } from '@/components/pickers/VehicleModelPickerField';
import { isKnownBrand } from '@/data/vehicleBrands';
import { isKnownModel } from '@/data/vehicleModels';
import { t } from '@/lib/i18n';
import {
  parseIntegerField,
  vehicleFormSchema,
  type VehicleFormValues,
} from '@/schemas/vehicleForm';

interface VehicleFormProps {
  defaultValues: VehicleFormValues;
  children: ReactNode;
}

interface VehicleFormSubmitProps {
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

export function VehicleForm({ defaultValues, children }: VehicleFormProps) {
  const methods = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
}

export function VehicleFormFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<VehicleFormValues>();

  return <VehicleFormFieldsInner control={control} errors={errors} />;
}

export function VehicleFormSubmit({
  submitLabel,
  onSubmit,
  submitError,
}: VehicleFormSubmitProps) {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext<VehicleFormValues>();

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

interface VehicleFormFieldsProps {
  control: Control<VehicleFormValues>;
  errors: FieldErrors<VehicleFormValues>;
}

function VehicleFormFieldsInner({ control, errors }: VehicleFormFieldsProps) {
  const category = useWatch({ control, name: 'category' });
  const brand = useWatch({ control, name: 'brand' });
  const model = useWatch({ control, name: 'model' });

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
          <BrandField
            category={category}
            brand={brand}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.brand?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="model"
        render={({ field: { onChange, onBlur, value } }) => (
          <ModelField
            category={category}
            brand={brand}
            model={model}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.model?.message}
          />
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

interface BrandFieldProps {
  category: VehicleFormValues['category'];
  brand: string;
  value: string;
  onChange: (brand: string) => void;
  onBlur: () => void;
  error?: string;
}

function BrandField({ category, brand, value, onChange, onBlur, error }: BrandFieldProps) {
  const previousCategory = useRef(category);

  useEffect(() => {
    if (previousCategory.current === category) {
      return;
    }
    previousCategory.current = category;

    if (!brand) {
      return;
    }
    if (category === 'other') {
      return;
    }
    if (isKnownBrand(category, brand)) {
      return;
    }
    onChange('');
  }, [category, brand, onChange]);

  return (
    <VehicleBrandPickerField
      category={category}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      style={styles.input}
    />
  );
}

function ModelField({
  category,
  brand,
  model,
  value,
  onChange,
  onBlur,
  error,
}: {
  category: VehicleFormValues['category'];
  brand: string;
  model: string;
  value: string;
  onChange: (model: string) => void;
  onBlur: () => void;
  error?: string;
}) {
  const previousCategory = useRef(category);
  const previousBrand = useRef(brand);

  useEffect(() => {
    const categoryChanged = previousCategory.current !== category;
    const brandChanged = previousBrand.current !== brand;
    previousCategory.current = category;
    previousBrand.current = brand;

    if (!categoryChanged && !brandChanged) {
      return;
    }
    if (!model) {
      return;
    }
    if (isKnownModel(category, brand, model)) {
      return;
    }
    onChange('');
  }, [category, brand, model, onChange]);

  return (
    <VehicleModelPickerField
      category={category}
      brand={brand}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={!!error}
      helperText={error}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 4,
  },
});
