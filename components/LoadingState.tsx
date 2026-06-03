import { StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';
import { t } from '@/lib/i18n';

export function LoadingState() {
  return (
    <ThemedScreen style={styles.container}>
      <ActivityIndicator animating size="large" />
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
  text: {
    marginTop: 16,
  },
});
