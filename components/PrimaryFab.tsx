import type { StyleProp, ViewStyle } from 'react-native';
import { FAB, useTheme, type FABProps } from 'react-native-paper';

type PrimaryFabProps = Omit<FABProps, 'color' | 'variant'> & {
  style?: StyleProp<ViewStyle>;
};

export function PrimaryFab({ style, ...props }: PrimaryFabProps) {
  const theme = useTheme();

  return (
    <FAB
      {...props}
      color={theme.colors.onPrimary}
      style={[style, { backgroundColor: theme.colors.primary }]}
    />
  );
}
