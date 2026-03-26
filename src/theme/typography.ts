import { Platform } from 'react-native';

export const FontFamily = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
})!;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Pre-computed text style presets (lineHeight in px for React Native)
export const Typography = {
  displayLarge: { fontSize: FontSize['5xl'], fontWeight: FontWeight.bold, lineHeight: 48 },
  displayMedium: { fontSize: FontSize['4xl'], fontWeight: FontWeight.bold, lineHeight: 40 },
  h1: { fontSize: FontSize['3xl'], fontWeight: FontWeight.bold, lineHeight: 34 },
  h2: { fontSize: FontSize['2xl'], fontWeight: FontWeight.semibold, lineHeight: 30 },
  h3: { fontSize: FontSize.xl, fontWeight: FontWeight.semibold, lineHeight: 26 },
  h4: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, lineHeight: 24 },
  bodyLarge: { fontSize: FontSize.md, fontWeight: FontWeight.regular, lineHeight: 24 },
  body: { fontSize: FontSize.base, fontWeight: FontWeight.regular, lineHeight: 22 },
  bodySmall: { fontSize: FontSize.sm, fontWeight: FontWeight.regular, lineHeight: 20 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, lineHeight: 20 },
  labelSmall: { fontSize: FontSize.xs, fontWeight: FontWeight.medium, lineHeight: 16 },
  caption: { fontSize: FontSize.xs, fontWeight: FontWeight.regular, lineHeight: 16 },
} as const;
