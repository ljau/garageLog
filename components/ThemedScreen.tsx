import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { ReactNode } from 'react';

interface ThemedScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ThemedScreen({ children, style }: ThemedScreenProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
