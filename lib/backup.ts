import dayjs from 'dayjs';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import {
  createBackupSnapshot,
  restoreBackupSnapshot,
  type BackupSnapshotCounts,
} from '@/database/backupRepository';
import { t } from '@/lib/i18n';
import { parseBackupFile, type BackupFile } from '@/schemas/backup';

export class BackupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackupError';
  }
}

export class BackupExportCancelledError extends BackupError {
  constructor() {
    super('Backup export cancelled');
    this.name = 'BackupExportCancelledError';
  }
}

function backupFilename(): string {
  return `garagelog-backup-${dayjs().format('YYYY-MM-DD')}.json`;
}

function isUserCancelled(error: unknown): boolean {
  if (error instanceof BackupExportCancelledError) {
    return true;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes('cancel') ||
      message.includes('dismiss') ||
      message.includes('did not share') ||
      message.includes('user denied')
    ) {
      return true;
    }
  }

  return false;
}

function downloadJsonOnWeb(json: string, filename: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

async function shareJsonOnWeb(json: string, filename: string): Promise<void> {
  const file = new File([json], filename, { type: 'application/json' });

  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] })
  ) {
    void navigator.share({
      files: [file],
      title: filename,
    }).catch(() => {
      // User closed the share menu — the backup file was already prepared.
    });
    return;
  }

  downloadJsonOnWeb(json, filename);
}

async function writeBackupToCache(json: string, filename: string): Promise<string> {
  const directory = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!directory) {
    throw new BackupError(t('exportBackupFailed'));
  }

  const fileUri = `${directory}${filename}`;
  await FileSystem.writeAsStringAsync(fileUri, json);
  return fileUri;
}

async function readTextFromUri(uri: string): Promise<string> {
  try {
    const text = await FileSystem.readAsStringAsync(uri);
    if (text.trim()) {
      return text;
    }
  } catch {
    // Fall back to fetch for content:// and other URI types.
  }

  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new BackupError(t('importBackupUnreadable'));
    }

    const text = await response.text();
    if (text.trim()) {
      return text;
    }
  } catch (error) {
    if (error instanceof BackupError) {
      throw error;
    }
  }

  throw new BackupError(t('importBackupUnreadable'));
}

function launchShareSheet(fileUri: string, filename: string): void {
  void Sharing.shareAsync(fileUri, {
    mimeType: 'application/json',
    dialogTitle: t('exportBackupShareTitle'),
    UTI: 'public.json',
  }).catch(() => {
    // User closed the share sheet — the backup file was already created.
  });
}

export interface PreparedBackupExport {
  counts: BackupSnapshotCounts;
  openShareSheet: () => void;
}

export async function prepareBackupExport(): Promise<PreparedBackupExport> {
  const snapshot = await createBackupSnapshot();
  const json = JSON.stringify(snapshot, null, 2);
  const filename = backupFilename();
  const counts = {
    vehicles: snapshot.data.vehicles.length,
    maintenanceRecords: snapshot.data.maintenanceRecords.length,
    reminders: snapshot.data.reminders.length,
  };

  if (Platform.OS === 'web') {
    return {
      counts,
      openShareSheet: () => {
        void shareJsonOnWeb(json, filename);
      },
    };
  }

  const fileUri = await writeBackupToCache(json, filename);

  if (!fileUri.startsWith('file://')) {
    throw new BackupError(t('exportBackupFailed'));
  }

  const canShare = await Sharing.isAvailableAsync();
  if (!canShare) {
    throw new BackupError(t('exportBackupShareUnavailable'));
  }

  return {
    counts,
    openShareSheet: () => launchShareSheet(fileUri, filename),
  };
}

export async function exportBackupFile(): Promise<BackupSnapshotCounts> {
  const prepared = await prepareBackupExport();
  return prepared.counts;
}

export function scheduleBackupShare(openShareSheet: () => void): void {
  const idleCallback = globalThis.requestIdleCallback;
  if (typeof idleCallback === 'function') {
    idleCallback(openShareSheet);
    return;
  }

  setTimeout(openShareSheet, 0);
}

export async function pickBackupFile(): Promise<{
  backup: BackupFile;
  fileName: string;
} | null> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: false,
    type: 'application/json',
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  const rawText = await readTextFromUri(asset.uri);

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new BackupError(t('importBackupNotJson'));
  }

  return {
    backup: parseBackupFile(parsed),
    fileName: asset.name,
  };
}

export async function importPickedBackup(
  backup: BackupFile,
): Promise<BackupSnapshotCounts> {
  return restoreBackupSnapshot(backup);
}

export { isUserCancelled as isBackupExportCancelled };
