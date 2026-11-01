/**
 * NURI DESIGN SYSTEM - TOKENS DE DESIGN & TEMA
 * Cores acolhedoras, tipografia e espaçamentos desenhados para famílias.
 */

export const Colors = {
  // Cores de Marca (Brand)
  primary: '#5E8A75', // Verde Sálvia / Acolhimento & Saúde
  primaryLight: '#EBF3EF',
  primaryDark: '#446656',

  secondary: '#D97757', // Terracota / Amor & Memórias
  secondaryLight: '#FDF2EE',
  secondaryDark: '#BA5939',

  accent: '#E6A740', // Mel / Celebrações & Mesversários
  accentLight: '#FEF8EC',

  // Superfícies e Fundos
  background: '#FDFBF7', // Creme suave (menos cansativo para os olhos dos pais à noite)
  surface: '#FFFFFF',
  surfaceSubtle: '#F7F4EE',
  border: '#EDE7DE',
  borderDark: '#D8CEBF',

  // Textos
  textPrimary: '#1F242E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverted: '#FFFFFF',

  // Estados de Saúde & Alertas
  success: '#38A169',
  successLight: '#E6F4EA',
  warning: '#DD6B20',
  warningLight: '#FEEBC8',
  danger: '#E53E3E',
  dangerLight: '#FED7D7',
  info: '#3182CE',
  infoLight: '#EBF8FF',

  // Papéis de Família (Badges)
  roleParent: '#5E8A75',
  roleFamily: '#D97757',
  roleCaregiver: '#3182CE',
  roleDoctor: '#805AD5',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: '#2D3142',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  floating: {
    shadowColor: '#5E8A75',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};
