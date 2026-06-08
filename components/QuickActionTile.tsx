import { Pressable, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { IconCircle, type MciIconName } from '@/components/IconCircle';

interface QuickActionTileProps {
  icon: MciIconName;
  label: string;
  onPress: () => void;
  accentColor?: string;
}

export function QuickActionTile({
  icon,
  label,
  onPress,
  accentColor,
}: QuickActionTileProps) {
  const theme = useTheme();
  const color = accentColor ?? theme.colors.primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.content}>
          <IconCircle
            name={icon}
            color={color}
            backgroundColor={theme.colors.primaryContainer}
            size={32}
            iconSize={18}
          />
          <Text variant="bodySmall" style={styles.label} numberOfLines={2}>
            {label}
          </Text>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '48%',
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
  },
  label: {
    flex: 1,
  },
});
