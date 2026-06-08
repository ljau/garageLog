import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { IconCircle } from '@/components/IconCircle';
import { MutedText } from '@/components/MutedText';

import { formatCost, formatDate, formatMileage } from '@/lib/format';
import { t } from '@/lib/i18n';
import { maintenanceTypeIcon } from '@/lib/maintenance';
import type { MaintenanceRecord } from '@/models/maintenanceRecord';

interface MaintenanceCardProps {
  record: MaintenanceRecord;
  onPress?: () => void;
}

export function MaintenanceCard({ record, onPress }: MaintenanceCardProps) {
  const theme = useTheme();
  const icon = maintenanceTypeIcon(record.type);

  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      <Card.Content style={styles.content}>
        <IconCircle
          name={icon}
          color={theme.colors.primary}
          backgroundColor={theme.colors.primaryContainer}
          size={44}
          iconSize={22}
        />
        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text variant="titleMedium" style={styles.title} numberOfLines={1}>
              {record.type}
            </Text>
            <MutedText variant="bodyMedium">{formatDate(record.serviceDate)}</MutedText>
          </View>
          <MutedText variant="bodyMedium" numberOfLines={2}>
            {record.description}
          </MutedText>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="speedometer"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <MutedText variant="bodyMedium">
                {formatMileage(record.mileage)} {t('mileageUnit')}
              </MutedText>
            </View>
            {record.cost != null ? (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
                <MutedText variant="bodyMedium">{formatCost(record.cost)}</MutedText>
              </View>
            ) : null}
          </View>
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
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
