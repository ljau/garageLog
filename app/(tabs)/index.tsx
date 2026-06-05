import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { screenScrollContentStyle } from '@/constants/screen';
import { EmptyState } from '@/components/EmptyState';
import { NextUpSection } from '@/components/NextUpSection';
import { ScreenBottomActions } from '@/components/ScreenBottomActions';
import { ThemedScreen } from '@/components/ThemedScreen';
import { LoadingState } from '@/components/LoadingState';
import { StatCard } from '@/components/StatCard';
import { VehicleCard } from '@/components/VehicleCard';
import type { DashboardReminder } from '@/database/reminderRepository';
import { getVehicleStats } from '@/database/vehicleRepository';
import { useDashboardReminders } from '@/hooks/useDashboardReminders';
import { useRecentVehicles } from '@/hooks/useVehicles';
import { formatMileage } from '@/lib/format';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function DashboardScreen() {
  const router = useRouter();
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

  const goToAddVehicle = () => router.push('/vehicles/add');
  const goToVehicles = () => router.push('/(tabs)/vehicles');
  const goToReminder = (reminder: DashboardReminder) =>
    router.push(`/vehicles/${reminder.vehicleId}/reminders/${reminder.id}/edit`);

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
      />
    );
  }

  if (error) {
    return <EmptyState title={t('databaseError')} description={error.message} />;
  }

  return (
    <ThemedScreen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={screenScrollContentStyle}>
      <Text variant="headlineSmall" style={styles.heading}>
        {t('appName')}
      </Text>

      <View style={styles.statsRow}>
        <StatCard label={t('totalVehicles')} value={String(stats.total)} />
        <StatCard
          label={t('averageMileage')}
          value={
            stats.total > 0
              ? `${formatMileage(stats.averageMileage)} ${t('mileageUnit')}`
              : '—'
          }
        />
      </View>

      {stats.total > 0 ? (
        <NextUpSection
          reminders={dashboardReminders}
          onReminderPress={goToReminder}
        />
      ) : null}

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium">{t('recentVehicles')}</Text>
        {stats.total > 0 ? (
          <Button compact onPress={goToVehicles}>
            {t('viewAllVehicles')}
          </Button>
        ) : null}
      </View>

      {vehicles.length === 0 ? (
        <EmptyState
          embedded
          title={t('noVehiclesYet')}
          description={t('noVehiclesDescription')}
          actionLabel={t('addVehicle')}
          onAction={goToAddVehicle}
        />
      ) : (
        vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onPress={() => router.push(`/vehicles/${vehicle.id}`)}
          />
        ))
      )}
      </ScrollView>

      <ScreenBottomActions>
        <Button mode="contained" icon="plus" onPress={goToAddVehicle}>
          {t('addVehicle')}
        </Button>
      </ScreenBottomActions>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  heading: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
