import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, List, Text } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { ThemedScreen } from '@/components/ThemedScreen';
import { LoadingState } from '@/components/LoadingState';
import { MutedText } from '@/components/MutedText';
import { StatCard } from '@/components/StatCard';
import { screenContentContainerStyle } from '@/constants/screen';
import { useExpenseSummary } from '@/hooks/useExpenseSummary';
import { formatCost, formatVehicleTitle } from '@/lib/format';
import { t } from '@/lib/i18n';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function ExpenseSummaryScreen() {
  const router = useRouter();
  const { status, error: dbError } = useDatabase();
  const { summary, byVehicle, isLoading, error } = useExpenseSummary();

  const currentMonthLabel = dayjs().format('MMMM YYYY');
  const currentYearLabel = dayjs().format('YYYY');
  const vehiclesWithExpenses = byVehicle.filter((item) => item.total > 0);
  const hasAnyExpenses = summary.total > 0;

  if (status === 'loading' || (isLoading && !hasAnyExpenses)) {
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
        {t('expenseSummary')}
      </Text>

      <Card style={styles.totalCard} mode="elevated">
        <Card.Content>
          <MutedText variant="labelLarge">{t('totalExpenses')}</MutedText>
          <Text variant="displaySmall" style={styles.totalValue}>
            {formatCost(summary.total)}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.statsRow}>
        <StatCard
          label={t('monthlyExpenses')}
          value={formatCost(summary.monthly)}
        />
        <StatCard label={t('yearlyExpenses')} value={formatCost(summary.yearly)} />
      </View>

      <MutedText variant="bodySmall" style={styles.periodHint}>
        {t('monthlyExpensesPeriod', { period: currentMonthLabel })}
      </MutedText>
      <MutedText variant="bodySmall" style={styles.periodHintYear}>
        {t('yearlyExpensesPeriod', { period: currentYearLabel })}
      </MutedText>

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium">{t('expensesByVehicle')}</Text>
      </View>

      {!hasAnyExpenses ? (
        <EmptyState
          embedded
          title={t('noExpensesYet')}
          description={t('noExpensesDescription')}
        />
      ) : vehiclesWithExpenses.length === 0 ? (
        <MutedText variant="bodyMedium">{t('noVehicleExpenses')}</MutedText>
      ) : (
        <Card mode="outlined">
          {vehiclesWithExpenses.map((item, index) => (
            <View key={item.vehicleId}>
              {index > 0 ? <Divider /> : null}
              <List.Item
                title={item.nickname}
                description={formatVehicleTitle(item.brand, item.model, item.year)}
                onPress={() => router.push(`/vehicles/${item.vehicleId}/maintenance`)}
                right={() => (
                  <View style={styles.listAmount}>
                    <Text variant="titleMedium">{formatCost(item.total)}</Text>
                    <MutedText variant="bodySmall">
                      {t('expenseRecordCount', { count: String(item.recordCount) })}
                    </MutedText>
                  </View>
                )}
              />
            </View>
          ))}
        </Card>
      )}
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
  totalCard: {
    marginBottom: 16,
  },
  totalValue: {
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  periodHint: {
    marginBottom: 2,
  },
  periodHintYear: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  listAmount: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
