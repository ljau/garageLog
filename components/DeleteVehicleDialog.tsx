import { Portal, Dialog, Button, Text } from 'react-native-paper';

import { t } from '@/lib/i18n';

interface DeleteVehicleDialogProps {
  visible: boolean;
  vehicleName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function DeleteVehicleDialog({
  visible,
  vehicleName,
  isDeleting,
  onConfirm,
  onDismiss,
}: DeleteVehicleDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{t('deleteVehicleTitle')}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            {t('deleteVehicleMessage', { name: vehicleName })}
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
