import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { ScreenBottomActions } from '@/components/ScreenBottomActions';
import { ThemedScreen } from '@/components/ThemedScreen';
import { VehicleForm, VehicleFormFields, VehicleFormSubmit } from '@/components/VehicleForm';
import { screenScrollContentStyle } from '@/constants/screen';
import { insertVehicle } from '@/database/vehicleRepository';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import { DEFAULT_VEHICLE_CATEGORY } from '@/models/vehicle';
import type { VehicleFormValues } from '@/schemas/vehicleForm';

const defaultValues: VehicleFormValues = {
  category: DEFAULT_VEHICLE_CATEGORY,
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
          <VehicleForm defaultValues={defaultValues}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={screenScrollContentStyle}
              keyboardShouldPersistTaps="handled">
              <VehicleFormFields />
            </ScrollView>

            <ScreenBottomActions>
              <VehicleFormSubmit
                submitLabel={t('saveVehicle')}
                onSubmit={onSubmit}
                submitError={submitError}
              />
            </ScreenBottomActions>
          </VehicleForm>

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
  scroll: {
    flex: 1,
  },
});
