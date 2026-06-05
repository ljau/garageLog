import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getTabScreenOptions, TAB_BAR_HEIGHT } from '@/constants/screen';
import { t } from '@/lib/i18n';

export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabOptions = getTabScreenOptions(theme);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        ...tabOptions,
        tabBarStyle: {
          ...tabOptions.tabBarStyle,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom,
        },
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
        name="expenses"
        options={{
          title: t('expenseSummary'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="currency-usd" color={color} size={size} />
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
