import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Snackbar, Text } from 'react-native-paper';

import { screenContentContainerStyle } from '@/constants/screen';
import { ThemedScreen } from '@/components/ThemedScreen';
import { DeleteVehicleDialog } from '@/components/DeleteVehicleDialog';
import { MutedText } from '@/components/MutedText';
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
      <ThemedScreen>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={screenContentContainerStyle}>
        <Text variant="headlineSmall">{vehicle.nickname}</Text>
        <MutedText variant="titleMedium" style={styles.subtitle}>
          {title}
        </MutedText>

        <Divider style={styles.divider} />

        <View style={styles.detailRow}>
          <MutedText variant="labelLarge">{t('brand')}</MutedText>
          <Text variant="bodyLarge">{vehicle.brand}</Text>
        </View>
        <View style={styles.detailRow}>
          <MutedText variant="labelLarge">{t('model')}</MutedText>
          <Text variant="bodyLarge">{vehicle.model}</Text>
        </View>
        <View style={styles.detailRow}>
          <MutedText variant="labelLarge">{t('year')}</MutedText>
          <Text variant="bodyLarge">{String(vehicle.year)}</Text>
        </View>
        <View style={styles.detailRow}>
          <MutedText variant="labelLarge">{t('currentMileage')}</MutedText>
          <Text variant="bodyLarge">
            {formatMileage(vehicle.currentMileage)} {t('mileageUnit')}
          </Text>
        </View>
        {vehicle.plateNumber ? (
          <View style={styles.detailRow}>
            <MutedText variant="labelLarge">{t('plateNumber')}</MutedText>
            <Text variant="bodyLarge">{vehicle.plateNumber}</Text>
          </View>
        ) : null}
        <View style={styles.detailRow}>
          <MutedText variant="labelLarge">{t('addedOn')}</MutedText>
          <Text variant="bodyLarge">{formatDate(vehicle.createdAt)}</Text>
        </View>

        <Button
          mode="contained-tonal"
          icon="wrench"
          onPress={() => router.push(`/vehicles/${vehicle.id}/maintenance`)}
          style={styles.action}>
          {t('viewMaintenanceHistory')}
        </Button>
        <Button
          mode="contained-tonal"
          icon="bell"
          onPress={() => router.push(`/vehicles/${vehicle.id}/reminders`)}
          style={styles.action}>
          {t('viewReminders')}
        </Button>
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
      </ThemedScreen>

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
  scroll: {
    flex: 1,
  },
  subtitle: {
    marginTop: 4,
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
