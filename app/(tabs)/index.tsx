import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { screenContentContainerStyle } from '@/constants/screen';
import { EmptyState } from '@/components/EmptyState';
import { ThemedScreen } from '@/components/ThemedScreen';
import { LoadingState } from '@/components/LoadingState';
import { StatCard } from '@/components/StatCard';
import { VehicleCard } from '@/components/VehicleCard';
import { getVehicleStats } from '@/database/vehicleRepository';
import { useRecentVehicles } from '@/hooks/useVehicles';
import { formatMileage } from '@/lib/format';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function DashboardScreen() {
  const router = useRouter();
  const { isReady, status, error: dbError } = useDatabase();
  const { vehicles, isLoading, error, reload } = useRecentVehicles(3);
  const [stats, setStats] = useState({ total: 0, averageMileage: 0 });

  const loadStats = useCallback(async () => {
    if (!isReady) return;
    const vehicleStats = await getVehicleStats();
    setStats(vehicleStats);
  }, [isReady]);

  useEffect(() => {
    void loadStats();
  }, [loadStats, vehicles.length]);

  useEffect(() => {
    if (isReady) {
      void reload();
    }
  }, [isReady, reload]);

  const goToAddVehicle = () => router.push('/vehicles/add');
  const goToVehicles = () => router.push('/(tabs)/vehicles');

  if (status === 'loading' || (isReady && isLoading && vehicles.length === 0 && stats.total === 0)) {
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
        contentContainerStyle={screenContentContainerStyle}>
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

      <Button
        mode="contained"
        icon="plus"
        onPress={goToAddVehicle}
        style={styles.addButton}>
        {t('addVehicle')}
      </Button>
      </ScrollView>
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
  addButton: {
    marginTop: 24,
  },
});
