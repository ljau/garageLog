import { useState } from 'react';
import { Snackbar } from 'react-native-paper';

import { FormSheet } from '@/components/FormSheet';
import {
  defaultMaintenanceFormValues,
  MaintenanceForm,
  MaintenanceFormFields,
  MaintenanceFormSubmit,
} from '@/components/MaintenanceForm';
import { insertMaintenanceRecord } from '@/database/maintenanceRepository';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { MaintenanceFormValues } from '@/schemas/maintenanceForm';

interface AddMaintenanceSheetProps {
  visible: boolean;
  formKey: number;
  vehicleId: string;
  currentMileage: number;
  onDismiss: () => void;
  onSaved?: () => void;
}

export function AddMaintenanceSheet({
  visible,
  formKey,
  vehicleId,
  currentMileage,
  onDismiss,
  onSaved,
}: AddMaintenanceSheetProps) {
  const { refresh, isReady } = useDatabase();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: MaintenanceFormValues) => {
    if (!isReady) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await insertMaintenanceRecord(vehicleId, values);
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
      <FormSheet visible={visible} title={t('addMaintenance')} onDismiss={onDismiss}>
        {visible ? (
          <MaintenanceForm
            key={formKey}
            defaultValues={defaultMaintenanceFormValues(currentMileage)}>
            <MaintenanceFormFields />
            <MaintenanceFormSubmit
              submitLabel={t('saveMaintenance')}
              onSubmit={onSubmit}
              submitError={submitError}
            />
          </MaintenanceForm>
        ) : null}
      </FormSheet>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        {t('maintenanceSaved')}
      </Snackbar>
    </>
  );
}
