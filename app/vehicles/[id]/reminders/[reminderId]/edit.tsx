import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { getNotificationUnavailableNotice } from '@/lib/notificationNotice';
import { Button, Snackbar, Text } from 'react-native-paper';

import { ScreenBottomActions } from '@/components/ScreenBottomActions';
import { ThemedScreen } from '@/components/ThemedScreen';
import { screenScrollContentStyle } from '@/constants/screen';
import { DeleteReminderDialog } from '@/components/DeleteReminderDialog';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import {
  reminderToFormValues,
  ReminderForm,
  ReminderFormFields,
  ReminderFormSubmit,
} from '@/components/ReminderForm';
import { deleteReminder, updateReminder } from '@/database/reminderRepository';
import { useReminder } from '@/hooks/useReminder';
import { reminderTypeLabel } from '@/lib/reminders';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { ReminderFormValues } from '@/schemas/reminderForm';

export default function EditReminderScreen() {
  const router = useRouter();
  const { reminderId } = useLocalSearchParams<{ id: string; reminderId: string }>();
  const { refresh, isReady } = useDatabase();
  const { reminder, isLoading, error } = useReminder(reminderId);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const notificationNotice = getNotificationUnavailableNotice();

  const onSubmit = async (values: ReminderFormValues) => {
    if (!isReady || !reminder) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await updateReminder(reminder.id, values);
      refresh();
      setSnackbarMessage(t('reminderUpdated'));
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 600);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('databaseError'));
    }
  };

  const handleDelete = async () => {
    if (!isReady || !reminder) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteReminder(reminder.id);
      refresh();
      setDeleteDialogVisible(false);
      setSnackbarMessage(t('reminderDeleted'));
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 600);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t('databaseError'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: t('editReminder') }} />
        <LoadingState />
      </>
    );
  }

  if (error || !reminder) {
    return (
      <>
        <Stack.Screen options={{ title: t('editReminder') }} />
        <EmptyState
          title={t('reminderNotFound')}
          description={error?.message ?? t('reminderNotFound')}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: t('editReminder') }} />
      <ThemedScreen>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ReminderForm
            defaultValues={reminderToFormValues(reminder)}
            webNotice={notificationNotice}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={screenScrollContentStyle}
              keyboardShouldPersistTaps="handled">
              <ReminderFormFields />
            </ScrollView>

            <ScreenBottomActions>
              <ReminderFormSubmit
                submitLabel={t('updateReminder')}
                onSubmit={onSubmit}
                submitError={submitError}
              />
              <Button
                mode="outlined"
                icon="delete"
                textColor="#B00020"
                onPress={() => setDeleteDialogVisible(true)}>
                {t('deleteReminder')}
              </Button>

              {deleteError ? (
                <Text variant="bodySmall" style={styles.error}>
                  {deleteError}
                </Text>
              ) : null}
            </ScreenBottomActions>
          </ReminderForm>

          <DeleteReminderDialog
            visible={deleteDialogVisible}
            reminderName={reminderTypeLabel(reminder.type)}
            isDeleting={isDeleting}
            onConfirm={handleDelete}
            onDismiss={() => {
              if (!isDeleting) {
                setDeleteDialogVisible(false);
              }
            }}
          />

          <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
            {snackbarMessage}
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
  error: {
    color: '#B00020',
  },
});
