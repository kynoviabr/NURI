import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, CheckCircle, Clock, Camera, ChevronRight } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateBabyAge, calculateGestation } from '../../src/utils/babyCalculations';

export default function JourneyScreen() {
  const { baby } = useApp();
  const isBorn = baby.status === 'born';

  const gestationInfo = !isBorn && baby.due_date ? calculateGestation(baby.due_date) : null;
  const ageInfo = isBorn && baby.birth_date ? calculateBabyAge(baby.birth_date) : null;

  // Meses de mesversário (1 a 12 meses)
  const monthsMilestones = Array.from({ length: 12 }, (_, i) => i + 1);

  // Marcos de desenvolvimento infantil
  const devMilestones = [
    { title: 'Sorriso Social', ageRange: '1 a 2 meses', achieved: true },
    { title: 'Sustentar o pescoço de bruços', ageRange: '2 a 3 meses', achieved: true },
    { title: 'Descobrir e agarrar as mãozinhas', ageRange: '3 a 4 meses', achieved: true },
    { title: 'Rolar da barriga para as costas', ageRange: '4 a 5 meses', achieved: false },
    { title: 'Sentar com apoio', ageRange: '5 a 6 meses', achieved: false },
    { title: 'Introdução Alimentar (primeira papinha)', ageRange: '6 meses', achieved: false },
    { title: 'Sentar sem apoio e engatinhar', ageRange: '7 a 9 meses', achieved: false },
    { title: 'Primeiras palavras (Mama/Papa)', ageRange: '9 a 12 meses', achieved: false },
    { title: 'Ficar em pé e primeiros passos', ageRange: '10 a 14 meses', achieved: false },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jornada de Evolução</Text>
        <Text style={styles.headerSubtitle}>
          {isBorn ? `Acompanhando o crescimento de ${baby.name}` : `Fase Gestacional: Semana a Semana`}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* MODO GESTAÇÃO */}
        {!isBorn && gestationInfo && (
          <View>
            <View style={styles.gestationHero}>
              <View style={styles.gestationHeader}>
                <View>
                  <Text style={styles.gestationWeekBig}>{gestationInfo.currentWeek}ª Semana</Text>
                  <Text style={styles.gestationDaySub}>Dia {gestationInfo.currentDay} de 7 da semana</Text>
                </View>
                <View style={styles.fruitBadge}>
                  <Text style={styles.fruitText}>{gestationInfo.fruitComparison}</Text>
                </View>
              </View>

              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${gestationInfo.percentage}%` }]} />
              </View>
              <Text style={styles.progressLabel}>{gestationInfo.percentage}% da gestação completada</Text>

              <View style={styles.tipCard}>
                <Sparkles size={16} color={Colors.accent} />
                <Text style={styles.tipText}>{gestationInfo.developmentTip}</Text>
              </View>
            </View>
          </View>
        )}

        {/* MODO RECÉM-NASCIDO / BEBÊ: ÁLBUM DE MESVERSÁRIOS */}
        {isBorn && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Evolução Mês a Mês (1º Ano)</Text>
              <Text style={styles.sectionHelper}>Time-lapse automático</Text>
            </View>

            <View style={styles.monthsGrid}>
              {monthsMilestones.map((m) => {
                const currentMonthAge = ageInfo?.months || 0;
                const isCompleted = m <= currentMonthAge;
                const isCurrent = m === currentMonthAge + 1;

                return (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.monthCard,
                      isCompleted && styles.monthCardCompleted,
                      isCurrent && styles.monthCardCurrent,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.monthBadge}>
                      <Text style={[styles.monthBadgeText, isCompleted && styles.monthBadgeTextCompleted]}>
                        {m}M
                      </Text>
                    </View>
                    <Text style={styles.monthLabel}>{m}º Mês</Text>
                    {isCompleted ? (
                      <View style={styles.completedBadge}>
                        <CheckCircle size={14} color={Colors.success} />
                        <Text style={styles.completedText}>Foto salva</Text>
                      </View>
                    ) : (
                      <View style={styles.pendingBadge}>
                        <Camera size={14} color={isCurrent ? Colors.primary : Colors.textMuted} />
                        <Text style={[styles.pendingText, isCurrent && styles.pendingTextCurrent]}>
                          {isCurrent ? 'Fotografar' : 'Aguardando'}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* MARCOS DO DESENVOLVIMENTO INFANTIL */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Marcos e Saltos de Desenvolvimento</Text>
          <Text style={styles.sectionSubtitle}>Estimativas baseadas na pediatria para comemorar em família</Text>

          <View style={styles.milestonesList}>
            {devMilestones.map((item, index) => (
              <View key={index} style={styles.milestoneRow}>
                <View style={styles.milestoneIconWrap}>
                  {item.achieved ? (
                    <CheckCircle size={20} color={Colors.success} />
                  ) : (
                    <Clock size={20} color={Colors.textMuted} />
                  )}
                </View>
                <View style={styles.milestoneInfo}>
                  <Text style={[styles.milestoneTitle, item.achieved && styles.milestoneAchieved]}>
                    {item.title}
                  </Text>
                  <Text style={styles.milestoneAge}>{item.ageRange}</Text>
                </View>
                <ChevronRight size={16} color={Colors.textMuted} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  gestationHero: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  gestationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  gestationWeekBig: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  gestationDaySub: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  fruitBadge: {
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  fruitText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.accent,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'right',
    marginBottom: Spacing.sm,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accentLight,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    marginTop: Spacing.xs,
  },
  tipText: {
    fontSize: 13,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  sectionBlock: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  sectionHelper: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  monthCard: {
    width: '31%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  monthCardCompleted: {
    borderColor: Colors.success,
    backgroundColor: '#F7FCF9',
  },
  monthCardCurrent: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: Colors.primaryLight,
  },
  monthBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  monthBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  monthBadgeTextCompleted: {
    color: Colors.success,
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  completedText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '600',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  pendingText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  pendingTextCurrent: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  milestonesList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  milestoneIconWrap: {
    marginRight: Spacing.sm,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  milestoneAchieved: {
    color: Colors.textPrimary,
  },
  milestoneAge: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
