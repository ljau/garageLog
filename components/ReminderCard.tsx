import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { IconCircle, type MciIconName } from '@/components/IconCircle';
import { MutedText } from '@/components/MutedText';
import { formatDateTime } from '@/lib/format';
import { t } from '@/lib/i18n';
import { reminderTypeIcon, reminderTypeLabel } from '@/lib/reminders';
import type { Reminder } from '@/models/reminder';

interface ReminderCardProps {
  reminder: Reminder;
  onPress?: () => void;
}

export function ReminderCard({ reminder, onPress }: ReminderCardProps) {
  const theme = useTheme();
  const isPast = dayjs(reminder.scheduledAt).isBefore(dayjs());
  const icon = reminderTypeIcon(reminder.type) as MciIconName;
  const accentColor = isPast ? theme.colors.error : theme.colors.primary;
  const accentBg = isPast ? theme.colors.errorContainer : theme.colors.primaryContainer;

  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      <Card.Content style={styles.content}>
        <IconCircle name={icon} color={accentColor} backgroundColor={accentBg} size={44} />
        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
              {reminderTypeLabel(reminder.type)}
            </Text>
            <MutedText variant="bodyMedium">{formatDateTime(reminder.scheduledAt)}</MutedText>
          </View>
          {isPast ? (
            <View style={styles.pastBadge}>
              <MaterialCommunityIcons name="alert-circle" size={16} color={theme.colors.error} />
              <MutedText variant="bodyMedium" style={{ color: theme.colors.error }}>
                {t('reminderPastDue')}
              </MutedText>
            </View>
          ) : null}
          {reminder.notes ? (
            <MutedText variant="bodyMedium" numberOfLines={2}>
              {reminder.notes}
            </MutedText>
          ) : null}
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
  },
  pastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
