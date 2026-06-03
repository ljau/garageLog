import { Portal, Dialog, Button, Text } from 'react-native-paper';

import { t } from '@/lib/i18n';

interface DeleteMaintenanceDialogProps {
  visible: boolean;
  recordType: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function DeleteMaintenanceDialog({
  visible,
  recordType,
  isDeleting,
  onConfirm,
  onDismiss,
}: DeleteMaintenanceDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{t('deleteMaintenanceTitle')}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            {t('deleteMaintenanceMessage', { name: recordType })}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={isDeleting}>
            {t('cancel')}
          </Button>
          <Button
            onPress={onConfirm}
            loading={isDeleting}
            disabled={isDeleting}
            textColor="#B00020">
            {t('delete')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
