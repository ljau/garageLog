import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';
import { VehicleForm } from '@/components/VehicleForm';
import { screenContentContainerStyle } from '@/constants/screen';
import { insertVehicle } from '@/database/vehicleRepository';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { VehicleFormValues } from '@/schemas/vehicleForm';

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
      <ThemedScreen>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={screenContentContainerStyle}
            keyboardShouldPersistTaps="handled">
          <VehicleForm
            defaultValues={defaultValues}
            submitLabel={t('saveVehicle')}
            onSubmit={onSubmit}
            submitError={submitError}
          />
          </ScrollView>

          <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
            {t('vehicleSaved')}
          </Snackbar>
        </KeyboardAvoidingView>
      </ThemedScreen>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
