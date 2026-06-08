import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { PrimaryFab } from '@/components/PrimaryFab';
import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { MaintenanceCard } from '@/components/MaintenanceCard';
import { useFabLayout } from '@/hooks/useFabLayout';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useVehicle } from '@/hooks/useVehicle';
import { t } from '@/lib/i18n';

export default function MaintenanceHistoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicle, isLoading: vehicleLoading, error: vehicleError } = useVehicle(id);
  const { records, isLoading: recordsLoading, error: recordsError } =
    useMaintenanceRecords(id);
  const { fabStyle, listPaddingBottom } = useFabLayout();

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
      <ThemedScreen edges={['left', 'right']}>
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: listPaddingBottom },
          ]}
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
              embedded
              title={t('noMaintenanceYet')}
              description={t('noMaintenanceDescription')}
              icon="wrench-outline"
            />
          }
        />

        <PrimaryFab
          icon="plus"
          style={fabStyle}
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
    flexGrow: 1,
  },
});
