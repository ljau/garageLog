import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

interface ScreenBottomActionsProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ScreenBottomActions({ children, style }: ScreenBottomActionsProps) {
  return <View style={[styles.actions, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  actions: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
});
