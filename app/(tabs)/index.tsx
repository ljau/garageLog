import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { screenScrollContentStyle } from '@/constants/screen';
import { EmptyState } from '@/components/EmptyState';
import { NextUpSection } from '@/components/NextUpSection';
import { ScreenBottomActions } from '@/components/ScreenBottomActions';
import { SectionHeader } from '@/components/SectionHeader';
import { ThemedScreen } from '@/components/ThemedScreen';
import { LoadingState } from '@/components/LoadingState';
import { StatCard } from '@/components/StatCard';
import { AddVehicleSheet } from '@/components/sheets/AddVehicleSheet';
import { VehicleCard } from '@/components/VehicleCard';
import type { DashboardReminder } from '@/database/reminderRepository';
import { getVehicleStats } from '@/database/vehicleRepository';
import { useDashboardReminders } from '@/hooks/useDashboardReminders';
import { useFormSheet } from '@/hooks/useFormSheet';
import { useRecentVehicles } from '@/hooks/useVehicles';
import { formatMileage } from '@/lib/format';
import { t } from '@/lib/i18n';
import { useAppNavigation } from '@/lib/navigation';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function DashboardScreen() {
  const { navigateTo } = useAppNavigation();
  const addVehicleSheet = useFormSheet();
  const { isReady, status, error: dbError } = useDatabase();
  const { vehicles, isLoading, error, reload } = useRecentVehicles(3);
  const {
    reminders: dashboardReminders,
    isLoading: remindersLoading,
    reload: reloadReminders,
  } = useDashboardReminders(5);
  const [stats, setStats] = useState({ total: 0, averageMileage: 0 });

  const loadStats = useCallback(async () => {
    if (!isReady) return;
    const vehicleStats = await getVehicleStats();
    setStats(vehicleStats);
  }, [isReady]);

  useEffect(() => {
    void loadStats();
  }, [loadStats, vehicles.length]);

  useFocusEffect(
    useCallback(() => {
      if (!isReady) {
        return;
      }

      void reload();
      void loadStats();
      void reloadReminders();
    }, [isReady, reload, loadStats, reloadReminders]),
  );

  const goToVehicles = () => navigateTo('/vehicles');
  const goToAverageMileage = () => {
    if (vehicles.length === 1) {
      navigateTo(`/vehicles/${vehicles[0].id}`);
      return;
    }

    goToVehicles();
  };
  const goToReminder = (reminder: DashboardReminder) =>
    navigateTo(`/vehicles/${reminder.vehicleId}/reminders/${reminder.id}/edit`);

  if (
    status === 'loading' ||
    (isReady && isLoading && remindersLoading && vehicles.length === 0 && stats.total === 0)
  ) {
    return <LoadingState />;
  }

  if (status === 'error' || dbError) {
    return (
      <EmptyState
        title={t('databaseError')}
        description={dbError?.message ?? t('databaseError')}
        icon="database-alert"
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title={t('databaseError')}
        description={error.message}
        icon="database-alert"
      />
    );
  }

  return (
    <ThemedScreen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={screenScrollContentStyle}>
        <View style={styles.statsRow}>
          <StatCard
            label={t('totalVehicles')}
            value={String(stats.total)}
            icon="car-multiple"
            onPress={goToVehicles}
          />
          <StatCard
            label={t('averageMileage')}
            value={
              stats.total > 0
                ? `${formatMileage(stats.averageMileage)} ${t('mileageUnit')}`
                : '—'
            }
            icon="speedometer"
            onPress={goToAverageMileage}
          />
        </View>

        {stats.total > 0 ? (
          <NextUpSection
            reminders={dashboardReminders}
            onReminderPress={goToReminder}
          />
        ) : null}

        <SectionHeader
          title={t('recentVehicles')}
          icon="history"
          actionLabel={stats.total > 0 ? t('viewAllVehicles') : undefined}
          onAction={stats.total > 0 ? goToVehicles : undefined}
        />

        {vehicles.length === 0 ? (
          <EmptyState
            embedded
            title={t('noVehiclesYet')}
            description={t('noVehiclesDescription')}
            icon="car-outline"
          />
        ) : (
          vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPress={() => navigateTo(`/vehicles/${vehicle.id}`)}
            />
          ))
        )}
      </ScrollView>

      <ScreenBottomActions>
        <Button mode="contained" icon="plus" onPress={addVehicleSheet.open}>
          {t('addVehicle')}
        </Button>
      </ScreenBottomActions>

      <AddVehicleSheet
        visible={addVehicleSheet.visible}
        formKey={addVehicleSheet.formKey}
        onDismiss={addVehicleSheet.close}
        onSaved={() => {
          void reload();
          void loadStats();
        }}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
});
