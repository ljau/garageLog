import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { MutedText } from '@/components/MutedText';

import { formatMileage, formatVehicleDisplayName, formatVehicleTitle } from '@/lib/format';
import { t } from '@/lib/i18n';
import { vehicleCategoryIcon } from '@/lib/vehicles';
import type { Vehicle } from '@/models/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
}

export function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  const theme = useTheme();
  const title = formatVehicleTitle(vehicle.brand, vehicle.model, vehicle.year);
  const displayName = formatVehicleDisplayName(vehicle);
  const hasNickname = !!vehicle.nickname?.trim();
  const categoryIcon = vehicleCategoryIcon(
    vehicle.category,
  ) as keyof typeof MaterialCommunityIcons.glyphMap;

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons
            name={categoryIcon}
            size={22}
            color={theme.colors.primary}
          />
          <Text variant="titleMedium" style={styles.title}>
            {displayName}
          </Text>
        </View>
        {hasNickname ? (
          <MutedText variant="bodyMedium" style={styles.subtitle}>
            {title}
          </MutedText>
        ) : null}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
    flexShrink: 1,
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
