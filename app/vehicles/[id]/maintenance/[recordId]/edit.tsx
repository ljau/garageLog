import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Button, Snackbar, Text } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';
import { screenContentContainerStyle } from '@/constants/screen';
import { DeleteMaintenanceDialog } from '@/components/DeleteMaintenanceDialog';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import {
  maintenanceRecordToFormValues,
  MaintenanceForm,
} from '@/components/MaintenanceForm';
import {
  deleteMaintenanceRecord,
  updateMaintenanceRecord,
} from '@/database/maintenanceRepository';
import { useMaintenanceRecord } from '@/hooks/useMaintenanceRecord';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { MaintenanceFormValues } from '@/schemas/maintenanceForm';

export default function EditMaintenanceScreen() {
  const router = useRouter();
  const { id, recordId } = useLocalSearchParams<{ id: string; recordId: string }>();
  const { refresh, isReady } = useDatabase();
  const { record, isLoading, error } = useMaintenanceRecord(recordId);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const onSubmit = async (values: MaintenanceFormValues) => {
    if (!isReady || !record) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await updateMaintenanceRecord(record.id, values);
      refresh();
      setSnackbarMessage(t('maintenanceUpdated'));
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 600);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('databaseError'));
    }
  };

  const handleDelete = async () => {
    if (!isReady || !record) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteMaintenanceRecord(record.id);
      refresh();
      setDeleteDialogVisible(false);
      setSnackbarMessage(t('maintenanceDeleted'));
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
        <Stack.Screen options={{ title: t('editMaintenance') }} />
        <LoadingState />
      </>
    );
  }

  if (error || !record) {
    return (
      <>
        <Stack.Screen options={{ title: t('editMaintenance') }} />
        <EmptyState
          title={t('maintenanceNotFound')}
          description={error?.message ?? t('maintenanceNotFound')}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: t('editMaintenance') }} />
      <ThemedScreen>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={screenContentContainerStyle}
            keyboardShouldPersistTaps="handled">
          <MaintenanceForm
            defaultValues={maintenanceRecordToFormValues(record)}
            submitLabel={t('updateMaintenance')}
            onSubmit={onSubmit}
            submitError={submitError}
          />

          <Button
            mode="outlined"
            icon="delete"
            textColor="#B00020"
            onPress={() => setDeleteDialogVisible(true)}
            style={styles.deleteButton}>
            {t('deleteMaintenance')}
          </Button>

          {deleteError ? (
            <Text variant="bodySmall" style={styles.error}>
              {deleteError}
            </Text>
          ) : null}
          </ScrollView>

          <DeleteMaintenanceDialog
            visible={deleteDialogVisible}
            recordType={record.type}
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
  deleteButton: {
    marginTop: 12,
  },
  error: {
    marginTop: 12,
    color: '#B00020',
  },
});
