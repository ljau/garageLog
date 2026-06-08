import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { IconCircle, type MciIconName } from '@/components/IconCircle';

interface InfoHintProps {
  icon: MciIconName;
  text: string;
}

export function InfoHint({ icon, text }: InfoHintProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <IconCircle
        name={icon}
        color={theme.colors.primary}
        backgroundColor={theme.colors.primaryContainer}
        size={48}
        iconSize={24}
      />
      <Text variant="titleSmall" style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    flex: 1,
  },
});
