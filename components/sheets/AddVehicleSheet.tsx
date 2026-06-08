import { useState } from 'react';
import { Snackbar } from 'react-native-paper';

import { FormSheet } from '@/components/FormSheet';
import { VehicleForm, VehicleFormFields, VehicleFormSubmit } from '@/components/VehicleForm';
import { insertVehicle } from '@/database/vehicleRepository';
import { t } from '@/lib/i18n';
import { DEFAULT_VEHICLE_CATEGORY } from '@/models/vehicle';
import { useDatabase } from '@/providers/DatabaseProvider';
import type { VehicleFormValues } from '@/schemas/vehicleForm';

const defaultValues: VehicleFormValues = {
  category: DEFAULT_VEHICLE_CATEGORY,
  nickname: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  plateNumber: '',
  currentMileage: 0,
};

interface AddVehicleSheetProps {
  visible: boolean;
  formKey: number;
  onDismiss: () => void;
  onSaved?: () => void;
}

export function AddVehicleSheet({ visible, formKey, onDismiss, onSaved }: AddVehicleSheetProps) {
  const { refresh, isReady } = useDatabase();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: VehicleFormValues) => {
    if (!isReady) {
      setSubmitError(t('databaseError'));
      return;
    }

    setSubmitError(null);

    try {
      await insertVehicle(values);
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
      <FormSheet visible={visible} title={t('addVehicle')} onDismiss={onDismiss}>
        {visible ? (
          <VehicleForm key={formKey} defaultValues={defaultValues}>
            <VehicleFormFields />
            <VehicleFormSubmit
              submitLabel={t('saveVehicle')}
              onSubmit={onSubmit}
              submitError={submitError}
            />
          </VehicleForm>
        ) : null}
      </FormSheet>

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        {t('vehicleSaved')}
      </Snackbar>
    </>
  );
}
