import { useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { PrimaryFab } from '@/components/PrimaryFab';
import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { VehicleCard } from '@/components/VehicleCard';
import { useFabLayout } from '@/hooks/useFabLayout';
import { useVehicles } from '@/hooks/useVehicles';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function VehiclesScreen() {
  const router = useRouter();
  const { status } = useDatabase();
  const { vehicles, isLoading, error } = useVehicles();
  const { fabStyle, listPaddingBottom } = useFabLayout({ aboveTabBar: true });

  if (status === 'loading' || isLoading) {
    return <LoadingState />;
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
    <ThemedScreen edges={['left', 'right']}>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          vehicles.length === 0
            ? styles.emptyList
            : [styles.list, { paddingBottom: listPaddingBottom }]
        }
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item}
            onPress={() => router.push(`/vehicles/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            embedded
            title={t('noVehiclesYet')}
            description={t('noVehiclesDescription')}
            icon="car-outline"
          />
        }
      />
      <PrimaryFab
        icon="plus"
        style={fabStyle}
        onPress={() => router.push('/vehicles/add')}
        label={t('addVehicle')}
      />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
});
