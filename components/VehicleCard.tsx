import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { MutedText } from '@/components/MutedText';

import { formatMileage, formatVehicleTitle } from '@/lib/format';
import { t } from '@/lib/i18n';
import type { Vehicle } from '@/models/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
}

export function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  const title = formatVehicleTitle(vehicle.brand, vehicle.model, vehicle.year);

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Text variant="titleMedium">{vehicle.nickname}</Text>
        <MutedText variant="bodyMedium" style={styles.subtitle}>
          {title}
        </MutedText>
        <View style={styles.metaRow}>
          <MutedText variant="bodySmall">
            {formatMileage(vehicle.currentMileage)} {t('mileageUnit')}
          </MutedText>
          {vehicle.plateNumber ? (
            <MutedText variant="bodySmall">{vehicle.plateNumber}</MutedText>
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
  subtitle: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
