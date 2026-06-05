import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { ScreenBottomActions } from '@/components/ScreenBottomActions';
import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { VehicleForm, VehicleFormFields, VehicleFormSubmit, vehicleToFormValues } from '@/components/VehicleForm';
import { screenScrollContentStyle } from '@/constants/screen';
import { updateVehicle } from '@/database/vehicleRepository';
import { useVehicle } from '@/hooks/useVehicle';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { VehicleFormValues } from '@/schemas/vehicleForm';

export default function EditVehicleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refresh, isReady } = useDatabase();
  const { vehicle, isLoading, error } = useVehicle(id);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: VehicleFormValues) => {
    if (!isReady || !vehicle) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await updateVehicle(vehicle.id, values);
      refresh();
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 600);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('databaseError'));
    }
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: t('editVehicle') }} />
        <LoadingState />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: t('editVehicle') }} />
        <EmptyState
          title={t('vehicleNotFound')}
          description={error?.message ?? t('vehicleNotFound')}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: t('editVehicle') }} />
      <ThemedScreen>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <VehicleForm key={vehicle.id} defaultValues={vehicleToFormValues(vehicle)}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={screenScrollContentStyle}
              keyboardShouldPersistTaps="handled">
              <VehicleFormFields />
            </ScrollView>

            <ScreenBottomActions>
              <VehicleFormSubmit
                submitLabel={t('updateVehicle')}
                onSubmit={onSubmit}
                submitError={submitError}
              />
            </ScreenBottomActions>
          </VehicleForm>

          <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
            {t('vehicleUpdated')}
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
