import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { MutedText } from '@/components/MutedText';
import type { DashboardReminder } from '@/database/reminderRepository';
import { t } from '@/lib/i18n';
import {
  formatReminderDueStatus,
  reminderTypeIcon,
  reminderTypeLabel,
} from '@/lib/reminders';

interface NextUpSectionProps {
  reminders: DashboardReminder[];
  onReminderPress: (reminder: DashboardReminder) => void;
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

  return (
    <Card style={styles.item} onPress={onPress}>
      <Card.Content style={styles.itemContent}>
        <View style={styles.itemLeft}>
          <MaterialCommunityIcons
            name={reminderTypeIcon(reminder.type) as keyof typeof MaterialCommunityIcons.glyphMap}
            size={20}
            color={dueStatus.isOverdue ? theme.colors.error : theme.colors.primary}
          />
          <View style={styles.itemText}>
            <Text variant="bodyLarge">{reminderTypeLabel(reminder.type)}</Text>
            <MutedText variant="bodySmall">{reminder.vehicleName}</MutedText>
          </View>
        </View>
        <Text
          variant="labelLarge"
          style={[
            styles.dueLabel,
            dueStatus.isOverdue ? { color: theme.colors.error } : null,
          ]}>
          {dueStatus.label}
        </Text>
      </Card.Content>
    </Card>
  );
}

export function NextUpSection({ reminders, onReminderPress }: NextUpSectionProps) {
  return (
    <View style={styles.section}>
      <Text variant="titleMedium" style={styles.heading}>
        {t('nextUp')}
      </Text>

      {reminders.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text variant="bodyLarge">{t('noUpcomingReminders')}</Text>
            <MutedText variant="bodyMedium" style={styles.emptyDescription}>
              {t('noUpcomingRemindersDescription')}
            </MutedText>
          </Card.Content>
        </Card>
      ) : (
        reminders.map((reminder) => (
          <NextUpItem
            key={reminder.id}
            reminder={reminder}
            onPress={() => onReminderPress(reminder)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  heading: {
    marginBottom: 12,
  },
  item: {
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  itemText: {
    flex: 1,
  },
  dueLabel: {
    textTransform: 'lowercase',
  },
  emptyCard: {
    marginBottom: 4,
  },
  emptyDescription: {
    marginTop: 4,
  },
});
