import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

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

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <MaterialCommunityIcons
              name={reminderTypeIcon(reminder.type) as keyof typeof MaterialCommunityIcons.glyphMap}
              size={22}
              color={theme.colors.primary}
            />
            <Text variant="titleMedium" style={styles.title}>
              {reminderTypeLabel(reminder.type)}
            </Text>
          </View>
          <MutedText variant="bodySmall">{formatDateTime(reminder.scheduledAt)}</MutedText>
        </View>
        {isPast ? (
          <MutedText variant="bodySmall" style={styles.past}>
            {t('reminderPastDue')}
          </MutedText>
        ) : null}
        {reminder.notes ? (
          <MutedText variant="bodyMedium" style={styles.notes}>
            {reminder.notes}
          </MutedText>
        ) : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginLeft: 8,
    flexShrink: 1,
  },
  past: {
    marginTop: 8,
    color: '#B00020',
  },
  notes: {
    marginTop: 8,
  },
});
