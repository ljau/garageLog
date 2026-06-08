import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';

import { IconCircle, type MciIconName } from '@/components/IconCircle';
import { MutedText } from '@/components/MutedText';
import { ThemedScreen } from '@/components/ThemedScreen';
import { featureCardContentStyle } from '@/constants/card';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: MciIconName;
  /** When true, omits safe-area wrapper (parent screen already applies insets). */
  embedded?: boolean;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'inbox-outline',
  embedded = false,
}: EmptyStateProps) {
  const theme = useTheme();

  const content = (
    <>
      <IconCircle
        name={icon}
        color={theme.colors.primary}
        backgroundColor={theme.colors.primaryContainer}
        size={embedded ? 48 : 72}
        iconSize={embedded ? 24 : 36}
      />
      <Text
        variant={embedded ? 'titleSmall' : 'titleMedium'}
        style={embedded ? [featureCardContentStyle.centeredText, styles.embeddedTitle] : styles.title}>
        {title}
      </Text>
      {description ? (
        <MutedText
          variant="bodyMedium"
          style={embedded ? featureCardContentStyle.centeredText : styles.description}>
          {description}
        </MutedText>
      ) : null}
      {actionLabel && onAction ? (
        <Button mode="contained" icon="plus" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      ) : null}
    </>
  );

  if (embedded) {
    return (
      <Card mode="elevated" style={styles.embeddedCard}>
        <Card.Content style={featureCardContentStyle.content}>{content}</Card.Content>
      </Card>
    );
  }

  return <ThemedScreen style={styles.container}>{content}</ThemedScreen>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
  embeddedCard: {
    marginBottom: 4,
  },
  embeddedTitle: {
    fontWeight: '600',
  },
});
