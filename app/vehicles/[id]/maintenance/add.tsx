import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';
import { screenContentContainerStyle } from '@/constants/screen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { defaultMaintenanceFormValues, MaintenanceForm } from '@/components/MaintenanceForm';
import { insertMaintenanceRecord } from '@/database/maintenanceRepository';
import { useVehicle } from '@/hooks/useVehicle';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { MaintenanceFormValues } from '@/schemas/maintenanceForm';

export default function AddMaintenanceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refresh, isReady } = useDatabase();
  const { vehicle, isLoading, error } = useVehicle(id);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: MaintenanceFormValues) => {
    if (!isReady || !vehicle) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await insertMaintenanceRecord(vehicle.id, values);
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
        <Stack.Screen options={{ title: t('addMaintenance') }} />
        <LoadingState />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: t('addMaintenance') }} />
        <EmptyState
          title={t('vehicleNotFound')}
          description={error?.message ?? t('vehicleNotFound')}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: t('addMaintenance') }} />
      <ThemedScreen>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={screenContentContainerStyle}
            keyboardShouldPersistTaps="handled">
          <MaintenanceForm
            defaultValues={defaultMaintenanceFormValues(vehicle.currentMileage)}
            submitLabel={t('saveMaintenance')}
            onSubmit={onSubmit}
            submitError={submitError}
          />
          </ScrollView>

          <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
            {t('maintenanceSaved')}
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
