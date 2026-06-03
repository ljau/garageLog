import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { MutedText } from '@/components/MutedText';

import { formatCost, formatDate, formatMileage } from '@/lib/format';
import { t } from '@/lib/i18n';
import type { MaintenanceRecord } from '@/models/maintenanceRecord';

interface MaintenanceCardProps {
  record: MaintenanceRecord;
  onPress?: () => void;
}

export function MaintenanceCard({ record, onPress }: MaintenanceCardProps) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text variant="titleMedium">{record.type}</Text>
          <MutedText variant="bodySmall">{formatDate(record.serviceDate)}</MutedText>
        </View>
        <MutedText variant="bodyMedium" style={styles.description}>
          {record.description}
        </MutedText>
        <View style={styles.metaRow}>
          <MutedText variant="bodySmall">
            {formatMileage(record.mileage)} {t('mileageUnit')}
          </MutedText>
          {record.cost != null ? (
            <MutedText variant="bodySmall">{formatCost(record.cost)}</MutedText>
          ) : null}
        </View>
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
    alignItems: 'center',
  },
  description: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
