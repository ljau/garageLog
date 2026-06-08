import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Snackbar, Text, useTheme } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';
import { DeleteVehicleDialog } from '@/components/DeleteVehicleDialog';
import { DetailInfoRow } from '@/components/DetailInfoRow';
import { IconCircle, type MciIconName } from '@/components/IconCircle';
import { MutedText } from '@/components/MutedText';
import { QuickActionTile } from '@/components/QuickActionTile';
import { AddMaintenanceSheet } from '@/components/sheets/AddMaintenanceSheet';
import { AddReminderSheet } from '@/components/sheets/AddReminderSheet';
import { ScreenBottomActions } from '@/components/ScreenBottomActions';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { deleteVehicle } from '@/database/vehicleRepository';
import { useFormSheet } from '@/hooks/useFormSheet';
import { useVehicle } from '@/hooks/useVehicle';
import { formatDate, formatMileage, formatVehicleDisplayName, formatVehicleTitle } from '@/lib/format';
import { t } from '@/lib/i18n';
import { useAppNavigation } from '@/lib/navigation';
import { vehicleCategoryIcon, vehicleCategoryLabel } from '@/lib/vehicles';
import { useDatabase } from '@/providers/DatabaseProvider';
import { screenScrollContentStyle } from '@/constants/screen';

export default function VehicleDetailScreen() {
  const theme = useTheme();
  const { navigateTo, replaceTo } = useAppNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refresh, isReady } = useDatabase();
  const { vehicle, isLoading, error, reload } = useVehicle(id);
  const addMaintenanceSheet = useFormSheet();
  const addReminderSheet = useFormSheet();
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
      setTimeout(() => replaceTo('/vehicles'), 600);
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
          icon="car-off"
        />
      </>
    );
  }

  const title = formatVehicleTitle(vehicle.brand, vehicle.model, vehicle.year);
  const displayName = formatVehicleDisplayName(vehicle);
  const hasNickname = !!vehicle.nickname?.trim();
  const categoryIcon = vehicleCategoryIcon(vehicle.category) as MciIconName;

  return (
    <>
      <Stack.Screen options={{ title: displayName }} />
      <ThemedScreen>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[screenScrollContentStyle, styles.scrollContent]}>
          <Card style={styles.heroCard} mode="elevated">
            <Card.Content style={styles.heroContent}>
              <IconCircle
                name={categoryIcon}
                color={theme.colors.onPrimaryContainer}
                backgroundColor={theme.colors.primary}
                size={64}
                iconSize={34}
              />
              <View style={styles.heroText}>
                <Text variant="headlineSmall">{displayName}</Text>
                {hasNickname ? (
                  <MutedText variant="titleMedium">{title}</MutedText>
                ) : null}
                <MutedText variant="bodyMedium">
                  {vehicleCategoryLabel(vehicle.category)}
                </MutedText>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.detailsCard} mode="outlined">
            <Card.Content>
              <DetailInfoRow icon="factory" label={t('brand')} value={vehicle.brand} />
              <DetailInfoRow icon="car-info" label={t('model')} value={vehicle.model} />
              <DetailInfoRow icon="calendar" label={t('year')} value={String(vehicle.year)} />
              <DetailInfoRow
                icon="speedometer"
                label={t('currentMileage')}
                value={`${formatMileage(vehicle.currentMileage)} ${t('mileageUnit')}`}
              />
              {vehicle.plateNumber ? (
                <DetailInfoRow
                  icon="card-text-outline"
                  label={t('plateNumber')}
                  value={vehicle.plateNumber}
                />
              ) : null}
              <DetailInfoRow
                icon="calendar-plus"
                label={t('addedOn')}
                value={formatDate(vehicle.createdAt)}
              />
            </Card.Content>
          </Card>

          <Text variant="titleMedium" style={styles.actionsHeading}>
            {t('quickActions')}
          </Text>
          <View style={styles.actionGrid}>
            <QuickActionTile
              icon="wrench"
              label={t('viewMaintenanceHistory')}
              onPress={() => navigateTo(`/vehicles/${vehicle.id}/maintenance`)}
            />
            <QuickActionTile
              icon="bell-outline"
              label={t('viewReminders')}
              onPress={() => navigateTo(`/vehicles/${vehicle.id}/reminders`)}
            />
            <QuickActionTile
              icon="pencil-outline"
              label={t('edit')}
              onPress={() => navigateTo(`/vehicles/${vehicle.id}/edit`)}
            />
            <QuickActionTile
              icon="delete-outline"
              label={t('deleteVehicle')}
              onPress={() => setDeleteDialogVisible(true)}
              accentColor={theme.colors.error}
            />
          </View>
        </ScrollView>

        <ScreenBottomActions>
          <Button
            mode="contained"
            icon="wrench"
            onPress={addMaintenanceSheet.open}>
            {t('addMaintenance')}
          </Button>
          <Button
            mode="contained-tonal"
            icon="bell-plus-outline"
            onPress={addReminderSheet.open}>
            {t('addReminder')}
          </Button>

          {deleteError ? (
            <Text variant="bodySmall" style={styles.error}>
              {deleteError}
            </Text>
          ) : null}
        </ScreenBottomActions>
      </ThemedScreen>

      <DeleteVehicleDialog
        visible={deleteDialogVisible}
        vehicleName={displayName}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onDismiss={() => {
          if (!isDeleting) {
            setDeleteDialogVisible(false);
          }
        }}
      />

      <AddMaintenanceSheet
        visible={addMaintenanceSheet.visible}
        formKey={addMaintenanceSheet.formKey}
        vehicleId={vehicle.id}
        currentMileage={vehicle.currentMileage}
        onDismiss={addMaintenanceSheet.close}
        onSaved={() => void reload()}
      />

      <AddReminderSheet
        visible={addReminderSheet.visible}
        formKey={addReminderSheet.formKey}
        vehicleId={vehicle.id}
        onDismiss={addReminderSheet.close}
        onSaved={() => void reload()}
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
  scrollContent: {
    flexGrow: 0,
    paddingBottom: 16,
  },
  heroCard: {
    marginBottom: 16,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroText: {
    flex: 1,
    gap: 2,
  },
  detailsCard: {
    marginBottom: 20,
  },
  actionsHeading: {
    marginBottom: 12,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 10,
  },
  error: {
    color: '#B00020',
  },
});
