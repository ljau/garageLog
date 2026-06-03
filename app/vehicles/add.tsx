import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, HelperText, Snackbar, TextInput } from 'react-native-paper';

import { insertVehicle } from '@/database/vehicleRepository';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import {
  parseIntegerField,
  vehicleFormSchema,
  type VehicleFormValues,
} from '@/schemas/vehicleForm';

const defaultValues: VehicleFormValues = {
  nickname: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  plateNumber: '',
  currentMileage: 0,
};

export default function AddVehicleScreen() {
  const router = useRouter();
  const { refresh, isReady } = useDatabase();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: VehicleFormValues) => {
    if (!isReady) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await insertVehicle(values);
      refresh();
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 600);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('databaseError'));
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t('addVehicle') }} />
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Controller
          control={control}
          name="nickname"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label={t('nickname')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                mode="outlined"
                error={!!errors.nickname}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.nickname}>
                {errors.nickname?.message}
              </HelperText>
            </>
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
            <>
              <TextInput
                label={t('year')}
                value={String(value)}
                onChangeText={(text) => onChange(parseIntegerField(text, value))}
                onBlur={onBlur}
                mode="outlined"
                keyboardType="number-pad"
                error={!!errors.year}
                style={styles.input}
              />
              <HelperText type="error" visible={!!errors.year}>
                {errors.year?.message}
              </HelperText>
            </>
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
          {t('saveVehicle')}
        </Button>
      </ScrollView>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        {t('vehicleSaved')}
      </Snackbar>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  input: {
    marginBottom: 4,
  },
  submit: {
    marginTop: 16,
  },
});
