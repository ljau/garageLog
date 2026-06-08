import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import type { MciIconName } from '@/components/IconCircle';
import { LabelText } from '@/components/LabelText';

interface DetailInfoRowProps {
  icon: MciIconName;
  label: string;
  value: string;
}

export function DetailInfoRow({ icon, label, value }: DetailInfoRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: theme.colors.surfaceVariant }]}>
        <MaterialCommunityIcons name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={styles.text}>
        <LabelText>{label}</LabelText>
        <Text variant="titleMedium" style={styles.value}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  value: {
    fontWeight: '500',
  },
});
