import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { PrimaryFab } from '@/components/PrimaryFab';
import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { ReminderCard } from '@/components/ReminderCard';
import { useFabLayout } from '@/hooks/useFabLayout';
import { useReminders } from '@/hooks/useReminders';
import { useVehicle } from '@/hooks/useVehicle';
import { t } from '@/lib/i18n';

export default function RemindersScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicle, isLoading: vehicleLoading, error: vehicleError } = useVehicle(id);
  const { reminders, isLoading: remindersLoading, error: remindersError } =
    useReminders(id);
  const { fabStyle, listPaddingBottom } = useFabLayout();

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
      <ThemedScreen edges={['left', 'right']}>
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: listPaddingBottom },
          ]}
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
              embedded
              title={t('noRemindersYet')}
              description={t('noRemindersDescription')}
            />
          }
        />

        <PrimaryFab
          icon="plus"
          style={fabStyle}
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
    flexGrow: 1,
  },
});
