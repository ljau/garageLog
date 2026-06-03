import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { ReminderCard } from '@/components/ReminderCard';
import { useReminders } from '@/hooks/useReminders';
import { useVehicle } from '@/hooks/useVehicle';
import { t } from '@/lib/i18n';

export default function RemindersScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicle, isLoading: vehicleLoading, error: vehicleError } = useVehicle(id);
  const { reminders, isLoading: remindersLoading, error: remindersError } =
    useReminders(id);

  const isLoading = vehicleLoading || remindersLoading;
  const error = vehicleError ?? remindersError;

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: t('reminderHistory') }} />
        <LoadingState />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Stack.Screen options={{ title: t('reminderHistory') }} />
        <EmptyState
          title={t('vehicleNotFound')}
          description={error?.message ?? t('vehicleNotFound')}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: t('reminderHistory') }} />
      <ThemedScreen>
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ReminderCard
              reminder={item}
              onPress={() =>
                router.push(`/vehicles/${vehicle.id}/reminders/${item.id}/edit`)
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title={t('noRemindersYet')}
              description={t('noRemindersDescription')}
            />
          }
        />

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push(`/vehicles/${vehicle.id}/reminders/add`)}
          label={t('addReminder')}
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
