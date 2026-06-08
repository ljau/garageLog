import { FlatList, StyleSheet } from 'react-native';
import { PrimaryFab } from '@/components/PrimaryFab';
import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { AddVehicleSheet } from '@/components/sheets/AddVehicleSheet';
import { VehicleCard } from '@/components/VehicleCard';
import { useFabLayout } from '@/hooks/useFabLayout';
import { useFormSheet } from '@/hooks/useFormSheet';
import { useVehicles } from '@/hooks/useVehicles';
import { t } from '@/lib/i18n';
import { useAppNavigation } from '@/lib/navigation';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function VehiclesScreen() {
  const { navigateTo } = useAppNavigation();
  const addVehicleSheet = useFormSheet();
  const { status } = useDatabase();
  const { vehicles, isLoading, error, reload } = useVehicles();
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
            onPress={() => navigateTo(`/vehicles/${item.id}`)}
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
        onPress={addVehicleSheet.open}
        label={t('addVehicle')}
      />

      <AddVehicleSheet
        visible={addVehicleSheet.visible}
        formKey={addVehicleSheet.formKey}
        onDismiss={addVehicleSheet.close}
        onSaved={() => void reload()}
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
