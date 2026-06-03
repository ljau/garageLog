import { Portal, Dialog, Button, Text } from 'react-native-paper';

import { t } from '@/lib/i18n';

interface DeleteReminderDialogProps {
  visible: boolean;
  reminderName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function DeleteReminderDialog({
  visible,
  reminderName,
  isDeleting,
  onConfirm,
  onDismiss,
}: DeleteReminderDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{t('deleteReminderTitle')}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">
            {t('deleteReminderMessage', { name: reminderName })}
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
