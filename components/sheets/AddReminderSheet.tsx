import { useState } from 'react';
import { Snackbar } from 'react-native-paper';

import { FormSheet } from '@/components/FormSheet';
import {
  defaultReminderFormValues,
  ReminderForm,
  ReminderFormFields,
  ReminderFormSubmit,
} from '@/components/ReminderForm';
import { insertReminder } from '@/database/reminderRepository';
import { getNotificationUnavailableNotice } from '@/lib/notificationNotice';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { ReminderFormValues } from '@/schemas/reminderForm';

interface AddReminderSheetProps {
  visible: boolean;
  formKey: number;
  vehicleId: string;
  onDismiss: () => void;
  onSaved?: () => void;
}

export function AddReminderSheet({
  visible,
  formKey,
  vehicleId,
  onDismiss,
  onSaved,
}: AddReminderSheetProps) {
  const { refresh, isReady } = useDatabase();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const notificationNotice = getNotificationUnavailableNotice();

  const onSubmit = async (values: ReminderFormValues) => {
    if (!isReady) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await insertReminder(vehicleId, values);
      refresh();
      onSaved?.();
      setSnackbarVisible(true);
      setTimeout(onDismiss, 600);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t('databaseError'));
    }
  };

  return (
    <>
      <FormSheet visible={visible} title={t('addReminder')} onDismiss={onDismiss}>
        {visible ? (
          <ReminderForm key={formKey} defaultValues={defaultReminderFormValues()} webNotice={notificationNotice}>
            <ReminderFormFields />
            <ReminderFormSubmit
              submitLabel={t('saveReminder')}
              onSubmit={onSubmit}
              submitError={submitError}
            />
          </ReminderForm>
        ) : null}
      </FormSheet>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        {t('reminderSaved')}
      </Snackbar>
    </>
  );
}
