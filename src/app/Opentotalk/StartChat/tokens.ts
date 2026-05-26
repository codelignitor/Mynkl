// Mynkl Open to Talk — Final Token System v2
// Production-grade, pastel theme, no bottom navigation.
// Keep all color, spacing, radius, type, size, and shadow values centralized here.

export const colors = {
  // Screen background
  bgTop: '#F8FFFF',
  bgMid: '#EAFBFB',
  bgBottom: '#D8F7F6',
  bgGlowAqua: 'rgba(83, 224, 220, 0.22)',
  bgGlowMint: 'rgba(185, 255, 226, 0.42)',

  // Text
  textPrimary: '#07373D',
  textSecondary: '#416873',
  textMuted: '#7F9AA4',

  // Legacy aliases used by existing screens
  ink: '#07373D',
  inkSoft: '#416873',
  muted: '#7F9AA4',
  muted2: '#9AB1BA',
  white: '#FFFFFF',

  // Brand / accents
  teal: '#22C8C3',
  tealDark: '#0D8F8C',
  tealSoft: '#8FF3E5',
  mint: '#CAFFDF',
  aqua: '#C8FBF8',
  green: '#19B86B',
  success: '#19B86B',
  coral: '#FF5548',
  danger: '#FF5A4F',
  amber: '#F6B93B',
  warning: '#F6B93B',
  purple: '#9A5BE8',
  pink: '#E77791',

  // Surfaces
  card: 'rgba(255, 255, 255, 0.64)',
  cardBg: 'rgba(255, 255, 255, 0.64)',
  cardStrong: 'rgba(255, 255, 255, 0.86)',
  cardBorder: 'rgba(150, 235, 235, 0.75)',
  cardBorderStrong: 'rgba(44, 200, 198, 0.50)',
  pill: 'rgba(255, 255, 255, 0.58)',
  pillBg: 'rgba(255, 255, 255, 0.58)',
  pillActive: 'rgba(119, 230, 222, 0.36)',
  input: 'rgba(255, 255, 255, 0.78)',
  overlay: 'rgba(255,255,255,0.94)',

  // Shadows
  shadow: 'rgba(110, 198, 195, 0.14)',
  shadowStrong: 'rgba(34, 200, 195, 0.28)',
  glow: 'rgba(34, 200, 195, 0.35)',
} as const;

export const gradients = {
  screen: [colors.bgTop, colors.bgMid, colors.bgBottom] as const,
  primaryCTA: ['#22C8C3', '#CAFFDF'] as const,
  cta: ['#22C8C3', '#63DDD2', '#CAFFDF'] as const,
  ctaSoft: ['rgba(96,224,220,0.40)', 'rgba(207,255,222,0.48)'] as const,
  selectedPill: ['#C9FAF6', '#A8EEE6'] as const,
  activePill: ['rgba(100,224,220,0.44)', 'rgba(196,252,226,0.52)'] as const,
  avatarRing: ['#73EEF3', '#FFFFFF', '#8EFFC6', '#5BE5E2'] as const,
  lightCard: ['rgba(255,255,255,0.88)', 'rgba(240,255,255,0.72)'] as const,
} as const;

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 10,
  md: 14,
  base: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 42,
  screenX: 24,
  screenTop: 42,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
} as const;

// Legacy alias used by the generated screens.
export const radii = {
  sm: radius.sm,
  md: radius.md,
  lg: 22,
  xl: radius.lg,
  xxl: radius.xl,
  card: radius.lg,
  full: radius.pill,
} as const;

export const typography = {
  brand: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, letterSpacing: -0.3 },
  hero: { fontSize: 40, lineHeight: 46, fontWeight: '800' as const, letterSpacing: -1.2 },
  screenTitle: { fontSize: 32, lineHeight: 38, fontWeight: '800' as const, letterSpacing: -0.9 },
  title: { fontSize: 32, lineHeight: 38, fontWeight: '800' as const, letterSpacing: -0.9 },
  sectionTitle: { fontSize: 22, lineHeight: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  cardTitle: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  bodyLarge: { fontSize: 18, lineHeight: 26, fontWeight: '400' as const, letterSpacing: -0.2 },
  bodyLg: { fontSize: 18, lineHeight: 26, fontWeight: '400' as const, letterSpacing: -0.2 },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '700' as const, letterSpacing: 0.8 },
  pill: { fontSize: 15, lineHeight: 20, fontWeight: '500' as const },
  pillActive: { fontSize: 15, lineHeight: 20, fontWeight: '700' as const },
  cta: { fontSize: 20, lineHeight: 25, fontWeight: '800' as const, letterSpacing: -0.4 },
} as const;

export const shadows = {
  card: {
    shadowColor: '#6EC6C3',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  soft: {
    shadowColor: '#6EC6C3',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  glow: {
    shadowColor: '#22C8C3',
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
} as const;

export const sizes = {
  cardMinHeight: 92,
  pillHeight: 52,
  primaryCTAHeight: 58,
  inputHeight: 52,
  chipHeight: 42,
  avatarSm: 54,
  avatarMd: 72,
  avatarLg: 128,
  avatarXl: 164,
  iconSm: 18,
  iconMd: 22,
  iconLg: 30,
} as const;

// Legacy alias used by the generated screens.
export const sizing = {
  maxContentWidth: 430,
  avatarLg: sizes.avatarXl,
  avatarMd: sizes.avatarLg,
  avatarSm: sizes.avatarSm,
  ctaHeight: sizes.primaryCTAHeight,
  pillHeight: sizes.pillHeight,
  inputHeight: sizes.inputHeight,
  chipHeight: sizes.chipHeight,
} as const;

export const pixelTuning = {
  global: {
    screenPaddingX: spacing.screenX,
    cardRadius: radius.lg,
    cardPadding: spacing.xl,
    ctaHeight: sizes.pillHeight,
    ctaGap: spacing.md,
  },
  screen1: {
    toggleCardHeight: 62,
    chipHeight: sizes.chipHeight,
    primaryCTAHeight: sizes.primaryCTAHeight,
  },
  screen2: {
    avatarSize: sizes.avatarXl,
    scoreCircleSize: 132,
    compatCardMarginLeft: 118,
    icebreakerCardMarginTop: 132,
  },
  screen3: {
    avatarSize: sizes.avatarSm,
    headerActionSize: 46,
    inputBarHeight: 86,
    inputHeight: sizes.inputHeight,
    sendButtonSize: 52,
  },
  screen4: {
    reactionSize: 58,
    noteInputHeight: sizes.inputHeight,
    requestCTAHeight: 48,
  },
  screen5: {
    connectedCardPaddingLeft: 150,
    avatarSize: sizes.avatarLg,
    avatarLeft: -10,
    avatarTop: -34,
    chatPillHeight: sizes.pillHeight,
    ctaIconTranslateY: 1,
  },
} as const;
