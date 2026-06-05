import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { getNotificationUnavailableNotice } from '@/lib/notificationNotice';
import { Snackbar } from 'react-native-paper';

import { ScreenBottomActions } from '@/components/ScreenBottomActions';
import { ThemedScreen } from '@/components/ThemedScreen';
import { screenScrollContentStyle } from '@/constants/screen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import {
  defaultReminderFormValues,
  ReminderForm,
  ReminderFormFields,
  ReminderFormSubmit,
} from '@/components/ReminderForm';
import { insertReminder } from '@/database/reminderRepository';
import { useVehicle } from '@/hooks/useVehicle';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { ReminderFormValues } from '@/schemas/reminderForm';

export default function AddReminderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refresh, isReady } = useDatabase();
  const { vehicle, isLoading, error } = useVehicle(id);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const notificationNotice = getNotificationUnavailableNotice();

  const onSubmit = async (values: ReminderFormValues) => {
    if (!isReady || !vehicle) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await insertReminder(vehicle.id, values);
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
        <Stack.Screen options={{ title: t('addReminder') }} />
        <LoadingState />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: t('addReminder') }} />
        <EmptyState
          title={t('vehicleNotFound')}
          description={error?.message ?? t('vehicleNotFound')}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: t('addReminder') }} />
      <ThemedScreen>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ReminderForm
            defaultValues={defaultReminderFormValues()}
            webNotice={notificationNotice}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={screenScrollContentStyle}
              keyboardShouldPersistTaps="handled">
              <ReminderFormFields />
            </ScrollView>

            <ScreenBottomActions>
              <ReminderFormSubmit
                submitLabel={t('saveReminder')}
                onSubmit={onSubmit}
                submitError={submitError}
              />
            </ScreenBottomActions>
          </ReminderForm>

          <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
            {t('reminderSaved')}
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
