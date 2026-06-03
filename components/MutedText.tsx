import { Text, useTheme, type TextProps } from 'react-native-paper';

type MutedTextProps = TextProps<string>;

export function MutedText({ style, ...props }: MutedTextProps) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      style={[{ color: theme.colors.onSurfaceVariant }, style]}
    />
  );
}
