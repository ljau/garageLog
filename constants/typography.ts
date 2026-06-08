import type { MD3TypescaleKey } from 'react-native-paper/lib/typescript/types';

const fontFamily = 'System';

type FontStyle = {
  fontFamily: string;
  fontSize: number;
  fontWeight: '400' | '500' | '600' | '700';
  letterSpacing: number;
  lineHeight: number;
};

function font(style: Omit<FontStyle, 'fontFamily'>): FontStyle {
  return { fontFamily, ...style };
}

/** Slightly larger, bolder small text for easier reading on mobile. */
export const appFontConfig: Record<MD3TypescaleKey, FontStyle> = {
  displayLarge: font({ fontSize: 57, lineHeight: 64, fontWeight: '400', letterSpacing: -0.25 }),
  displayMedium: font({ fontSize: 45, lineHeight: 52, fontWeight: '400', letterSpacing: 0 }),
  displaySmall: font({ fontSize: 36, lineHeight: 44, fontWeight: '400', letterSpacing: 0 }),
  headlineLarge: font({ fontSize: 32, lineHeight: 40, fontWeight: '400', letterSpacing: 0 }),
  headlineMedium: font({ fontSize: 28, lineHeight: 36, fontWeight: '400', letterSpacing: 0 }),
  headlineSmall: font({ fontSize: 24, lineHeight: 32, fontWeight: '400', letterSpacing: 0 }),
  titleLarge: font({ fontSize: 22, lineHeight: 28, fontWeight: '500', letterSpacing: 0 }),
  titleMedium: font({ fontSize: 16, lineHeight: 24, fontWeight: '500', letterSpacing: 0.15 }),
  titleSmall: font({ fontSize: 15, lineHeight: 22, fontWeight: '600', letterSpacing: 0.1 }),
  labelLarge: font({ fontSize: 16, lineHeight: 22, fontWeight: '600', letterSpacing: 0.1 }),
  labelMedium: font({ fontSize: 14, lineHeight: 20, fontWeight: '600', letterSpacing: 0.15 }),
  labelSmall: font({ fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: 0.2 }),
  bodyLarge: font({ fontSize: 17, lineHeight: 26, fontWeight: '400', letterSpacing: 0.15 }),
  bodyMedium: font({ fontSize: 15, lineHeight: 22, fontWeight: '400', letterSpacing: 0.25 }),
  bodySmall: font({ fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0.2 }),
};
