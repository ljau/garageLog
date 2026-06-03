import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { ReactNode } from 'react';

export function ThemedRoot({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
