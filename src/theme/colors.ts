const palette = {
  // Brand – deep sky
  primary50: '#EEF7FF',
  primary100: '#D9EEFF',
  primary200: '#B3D9FF',
  primary300: '#7DBEFF',
  primary400: '#4AA3FF',
  primary500: '#1A85FF',
  primary600: '#0066E6',
  primary700: '#0050B8',
  primary800: '#003D8F',
  primary900: '#002B66',

  // Accent – amber / adventure
  accent50: '#FFF8EC',
  accent100: '#FFEFC4',
  accent200: '#FFD870',
  accent300: '#FFC03A',
  accent400: '#FFA600',
  accent500: '#F59300',
  accent600: '#C97300',
  accent700: '#9C5500',
  accent800: '#703B00',
  accent900: '#4A2600',

  // Semantic
  success500: '#22C55E',
  success50: '#F0FDF4',
  success700: '#15803D',

  warning500: '#F59E0B',
  warning50: '#FFFBEB',
  warning700: '#B45309',

  error500: '#EF4444',
  error50: '#FFF1F2',
  error700: '#B91C1C',

  info500: '#3B82F6',
  info50: '#EFF6FF',
  info700: '#1D4ED8',

  // Neutrals
  neutral0: '#FFFFFF',
  neutral50: '#F8FAFC',
  neutral100: '#F1F5F9',
  neutral200: '#E2E8F0',
  neutral300: '#CBD5E1',
  neutral400: '#94A3B8',
  neutral500: '#64748B',
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1E293B',
  neutral900: '#0F172A',
  neutral950: '#020617',
};

export const Colors = {
  light: {
    // Backgrounds
    background: palette.neutral0,
    backgroundSecondary: palette.neutral50,
    backgroundTertiary: palette.neutral100,

    // Text
    text: palette.neutral900,
    textSecondary: palette.neutral600,
    textTertiary: palette.neutral400,
    textInverse: palette.neutral0,

    // Brand
    primary: palette.primary500,
    primaryLight: palette.primary100,
    accent: palette.accent500,
    accentLight: palette.accent100,

    // Semantic
    success: palette.success500,
    successBackground: palette.success50,
    warning: palette.warning500,
    warningBackground: palette.warning50,
    error: palette.error500,
    errorBackground: palette.error50,
    info: palette.info500,
    infoBackground: palette.info50,

    // UI chrome
    border: palette.neutral200,
    borderStrong: palette.neutral300,
    icon: palette.neutral500,
    tint: palette.primary500,
    tabIconDefault: palette.neutral400,
    tabIconSelected: palette.primary500,
    card: palette.neutral0,
    cardBorder: palette.neutral200,
  },
  dark: {
    background: palette.neutral950,
    backgroundSecondary: palette.neutral900,
    backgroundTertiary: palette.neutral800,

    text: palette.neutral50,
    textSecondary: palette.neutral400,
    textTertiary: palette.neutral600,
    textInverse: palette.neutral900,

    primary: palette.primary400,
    primaryLight: palette.primary900,
    accent: palette.accent400,
    accentLight: palette.accent900,

    success: palette.success500,
    successBackground: '#052E16',
    warning: palette.warning500,
    warningBackground: '#451A03',
    error: palette.error500,
    errorBackground: '#450A0A',
    info: palette.info500,
    infoBackground: '#172554',

    border: palette.neutral800,
    borderStrong: palette.neutral700,
    icon: palette.neutral400,
    tint: palette.primary400,
    tabIconDefault: palette.neutral600,
    tabIconSelected: palette.primary400,
    card: palette.neutral900,
    cardBorder: palette.neutral800,
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ColorToken = keyof typeof Colors.light;
