import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import type { MciIconName } from '@/components/IconCircle';

interface SectionHeaderProps {
  title: string;
  icon?: MciIconName;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  icon,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={22}
            color={theme.colors.primary}
            style={styles.icon}
          />
        ) : null}
        <Text variant="titleLarge" style={styles.title}>
          {title}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <Button compact icon="chevron-right" contentStyle={styles.actionContent} onPress={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontWeight: '600',
  },
  actionContent: {
    flexDirection: 'row-reverse',
  },
});
