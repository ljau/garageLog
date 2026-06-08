import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { ReactNode } from 'react';

import { ThemedRoot } from '@/components/ThemedRoot';
import { darkTheme, lightTheme } from '@/constants/theme';
import { useVehicleCatalogWarmup } from '@/hooks/useVehicleCatalogWarmup';
import { DatabaseProvider } from '@/providers/DatabaseProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';

function VehicleCatalogWarmup() {
  useVehicleCatalogWarmup();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <VehicleCatalogWarmup />
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
    </SafeAreaProvider>
  );
}
