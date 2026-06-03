import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import type { ReactNode } from 'react';

import { ThemedRoot } from '@/components/ThemedRoot';
import { darkTheme, lightTheme } from '@/constants/theme';
import { DatabaseProvider } from '@/providers/DatabaseProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <DatabaseProvider>
      <NotificationProvider>
        <PaperProvider
          theme={theme}
          settings={{
            icon: (props) => <MaterialCommunityIcons {...props} />,
          }}>
          <ThemedRoot>{children}</ThemedRoot>
        </PaperProvider>
      </NotificationProvider>
    </DatabaseProvider>
  );
}
