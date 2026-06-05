import type { MD3Theme } from 'react-native-paper';
import type { ViewStyle } from 'react-native';

export const TAB_BAR_HEIGHT = 56;
export const FAB_MARGIN = 16;
export const FAB_HEIGHT = 56;

export const screenContentContainerStyle: ViewStyle = {
  padding: 16,
  paddingBottom: 32,
};

export const screenScrollContentStyle: ViewStyle = {
  padding: 16,
};

export function getHeaderScreenOptions(theme: MD3Theme) {
  return {
    headerStyle: { backgroundColor: theme.colors.elevation.level2 },
    headerTintColor: theme.colors.onSurface,
    headerTitleStyle: { color: theme.colors.onSurface },
    headerShadowVisible: false,
  } as const;
}

export function getStackScreenOptions(theme: MD3Theme) {
  return {
    ...getHeaderScreenOptions(theme),
    contentStyle: { backgroundColor: theme.colors.background },
  };
}

export function getTabScreenOptions(theme: MD3Theme) {
  return {
    ...getHeaderScreenOptions(theme),
    sceneStyle: { backgroundColor: theme.colors.background },
    tabBarStyle: { backgroundColor: theme.colors.elevation.level2 },
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
  };
}
