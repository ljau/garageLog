import { useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { VehicleCard } from '@/components/VehicleCard';
import { useVehicles } from '@/hooks/useVehicles';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function VehiclesScreen() {
  const router = useRouter();
  const { status } = useDatabase();
  const { vehicles, isLoading, error } = useVehicles();

  if (status === 'loading' || isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <EmptyState title={t('databaseError')} description={error.message} />;
  }

  return (
    <ThemedScreen>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          vehicles.length === 0 ? styles.emptyList : styles.list
        }
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={() => router.push(`/vehicles/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title={t('noVehiclesYet')}
            description={t('noVehiclesDescription')}
            actionLabel={t('addVehicle')}
            onAction={() => router.push('/vehicles/add')}
          />
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/vehicles/add')}
        label={t('addVehicle')}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 88,
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
