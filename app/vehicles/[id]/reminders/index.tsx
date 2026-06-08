import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { PrimaryFab } from '@/components/PrimaryFab';
import { ThemedScreen } from '@/components/ThemedScreen';
import { EmptyState } from '@/components/EmptyState';
import { LoadingState } from '@/components/LoadingState';
import { ReminderCard } from '@/components/ReminderCard';
import { AddReminderSheet } from '@/components/sheets/AddReminderSheet';
import { useFabLayout } from '@/hooks/useFabLayout';
import { useFormSheet } from '@/hooks/useFormSheet';
import { useReminders } from '@/hooks/useReminders';
import { useVehicle } from '@/hooks/useVehicle';
import { t } from '@/lib/i18n';
import { useAppNavigation } from '@/lib/navigation';

export default function RemindersScreen() {
  const { navigateTo } = useAppNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vehicle, isLoading: vehicleLoading, error: vehicleError } = useVehicle(id);
  const { reminders, isLoading: remindersLoading, error: remindersError, reload } =
    useReminders(id);
  const addReminderSheet = useFormSheet();
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
                navigateTo(`/vehicles/${vehicle.id}/reminders/${item.id}/edit`)
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              embedded
              title={t('noRemindersYet')}
              description={t('noRemindersDescription')}
              icon="bell-outline"
            />
          }
        />

        <PrimaryFab
          icon="plus"
          style={fabStyle}
          onPress={addReminderSheet.open}
          label={t('addReminder')}
        />

        <AddReminderSheet
          visible={addReminderSheet.visible}
          formKey={addReminderSheet.formKey}
          vehicleId={vehicle.id}
          onDismiss={addReminderSheet.close}
          onSaved={() => void reload()}
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
