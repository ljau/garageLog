import { Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ZodError } from 'zod';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Snackbar, Text } from 'react-native-paper';

import { ImportBackupDialog } from '@/components/ImportBackupDialog';
import { MutedText } from '@/components/MutedText';
import { ThemedScreen } from '@/components/ThemedScreen';
import { screenContentContainerStyle } from '@/constants/screen';
import { createBackupSnapshot } from '@/database/backupRepository';
import {
  BackupError,
  BackupExportCancelledError,
  prepareBackupExport,
  scheduleBackupShare,
  importPickedBackup,
  pickBackupFile,
} from '@/lib/backup';
import { t } from '@/lib/i18n';
import { InvalidBackupError, type BackupFile } from '@/schemas/backup';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function DataScreen() {
  const { refresh, isReady } = useDatabase();
  const [counts, setCounts] = useState({
    vehicles: 0,
    maintenanceRecords: 0,
    reminders: 0,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isPickingBackup, setIsPickingBackup] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importDialogVisible, setImportDialogVisible] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<BackupFile | null>(null);
  const [pendingFileName, setPendingFileName] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadCounts = useCallback(async () => {
    if (!isReady) {
      return;
    }

    const snapshot = await createBackupSnapshot();
    setCounts({
      vehicles: snapshot.data.vehicles.length,
      maintenanceRecords: snapshot.data.maintenanceRecords.length,
      reminders: snapshot.data.reminders.length,
    });
  }, [isReady]);

  useFocusEffect(
    useCallback(() => {
      void loadCounts();
    }, [loadCounts]),
  );

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    let openShareSheet: (() => void) | undefined;

    try {
      const prepared = await prepareBackupExport();
      setCounts(prepared.counts);
      setSuccessMessage(t('exportBackupSuccess'));
      openShareSheet = prepared.openShareSheet;
    } catch (error) {
      if (error instanceof BackupExportCancelledError) {
        return;
      }

      setErrorMessage(
        error instanceof BackupError || error instanceof Error
          ? error.message
          : t('exportBackupFailed'),
      );
    } finally {
      setIsExporting(false);
    }

    if (openShareSheet) {
      scheduleBackupShare(openShareSheet);
    }
  };

  const clearPendingImport = () => {
    setPendingBackup(null);
    setPendingFileName(undefined);
    setImportDialogVisible(false);
  };

  const handleImportPress = async () => {
    setIsPickingBackup(true);
    setErrorMessage(null);
    clearPendingImport();

    try {
      const picked = await pickBackupFile();
      if (!picked) {
        return;
      }

      setPendingBackup(picked.backup);
      setPendingFileName(picked.fileName);
      setImportDialogVisible(true);
    } catch (error) {
      if (error instanceof ZodError || error instanceof InvalidBackupError) {
        setErrorMessage(t('importBackupInvalid'));
      } else {
        setErrorMessage(
          error instanceof BackupError || error instanceof Error
            ? error.message
            : t('importBackupFailed'),
        );
      }
    } finally {
      setIsPickingBackup(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingBackup) {
      return;
    }

    setIsImporting(true);
    setImportDialogVisible(false);
    setErrorMessage(null);

    try {
      const importedCounts = await importPickedBackup(pendingBackup);
      refresh();
      setCounts(importedCounts);
      setSuccessMessage(t('importBackupSuccess'));
    } catch (error) {
      if (error instanceof ZodError || error instanceof InvalidBackupError) {
        setErrorMessage(t('importBackupInvalid'));
      } else {
        setErrorMessage(
          error instanceof BackupError || error instanceof Error
            ? error.message
            : t('importBackupFailed'),
        );
      }
    } finally {
      setIsImporting(false);
      clearPendingImport();
    }
  };

  const isImportBusy = isPickingBackup || isImporting;

  return (
    <>
      <Stack.Screen options={{ title: t('dataAndBackup') }} />
      <ThemedScreen>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={screenContentContainerStyle}>
          <Text variant="headlineSmall" style={styles.heading}>
            {t('dataAndBackup')}
          </Text>
          <MutedText variant="bodyMedium" style={styles.description}>
            {t('dataAndBackupDescription')}
          </MutedText>

          <Card style={styles.summaryCard} mode="outlined">
            <Card.Content>
              <MutedText variant="labelLarge">{t('backupContents')}</MutedText>
              <Text variant="bodyLarge" style={styles.summaryLine}>
                {t('backupVehicleCount', { count: String(counts.vehicles) })}
              </Text>
              <Text variant="bodyLarge" style={styles.summaryLine}>
                {t('backupMaintenanceCount', {
                  count: String(counts.maintenanceRecords),
                })}
              </Text>
              <Text variant="bodyLarge">
                {t('backupReminderCount', { count: String(counts.reminders) })}
              </Text>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            icon="export"
            onPress={handleExport}
            loading={isExporting}
            disabled={isExporting || isImportBusy}
            style={styles.action}>
            {t('exportBackup')}
          </Button>
          <MutedText variant="bodySmall" style={styles.hint}>
            {t('exportBackupHint')}
          </MutedText>

          <Button
            mode="outlined"
            icon="import"
            onPress={handleImportPress}
            loading={isImportBusy}
            disabled={isExporting || isImportBusy}
            style={styles.action}>
            {t('importBackup')}
          </Button>
          <MutedText variant="bodySmall">{t('importBackupHint')}</MutedText>
        </ScrollView>
      </ThemedScreen>

      <ImportBackupDialog
        visible={importDialogVisible}
        fileName={pendingFileName}
        isImporting={isImporting}
        onConfirm={handleConfirmImport}
        onDismiss={() => {
          if (!isImporting) {
            clearPendingImport();
          }
        }}
      />

      <Snackbar visible={!!successMessage} onDismiss={() => setSuccessMessage(null)}>
        {successMessage}
      </Snackbar>
      <Snackbar visible={!!errorMessage} onDismiss={() => setErrorMessage(null)}>
        {errorMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  heading: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryLine: {
    marginTop: 8,
  },
  action: {
    marginBottom: 8,
  },
  hint: {
    marginBottom: 20,
  },
});
