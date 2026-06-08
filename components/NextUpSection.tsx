import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { IconCircle, type MciIconName } from '@/components/IconCircle';
import { LabelText } from '@/components/LabelText';
import { MutedText } from '@/components/MutedText';
import { featureCardContentStyle } from '@/constants/card';
import type { DashboardReminder } from '@/database/reminderRepository';
import { t } from '@/lib/i18n';
import {
  formatReminderDueStatus,
  reminderTypeIcon,
  reminderTypeLabel,
} from '@/lib/reminders';

interface NextUpSummaryCardProps {
  reminders: DashboardReminder[];
  style?: StyleProp<ViewStyle>;
}

interface NextUpSectionProps {
  reminders: DashboardReminder[];
  onReminderPress: (reminder: DashboardReminder) => void;
}

export function NextUpSummaryCard({ reminders, style }: NextUpSummaryCardProps) {
  const theme = useTheme();
  const hasReminders = reminders.length > 0;

  return (
    <Card style={[styles.summaryCard, style]} mode="elevated">
      <Card.Content style={featureCardContentStyle.content}>
        <IconCircle
          name={hasReminders ? 'bell-outline' : 'bell-check-outline'}
          color={theme.colors.primary}
          backgroundColor={theme.colors.primaryContainer}
          size={48}
          iconSize={24}
        />
        <LabelText style={featureCardContentStyle.centeredText}>{t('nextUp')}</LabelText>
        <Text
          variant={hasReminders ? 'headlineLarge' : 'titleSmall'}
          style={[
            featureCardContentStyle.centeredText,
            hasReminders ? styles.summaryValue : styles.summaryEmpty,
          ]}
          numberOfLines={2}>
          {hasReminders ? String(reminders.length) : t('noUpcomingReminders')}
        </Text>
      </Card.Content>
    </Card>
  );
}

function NextUpItem({
  reminder,
  onPress,
}: {
  reminder: DashboardReminder;
  onPress: () => void;
}) {
  const theme = useTheme();
  const dueStatus = formatReminderDueStatus(reminder.scheduledAt);
  const icon = reminderTypeIcon(reminder.type) as MciIconName;
  const accentColor = dueStatus.isOverdue ? theme.colors.error : theme.colors.primary;
  const accentBg = dueStatus.isOverdue
    ? theme.colors.errorContainer
    : theme.colors.primaryContainer;

  return (
    <Card style={styles.item} onPress={onPress} mode="elevated">
      <Card.Content style={styles.itemContent}>
        <IconCircle name={icon} color={accentColor} backgroundColor={accentBg} size={40} />
        <View style={styles.itemText}>
          <Text variant="bodyLarge">{reminderTypeLabel(reminder.type)}</Text>
          <MutedText variant="bodyMedium">{reminder.vehicleName}</MutedText>
        </View>
        <View
          style={[
            styles.dueBadge,
            {
              backgroundColor: dueStatus.isOverdue
                ? theme.colors.errorContainer
                : theme.colors.secondaryContainer,
            },
          ]}>
          <Text
            variant="labelLarge"
            style={[styles.dueLabel, dueStatus.isOverdue ? { color: theme.colors.error } : null]}>
            {dueStatus.label}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={theme.colors.onSurfaceVariant}
        />
      </Card.Content>
    </Card>
  );
}

export function NextUpSection({ reminders, onReminderPress }: NextUpSectionProps) {
  if (reminders.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      {reminders.map((reminder) => (
        <NextUpItem
          key={reminder.id}
          reminder={reminder}
          onPress={() => onReminderPress(reminder)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  item: {
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemText: {
    flex: 1,
  },
  dueBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dueLabel: {
    textTransform: 'lowercase',
  },
  summaryCard: {
    flex: 1,
    minWidth: 140,
  },
  summaryValue: {
    fontWeight: '700',
  },
  summaryEmpty: {
    fontWeight: '600',
  },
});
