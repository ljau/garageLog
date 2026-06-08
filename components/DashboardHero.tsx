import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { IconCircle } from '@/components/IconCircle';
import { MutedText } from '@/components/MutedText';
import { t } from '@/lib/i18n';

export function DashboardHero() {
  const theme = useTheme();

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content style={styles.content}>
        <IconCircle
          name="garage"
          color={theme.colors.onPrimaryContainer}
          backgroundColor={theme.colors.primary}
          size={52}
          iconSize={28}
        />
        <View style={styles.text}>
          <Text variant="headlineSmall">{t('appName')}</Text>
          <MutedText variant="bodyMedium">{t('dashboardTagline')}</MutedText>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
