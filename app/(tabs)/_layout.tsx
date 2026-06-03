import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

import { getTabScreenOptions } from '@/constants/screen';
import { t } from '@/lib/i18n';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        ...getTabScreenOptions(theme),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: t('vehicles'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="car-multiple" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
