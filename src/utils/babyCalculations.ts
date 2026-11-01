/**
 * NURI HELPERS - CÁLCULOS PEDIÁTRICOS, PERCENTIS OMS E GESTAÇÃO
 */

export interface GestationProgress {
  currentWeek: number;
  currentDay: number;
  totalDays: number;
  percentage: number;
  fruitComparison: string;
  developmentTip: string;
}

export interface BabyAge {
  totalDays: number;
  months: number;
  days: number;
  years: number;
  formattedText: string;
  nextMilestoneTitle: string;
}

export interface TemperatureClassification {
  category: 'normal' | 'febril' | 'febre_moderada' | 'febre_alta';
  label: string;
  color: string;
  advice: string;
}

const GESTATION_WEEKS_DATA: Record<number, { fruit: string; tip: string }> = {
  4: { fruit: 'Sementinha de Papoula', tip: 'O embrião está se fixando no útero.' },
  8: { fruit: 'Framboesa', tip: 'Dedinhos das mãos e pés estão começando a se formar.' },
  12: { fruit: 'Ameixa', tip: 'Todos os órgãos vitais essenciais já estão formados!' },
  16: { fruit: 'Abacate', tip: 'Os olhos já conseguem se mover lentamente e percebem luz.' },
  20: { fruit: 'Banana', tip: 'Metade do caminho! O bebê já começa a ouvir sons e sua voz.' },
  24: { fruit: 'Milho', tip: 'O bebê já responde com chutes a toques na barriga e música.' },
  28: { fruit: 'Beringela', tip: 'Início do 3º trimestre: abrindo os olhos e piscando.' },
  32: { fruit: 'Abacaxi', tip: 'Ganho acelerado de peso e os ossos estão endurecendo.' },
  36: { fruit: 'Mamão Papaia', tip: 'Pulmões quase prontos para a primeira respiração no mundo!' },
  40: { fruit: 'Melancia', tip: 'Chegou o momento mais esperado! Pronto para nascer.' },
};

/**
 * Calcula a semana de gestação com base na Data Prevista do Parto (DPP)
 */
export function calculateGestation(dueDateStr: string): GestationProgress {
  const due = new Date(dueDateStr);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalGestationDays = 280; // 40 semanas
  const daysPassed = Math.max(0, Math.min(totalGestationDays, totalGestationDays - daysRemaining));
  
  const currentWeek = Math.floor(daysPassed / 7);
  const currentDay = daysPassed % 7;
  const percentage = Math.min(100, Math.round((daysPassed / totalGestationDays) * 100));

  const availableWeeks = Object.keys(GESTATION_WEEKS_DATA).map(Number).sort((a, b) => a - b);
  let bestWeek = availableWeeks[0];
  for (const w of availableWeeks) {
    if (currentWeek >= w) bestWeek = w;
  }
  const weekInfo = GESTATION_WEEKS_DATA[bestWeek] || { fruit: 'Grão de Mostarda', tip: 'Desenvolvimento inicial em andamento.' };

  return {
    currentWeek: Math.max(1, currentWeek),
    currentDay,
    totalDays: daysPassed,
    percentage,
    fruitComparison: weekInfo.fruit,
    developmentTip: weekInfo.tip,
  };
}

/**
 * Calcula a idade exata do bebê em meses, dias e anos
 */
export function calculateBabyAge(birthDateStr: string): BabyAge {
  const birth = new Date(birthDateStr);
  const now = new Date();

  const diffTime = Math.max(0, now.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let formattedText = '';
  if (years > 0) {
    formattedText = `${years} ano${years > 1 ? 's' : ''} e ${months} m`;
  } else if (months > 0) {
    formattedText = `${months} ${months === 1 ? 'mês' : 'meses'} e ${days} d`;
  } else {
    formattedText = `${days} dia${days === 1 ? '' : 's'} de vida`;
  }

  const nextMilestoneMonth = (years * 12) + months + 1;
  const nextMilestoneTitle = nextMilestoneMonth <= 12 
    ? `Mesversário de ${nextMilestoneMonth} meses` 
    : `Aniversário de ${Math.floor(nextMilestoneMonth / 12) + 1} anos`;

  return {
    totalDays,
    months: (years * 12) + months,
    days,
    years,
    formattedText,
    nextMilestoneTitle,
  };
}

/**
 * Classificação de Febre Infantil
 */
export function classifyTemperature(temp: number): TemperatureClassification {
  if (temp < 37.3) {
    return {
      category: 'normal',
      label: 'Afebril (Normal)',
      color: '#2E8555',
      advice: 'Temperatura normal. Manter observação de rotina.',
    };
  }
  if (temp <= 37.7) {
    return {
      category: 'febril',
      label: 'Estado Febril',
      color: '#D97706',
      advice: 'Ofereça líquidos/peito e retire roupas em excesso. Monitore a cada hora.',
    };
  }
  if (temp <= 38.9) {
    return {
      category: 'febre_moderada',
      label: 'Febre Moderada',
      color: '#DC2626',
      advice: 'Administrar antitérmico conforme prescrição médica. Oferecer hidratação constante.',
    };
  }
  return {
    category: 'febre_alta',
    label: 'Febre Alta (Alerta)',
    color: '#991B1B',
    advice: 'Administrar antitérmico. Se não houver queda em 2h ou houver sonolência excessiva, procure pronto-socorro.',
  };
}

/**
 * Calcula o horário da próxima dose baseado no intervalo de horas
 */
export function calculateNextDose(administeredAtIso: string, intervalHours: number): string {
  const date = new Date(administeredAtIso);
  date.setHours(date.getHours() + intervalHours);
  return date.toISOString();
}

/**
 * Calcula a estimativa de Percentil da OMS para Peso baseado em meses de vida (Meninos / Meninas)
 */
export function calculateWHOWeightPercentile(weightKg: number, ageMonths: number): string {
  // Médias aproximadas p50 para meninos/meninas: 0m: 3.3kg, 1m: 4.5kg, 2m: 5.6kg, 3m: 6.4kg, 4m: 7.0kg, 6m: 7.9kg, 12m: 9.6kg
  const expectedP50 = 3.3 + (ageMonths * 0.75) - (ageMonths > 6 ? (ageMonths - 6) * 0.25 : 0);
  const diffPercent = ((weightKg - expectedP50) / expectedP50) * 100;

  if (diffPercent < -15) return 'p15 (Abaixo da média)';
  if (diffPercent >= -15 && diffPercent <= 15) return 'p50 (Ideal OMS)';
  if (diffPercent > 15 && diffPercent <= 25) return 'p85 (Acima da média)';
  return 'p97 (Alto)';
}

/**
 * Formata data amigável relativa
 */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Agora mesmo';
  if (diffSec < 3600) return `Há ${Math.floor(diffSec / 60)} min`;
  if (diffSec < 86400) return `Há ${Math.floor(diffSec / 3600)} h`;

  const isToday = now.toDateString() === date.toDateString();
  if (isToday) return 'Hoje';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) return 'Ontem';

  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
