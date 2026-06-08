import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { IconCircle, type MciIconName } from '@/components/IconCircle';
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
  const categoryIcon = vehicleCategoryIcon(vehicle.category) as MciIconName;

  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      <Card.Content style={styles.content}>
        <IconCircle
          name={categoryIcon}
          color={theme.colors.primary}
          backgroundColor={theme.colors.primaryContainer}
          size={48}
        />
        <View style={styles.body}>
          <Text variant="titleMedium" numberOfLines={1}>
            {displayName}
          </Text>
          {hasNickname ? (
            <MutedText variant="bodyMedium" numberOfLines={1}>
              {title}
            </MutedText>
          ) : null}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons
                name="speedometer"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <MutedText variant="bodyMedium">
                {formatMileage(vehicle.currentMileage)} {t('mileageUnit')}
              </MutedText>
            </View>
            {vehicle.plateNumber ? (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="card-text-outline"
                  size={16}
                  color={theme.colors.onSurfaceVariant}
                />
                <MutedText variant="bodyMedium">{vehicle.plateNumber}</MutedText>
              </View>
            ) : null}
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
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
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
