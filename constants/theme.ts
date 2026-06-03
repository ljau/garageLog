import {
  MD3DarkTheme,
  MD3LightTheme,
  configureFonts,
  type MD3Theme,
} from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
} as const;

const sharedColors = {
  primary: '#1565C0',
  secondary: '#455A64',
  tertiary: '#00897B',
} as const;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...sharedColors,
    onSurfaceVariant: '#424242',
    outline: '#616161',
    primaryContainer: '#BBDEFB',
    secondaryContainer: '#CFD8DC',
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...sharedColors,
    onSurfaceVariant: '#E8E8E8',
    outline: '#BDBDBD',
    primary: '#90CAF9',
    primaryContainer: '#0D47A1',
    secondaryContainer: '#37474F',
  },
  fonts: configureFonts({ config: fontConfig }),
};
