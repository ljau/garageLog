import { Text, useTheme, type TextProps } from 'react-native-paper';

type LabelTextProps = TextProps<string>;

export function LabelText({ style, ...props }: LabelTextProps) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      variant="labelLarge"
      style={[{ color: theme.colors.onSurfaceVariant }, style]}
    />
  );
}
