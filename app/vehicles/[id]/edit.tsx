import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { VehicleForm, vehicleToFormValues } from '@/components/VehicleForm';
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <VehicleForm
            key={vehicle.id}
            defaultValues={vehicleToFormValues(vehicle)}
            submitLabel={t('updateVehicle')}
            onSubmit={onSubmit}
            submitError={submitError}
          />
        </ScrollView>

        <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
          {t('vehicleUpdated')}
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
});
