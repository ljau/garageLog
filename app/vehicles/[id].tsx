import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Snackbar, Text } from 'react-native-paper';

import { DeleteVehicleDialog } from '@/components/DeleteVehicleDialog';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { deleteVehicle } from '@/database/vehicleRepository';
import { useVehicle } from '@/hooks/useVehicle';
import { formatDate, formatMileage, formatVehicleTitle } from '@/lib/format';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function VehicleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refresh, isReady } = useDatabase();
  const { vehicle, isLoading, error } = useVehicle(id);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleDelete = async () => {
    if (!isReady || !vehicle) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteVehicle(vehicle.id);
      refresh();
      setDeleteDialogVisible(false);
      setSnackbarVisible(true);
      setTimeout(() => router.replace('/(tabs)/vehicles'), 600);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : t('databaseError'));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: t('vehicleDetails') }} />
        <LoadingState />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: t('vehicleDetails') }} />
        <EmptyState
          title={t('vehicleNotFound')}
          description={error?.message ?? t('vehicleNotFound')}
        />
      </>
    );
  }

  const title = formatVehicleTitle(vehicle.brand, vehicle.model, vehicle.year);

  return (
    <>
      <Stack.Screen options={{ title: vehicle.nickname }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="headlineSmall">{vehicle.nickname}</Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          {title}
        </Text>

        <Divider style={styles.divider} />

        <View style={styles.detailRow}>
          <Text variant="labelLarge">{t('brand')}</Text>
          <Text variant="bodyLarge">{vehicle.brand}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="labelLarge">{t('model')}</Text>
          <Text variant="bodyLarge">{vehicle.model}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="labelLarge">{t('year')}</Text>
          <Text variant="bodyLarge">{String(vehicle.year)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text variant="labelLarge">{t('currentMileage')}</Text>
          <Text variant="bodyLarge">
            {formatMileage(vehicle.currentMileage)} {t('mileageUnit')}
          </Text>
        </View>
        {vehicle.plateNumber ? (
          <View style={styles.detailRow}>
            <Text variant="labelLarge">{t('plateNumber')}</Text>
            <Text variant="bodyLarge">{vehicle.plateNumber}</Text>
          </View>
        ) : null}
        <View style={styles.detailRow}>
          <Text variant="labelLarge">{t('addedOn')}</Text>
          <Text variant="bodyLarge">{formatDate(vehicle.createdAt)}</Text>
        </View>

        <Button
          mode="contained"
          icon="pencil"
          onPress={() => router.push(`/vehicles/${vehicle.id}/edit`)}
          style={styles.action}>
          {t('edit')}
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          textColor="#B00020"
          onPress={() => setDeleteDialogVisible(true)}
          style={styles.action}>
          {t('deleteVehicle')}
        </Button>

        {deleteError ? (
          <Text variant="bodySmall" style={styles.error}>
            {deleteError}
          </Text>
        ) : null}
      </ScrollView>

      <DeleteVehicleDialog
        visible={deleteDialogVisible}
        vehicleName={vehicle.nickname}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onDismiss={() => {
          if (!isDeleting) {
            setDeleteDialogVisible(false);
          }
        }}
      />

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)}>
        {t('vehicleDeleted')}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  subtitle: {
    marginTop: 4,
    opacity: 0.8,
  },
  divider: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  action: {
    marginTop: 12,
  },
  error: {
    marginTop: 12,
    color: '#B00020',
  },
});
