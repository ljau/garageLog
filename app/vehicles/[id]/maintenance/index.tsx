import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { MaintenanceCard } from '@/components/MaintenanceCard';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useVehicle } from '@/hooks/useVehicle';
import { t } from '@/lib/i18n';

export default function MaintenanceHistoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicle, isLoading: vehicleLoading, error: vehicleError } = useVehicle(id);
  const { records, isLoading: recordsLoading, error: recordsError } =
    useMaintenanceRecords(id);

  const isLoading = vehicleLoading || recordsLoading;
  const error = vehicleError ?? recordsError;

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: t('maintenanceHistory') }} />
        <LoadingState />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: t('maintenanceHistory') }} />
        <EmptyState
          title={t('vehicleNotFound')}
          description={error?.message ?? t('vehicleNotFound')}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: t('maintenanceHistory') }} />
      <ThemedScreen>
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <MaintenanceCard
              record={item}
              onPress={() =>
                router.push(`/vehicles/${vehicle.id}/maintenance/${item.id}/edit`)
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title={t('noMaintenanceYet')}
              description={t('noMaintenanceDescription')}
            />
          }
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push(`/vehicles/${vehicle.id}/maintenance/add`)}
          label={t('addMaintenance')}
        />
      </ThemedScreen>
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 88,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
