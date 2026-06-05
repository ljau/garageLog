import { Portal, Dialog, Button, Text } from 'react-native-paper';

import { t } from '@/lib/i18n';

interface ImportBackupDialogProps {
  visible: boolean;
  fileName?: string;
  isImporting: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ImportBackupDialog({
  visible,
  fileName,
  isImporting,
  onConfirm,
  onDismiss,
}: ImportBackupDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{t('importBackupTitle')}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            {t('importBackupMessage', { fileName: fileName ?? t('importBackupUnknownFile') })}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={isImporting}>
            {t('cancel')}
          </Button>
          <Button onPress={onConfirm} loading={isImporting} disabled={isImporting}>
            {t('importBackupConfirm')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
