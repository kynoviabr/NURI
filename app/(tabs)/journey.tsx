import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, CheckCircle2, Clock, Camera, ChevronRight, Trophy } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateBabyAge, calculateGestation } from '../../src/utils/babyCalculations';

export default function JourneyScreen() {
  const { baby } = useApp();
  const isBorn = baby.status === 'born';

  const gestationInfo = !isBorn && baby.due_date ? calculateGestation(baby.due_date) : null;
  const ageInfo = isBorn && baby.birth_date ? calculateBabyAge(baby.birth_date) : null;

  const monthsMilestones = Array.from({ length: 12 }, (_, i) => i + 1);

  const devMilestones = [
    { title: 'Sorriso Social espontâneo', ageRange: '1 a 2 meses', achieved: true, tip: 'Responde a vozes e sorrisos dos pais' },
    { title: 'Sustentar o pescoço de bruços', ageRange: '2 a 3 meses', achieved: true, tip: 'Levanta a cabeça a 45 graus' },
    { title: 'Descobrir e agarrar as mãozinhas', ageRange: '3 a 4 meses', achieved: true, tip: 'Junta as mãos na linha média do corpo' },
    { title: 'Rolar da barriga para as costas', ageRange: '4 a 5 meses', achieved: false, tip: 'Explora o movimento do corpo no tapete' },
    { title: 'Sentar com apoio', ageRange: '5 a 6 meses', achieved: false, tip: 'Mantém a postura com almofada' },
    { title: 'Introdução Alimentar (primeira papinha)', ageRange: '6 meses', achieved: false, tip: 'Início de frutas e legumes amassados' },
    { title: 'Sentar sem apoio e engatinhar', ageRange: '7 a 9 meses', achieved: false, tip: 'Autonomia para explorar a sala' },
    { title: 'Primeiras palavras (Mama / Papa)', ageRange: '9 a 12 meses', achieved: false, tip: 'Comunicação verbal intencional' },
    { title: 'Primeiros passos independentes', ageRange: '10 a 14 meses', achieved: false, tip: 'O grande marco de equilíbrio' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Jornada de Desenvolvimento</Text>
          <Text style={styles.headerSubtitle}>
            {isBorn ? `Marcos e crescimento de ${baby.name}` : `Fase Gestacional Semana a Semana`}
          </Text>
        </View>
        <View style={styles.badgeTop}>
          <Trophy size={14} color={Colors.accent} />
          <Text style={styles.badgeTopText}>{isBorn ? '3 Conquistas' : 'Semana 22'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* MODO GESTAÇÃO */}
        {!isBorn && gestationInfo && (
          <View style={styles.gestationHero}>
            <View style={styles.gestationTopRow}>
              <View>
                <Text style={styles.gestationLabel}>SEMANA ATUAL</Text>
                <Text style={styles.gestationWeekBig}>{gestationInfo.currentWeek}ª Semana</Text>
                <Text style={styles.gestationDaySub}>Dia {gestationInfo.currentDay} de 7 da semana</Text>
              </View>
              <View style={styles.fruitBadge}>
                <Text style={styles.fruitEmoji}>🥑</Text>
                <Text style={styles.fruitText}>{gestationInfo.fruitComparison}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${gestationInfo.percentage}%` }]} />
              </View>
              <View style={styles.progressLabels}>
                <Text style={styles.progressSub}>Início (Semana 1)</Text>
                <Text style={styles.progressMain}>{gestationInfo.percentage}% concluído</Text>
                <Text style={styles.progressSub}>Parto (Semana 40)</Text>
              </View>
            </View>

            <View style={styles.tipCard}>
              <Sparkles size={16} color={Colors.accent} />
              <Text style={styles.tipText}>{gestationInfo.developmentTip}</Text>
            </View>
          </View>
        )}

        {/* MODO BEBÊ: ÁLBUM DE MESVERSÁRIOS */}
        {isBorn && (
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Evolução de Mesversários</Text>
                <Text style={styles.sectionSubtitle}>Fotos oficiais de cada mês para o time-lapse</Text>
              </View>
              <View style={styles.tagTimeLapse}>
                <Text style={styles.tagTimeLapseText}>🎬 1º Ano</Text>
              </View>
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
                    <View style={[styles.monthBadgeCircle, isCompleted && styles.monthBadgeCircleCompleted]}>
                      <Text style={[styles.monthBadgeNum, isCompleted && styles.monthBadgeNumCompleted]}>
                        {m}
                      </Text>
                    </View>
                    <Text style={styles.monthCardName}>{m}º Mês</Text>

                    {isCompleted ? (
                      <View style={styles.statusPillDone}>
                        <CheckCircle2 size={11} color={Colors.success} />
                        <Text style={styles.statusTextDone}>Salvo</Text>
                      </View>
                    ) : isCurrent ? (
                      <View style={styles.statusPillCurrent}>
                        <Camera size={11} color={Colors.primary} />
                        <Text style={styles.statusTextCurrent}>Tirar foto</Text>
                      </View>
                    ) : (
                      <View style={styles.statusPillFuture}>
                        <Text style={styles.statusTextFuture}>Em breve</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* SALTOS DE DESENVOLVIMENTO */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Saltos e Conquistas</Text>
          <Text style={styles.sectionSubtitle}>Estimativas pediátricas de desenvolvimento motor e cognitivo</Text>

          <View style={styles.milestonesList}>
            {devMilestones.map((item, index) => (
              <View key={index} style={styles.milestoneRow}>
                <View style={[styles.checkCircleWrap, item.achieved && styles.checkCircleWrapAchieved]}>
                  {item.achieved ? (
                    <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.5} />
                  ) : (
                    <Clock size={16} color={Colors.textMuted} />
                  )}
                </View>

                <View style={styles.milestoneDetails}>
                  <Text style={[styles.milestoneHeading, item.achieved && styles.milestoneHeadingDone]}>
                    {item.title}
                  </Text>
                  <Text style={styles.milestoneTip}>{item.tip}</Text>
                  <View style={styles.milestoneAgePill}>
                    <Text style={styles.milestoneAgePillText}>{item.ageRange}</Text>
                  </View>
                </View>

                <ChevronRight size={16} color={Colors.border} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badgeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#FBE8CC',
  },
  badgeTopText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 50,
  },
  gestationHero: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  gestationTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gestationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  gestationWeekBig: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  gestationDaySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  fruitBadge: {
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#FBE8CC',
  },
  fruitEmoji: {
    fontSize: 24,
  },
  fruitText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3EFE9',
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  progressMain: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FDFBF7',
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#ECE5D8',
  },
  tipText: {
    fontSize: 12.5,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 17,
  },
  sectionBlock: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tagTimeLapse: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  tagTimeLapseText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  monthCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  monthCardCompleted: {
    borderColor: '#C6E7D2',
    backgroundColor: '#FAFDFB',
  },
  monthCardCurrent: {
    borderColor: Colors.secondary,
    borderWidth: 1.5,
    backgroundColor: '#FFFBF9',
  },
  monthBadgeCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  monthBadgeCircleCompleted: {
    backgroundColor: Colors.successLight,
  },
  monthBadgeNum: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  monthBadgeNumCompleted: {
    color: Colors.success,
  },
  monthCardName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  statusPillDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  statusTextDone: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.success,
  },
  statusPillCurrent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  statusTextCurrent: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  statusPillFuture: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusTextFuture: {
    fontSize: 9.5,
    color: Colors.textMuted,
  },
  milestonesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFEB',
    gap: 12,
  },
  checkCircleWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleWrapAchieved: {
    backgroundColor: Colors.success,
  },
  milestoneDetails: {
    flex: 1,
  },
  milestoneHeading: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  milestoneHeadingDone: {
    color: Colors.textPrimary,
  },
  milestoneTip: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  milestoneAgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
    marginTop: 4,
  },
  milestoneAgePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
