import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

import { getStackScreenOptions } from '@/constants/screen';

export function StackNavigator() {
  const theme = useTheme();

  return (
    <Stack screenOptions={getStackScreenOptions(theme)}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="vehicles/add"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="vehicles/[id]" />
      <Stack.Screen
        name="vehicles/[id]/edit"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name="vehicles/[id]/maintenance/index" />
      <Stack.Screen
        name="vehicles/[id]/maintenance/add"
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="vehicles/[id]/maintenance/[recordId]/edit"
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
