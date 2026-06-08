import { useRouter } from 'expo-router';
import { IconButton, useTheme } from 'react-native-paper';

export function AppHeaderBack() {
  const router = useRouter();
  const theme = useTheme();

  if (!router.canGoBack()) {
    return null;
  }

  return (
    <IconButton
      icon="arrow-left"
      size={24}
      iconColor={theme.colors.onSurface}
      onPress={() => router.back()}
    />
  );
}
