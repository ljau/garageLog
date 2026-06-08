import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import { IconCircle, type MciIconName } from '@/components/IconCircle';
import { LabelText } from '@/components/LabelText';
import { featureCardContentStyle } from '@/constants/card';

interface StatCardProps {
  label: string;
  value: string;
  icon?: MciIconName;
  accentColor?: string;
  onPress?: () => void;
}

export function StatCard({ label, value, icon, accentColor, onPress }: StatCardProps) {
  const theme = useTheme();
  const color = accentColor ?? theme.colors.primary;

  return (
    <Card style={styles.card} mode="elevated" onPress={onPress}>
      <Card.Content style={featureCardContentStyle.content}>
        {icon ? (
          <IconCircle
            name={icon}
            color={color}
            backgroundColor={theme.colors.primaryContainer}
            size={48}
            iconSize={24}
          />
        ) : null}
        <LabelText style={featureCardContentStyle.centeredText}>{label}</LabelText>
        <Text variant="headlineLarge" style={[featureCardContentStyle.centeredText, styles.value]}>
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
  },
  value: {
    fontWeight: '700',
  },
});
