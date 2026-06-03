import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { MutedText } from '@/components/MutedText';
import { ThemedScreen } from '@/components/ThemedScreen';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <ThemedScreen style={styles.container}>
      <Text variant="titleMedium">{title}</Text>
      <MutedText variant="bodyMedium" style={styles.description}>
        {description}
      </MutedText>
      {actionLabel && onAction ? (
        <Button mode="contained" onPress={onAction} style={styles.button}>
          {actionLabel}
        </Button>
      ) : null}
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
  description: {
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
});
