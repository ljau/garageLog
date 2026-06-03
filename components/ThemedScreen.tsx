import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import {
  SafeAreaView,
  type Edge,
} from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

const defaultEdges: Edge[] = ['bottom', 'left', 'right'];

interface ThemedScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** System safe-area edges to pad. Defaults to bottom and sides (stack/tab headers handle the top). */
  edges?: Edge[];
}

export function ThemedScreen({
  children,
  style,
  edges = defaultEdges,
}: ThemedScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background },
        style,
      ]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
