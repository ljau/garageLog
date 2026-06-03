import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { MutedText } from '@/components/MutedText';
import { ThemedScreen } from '@/components/ThemedScreen';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /** When true, omits safe-area wrapper (parent screen already applies insets). */
  embedded?: boolean;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  embedded = false,
}: EmptyStateProps) {
  const Wrapper = embedded ? View : ThemedScreen;

  return (
    <Wrapper style={styles.container}>
      <Text variant="titleMedium">{title}</Text>
      <MutedText variant="bodyMedium" style={styles.description}>
        {description}
      </MutedText>
      {actionLabel && onAction ? (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      ) : null}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});
