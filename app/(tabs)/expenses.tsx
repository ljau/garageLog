import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { EmptyState } from '@/components/EmptyState';
import { IconCircle } from '@/components/IconCircle';
import { InfoHint } from '@/components/InfoHint';
import { SectionHeader } from '@/components/SectionHeader';
import { ThemedScreen } from '@/components/ThemedScreen';
import { LoadingState } from '@/components/LoadingState';
import { LabelText } from '@/components/LabelText';
import { MutedText } from '@/components/MutedText';
import { StatCard } from '@/components/StatCard';
import { screenContentContainerStyle } from '@/constants/screen';
import { useExpenseSummary } from '@/hooks/useExpenseSummary';
import { formatCost, formatVehicleDisplayName, formatVehicleTitle } from '@/lib/format';
import { t } from '@/lib/i18n';
import { useAppNavigation } from '@/lib/navigation';
import { useDatabase } from '@/providers/DatabaseProvider';

export default function ExpenseSummaryScreen() {
  const { navigateTo } = useAppNavigation();
  const theme = useTheme();
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
        icon="database-alert"
      />
    );
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
    <ThemedScreen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={screenContentContainerStyle}>
        <Card style={styles.totalCard} mode="elevated">
          <Card.Content style={styles.totalContent}>
            <IconCircle
              name="wallet-outline"
              color={theme.colors.primary}
              backgroundColor={theme.colors.primaryContainer}
              size={64}
              iconSize={32}
            />
            <View style={styles.totalText}>
              <LabelText>{t('totalExpenses')}</LabelText>
              <Text variant="displaySmall" style={styles.totalValue}>
                {formatCost(summary.total)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.statsRow}>
          <StatCard
            label={t('monthlyExpenses')}
            value={formatCost(summary.monthly)}
            icon="calendar-month"
          />
          <StatCard
            label={t('yearlyExpenses')}
            value={formatCost(summary.yearly)}
            icon="calendar-range"
          />
        </View>

        <Card mode="outlined" style={styles.periodCard}>
          <Card.Content style={styles.periodContent}>
            <InfoHint
              icon="calendar-month"
              text={t('monthlyExpensesPeriod', { period: currentMonthLabel })}
            />
            <InfoHint
              icon="calendar-range"
              text={t('yearlyExpensesPeriod', { period: currentYearLabel })}
            />
          </Card.Content>
        </Card>

        <SectionHeader title={t('expensesByVehicle')} icon="car-multiple" />

        {!hasAnyExpenses ? (
          <EmptyState embedded title={t('noExpensesYet')} icon="cash-remove" />
        ) : vehiclesWithExpenses.length === 0 ? (
          <MutedText variant="bodyMedium">{t('noVehicleExpenses')}</MutedText>
        ) : (
          <View style={styles.vehicleList}>
            {vehiclesWithExpenses.map((item) => (
              <Card
                key={item.vehicleId}
                style={styles.vehicleRow}
                onPress={() => navigateTo(`/vehicles/${item.vehicleId}/maintenance`)}
                mode="elevated">
                <Card.Content style={styles.vehicleRowContent}>
                  <IconCircle
                    name="car"
                    color={theme.colors.primary}
                    backgroundColor={theme.colors.primaryContainer}
                    size={40}
                  />
                  <View style={styles.vehicleInfo}>
                    <Text variant="titleMedium" numberOfLines={1}>
                      {formatVehicleDisplayName(item)}
                    </Text>
                    {item.nickname?.trim() ? (
                      <MutedText variant="bodyMedium" numberOfLines={1}>
                        {formatVehicleTitle(item.brand, item.model, item.year)}
                      </MutedText>
                    ) : null}
                    <MutedText variant="bodyMedium">
                      {t('expenseRecordCount', { count: String(item.recordCount) })}
                    </MutedText>
                  </View>
                  <View style={styles.listAmount}>
                    <Text variant="titleMedium">{formatCost(item.total)}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={theme.colors.onSurfaceVariant}
                  />
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  totalCard: {
    marginBottom: 16,
  },
  totalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  totalText: {
    flex: 1,
  },
  totalValue: {
    marginTop: 4,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  periodCard: {
    marginBottom: 24,
  },
  periodContent: {
    gap: 12,
  },
  vehicleList: {
    gap: 8,
  },
  vehicleRow: {
    marginBottom: 0,
  },
  vehicleRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  vehicleInfo: {
    flex: 1,
    gap: 2,
  },
  listAmount: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
