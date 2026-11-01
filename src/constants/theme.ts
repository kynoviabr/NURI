/**
 * NURI PREMIUM DESIGN SYSTEM
 * Inspirado nas melhores referências internacionais de design escandinavo e parental (Apple Design / FamilyAlbum / Flo).
 * Paleta calorosa, orgânica e aconchegante.
 */

export const Colors = {
  // Cores de Marca (Aconchegantes e Naturais)
  primary: '#436B53',        // Verde Floresta / Sálvia Profundo (Sofisticação & Cuidado)
  primaryLight: '#EAF2EC',   // Verde Orvalho
  primaryDark: '#2C4938',

  secondary: '#D9745B',      // Terracota / Pêssego Suave (Afeto & Família)
  secondaryLight: '#FDF1ED',
  secondaryDark: '#B85842',

  accent: '#E99B35',         // Mel Dourado / Celebrações & Conquistas
  accentLight: '#FDF6EB',

  blush: '#F4A5A5',          // Rosa Chá
  blushLight: '#FDF2F2',

  // Fundos & Superfícies (Linho e Algodão)
  background: '#F9F6F0',     // Linho Quente Suave (Anti-fadiga visual)
  surface: '#FFFFFF',
  surfaceSubtle: '#F2EDE4',
  surfaceMuted: '#EAE3D6',

  border: '#ECE6DC',
  borderLight: '#F4EFEB',

  // Tipografia & Contraste
  textPrimary: '#1E232B',    // Grafite Profundo (Muito mais elegante que preto puro)
  textSecondary: '#6B7380',  // Cinza Quente
  textMuted: '#9BA3AF',
  textInverted: '#FFFFFF',

  // Estados & Saúde
  success: '#2E8555',
  successLight: '#E8F5EE',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#2563EB',
  infoLight: '#EFF6FF',
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const Shadows = {
  subtle: {
    shadowColor: '#3A3025',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#2D261E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  floating: {
    shadowColor: '#436B53',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
};
