export const THEME = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const;

export type Theme = typeof THEME[keyof typeof THEME];

export const THEME_CONFIG = {
  defaultTheme: THEME.LIGHT,
  attribute: 'class',
  enableSystem: true,
} as const;

// Asset paths based on theme
export const THEME_ASSETS = {
  logo: {
    [THEME.DARK]: '/assets/fastnear_logo_white.png',
    [THEME.LIGHT]: '/assets/fastnear_logo_black.png',
  },
  github: {
    [THEME.DARK]: '/assets/github-mark-white.svg',
    [THEME.LIGHT]: '/assets/github-mark.svg',
  },
} as const;
