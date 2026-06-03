import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { ThemedScreen } from '@/components/ThemedScreen';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <ThemedScreen style={styles.container}>
        <Text variant="titleLarge">This screen does not exist.</Text>
        <Link href="/" asChild>
          <Button mode="contained" style={styles.button}>
            Go to dashboard
          </Button>
        </Link>
      </ThemedScreen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  button: {
    marginTop: 24,
  },
});
