import { StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

import { IconCircle } from '@/components/IconCircle';
import { ThemedScreen } from '@/components/ThemedScreen';
import { t } from '@/lib/i18n';

export function LoadingState() {
  const theme = useTheme();

  return (
    <ThemedScreen style={styles.container}>
      <IconCircle
        name="garage"
        color={theme.colors.primary}
        backgroundColor={theme.colors.primaryContainer}
        size={64}
        iconSize={32}
      />
      <ActivityIndicator animating size="large" style={styles.spinner} />
      <Text variant="bodyLarge" style={styles.text}>
        {t('loading')}
      </Text>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  spinner: {
    marginTop: 20,
  },
  text: {
    marginTop: 12,
  },
});
