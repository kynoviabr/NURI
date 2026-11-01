import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Plus,
  Clock,
  Moon,
  Sun,
  Share2,
  Sparkles,
  AlertTriangle,
  Baby as BabyIcon,
  CheckCircle2,
  Copy,
  ChevronRight,
  Activity,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import {
  calculateBabyAge,
  calculateWakeWindow,
  formatRelativeDate,
  formatMinutesFriendly,
  formatTimerSeconds,
} from '../../src/utils/babyCalculations';
import { FeedingLog, DiaperLog, SleepLog, TummyTimeLog } from '../../src/types/database';

export default function RoutineScreen() {
  const router = useRouter();
  const {
    baby,
    toggleBabyMode,
    feedings,
    diapers,
    sleeps,
    tummyTimes,
    finishActiveSleep,
    addTummyTimeLog,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'feeding' | 'diaper' | 'sleep' | 'tummy'>('all');

  const ageInfo = baby.birth_date ? calculateBabyAge(baby.birth_date) : { months: 3, formattedText: '3 meses' };
  const ageMonths = ageInfo.months || 3;

  // 1. ÚLTIMA MAMADA
  const lastFeeding = feedings[0] || null;

  // 2. ÚLTIMA FRALDA
  const lastDiaper = diapers[0] || null;

  // 3. STATUS DO SONO & JANELA DE VIGÍLIA
  const activeOngoingSleep = sleeps.find((s) => !s.end_time);
  const lastCompletedSleep = sleeps.find((s) => !!s.end_time);

  // Calcula quanto tempo está acordado (minutos desde o último sono)
  const nowMs = Date.now();
  let minutesAwake = 60; // padrão razoável se não houver dados
  if (!activeOngoingSleep && lastCompletedSleep && lastCompletedSleep.end_time) {
    const endMs = new Date(lastCompletedSleep.end_time).getTime();
    minutesAwake = Math.max(0, Math.floor((nowMs - endMs) / (1000 * 60)));
  }

  const wakeWindow = calculateWakeWindow(ageMonths, minutesAwake);

  // 4. CÁLCULO DOS TOTAIS DAS ÚLTIMAS 24 HORAS
  const oneDayAgoMs = nowMs - 24 * 60 * 60 * 1000;

  const feedings24h = feedings.filter((f) => new Date(f.start_time).getTime() >= oneDayAgoMs);
  const diapers24h = diapers.filter((d) => new Date(d.timestamp).getTime() >= oneDayAgoMs);
  const sleeps24h = sleeps.filter((s) => new Date(s.start_time).getTime() >= oneDayAgoMs);

  const totalBreastMinutes = feedings24h
    .filter((f) => f.type === 'breast')
    .reduce((acc, f) => acc + Math.round(((f.left_breast_seconds || 0) + (f.right_breast_seconds || 0)) / 60), 0);

  const totalBottleMl = feedings24h
    .filter((f) => f.type === 'bottle')
    .reduce((acc, f) => acc + (f.bottle_volume_ml || 0), 0);

  const totalPee = diapers24h.filter((d) => d.type === 'pee' || d.type === 'both').length;
  const totalPoo = diapers24h.filter((d) => d.type === 'poo' || d.type === 'both').length;

  const totalSleepMinutes = sleeps24h.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);

  // 5. UNIFICAÇÃO DA LINHA DO TEMPO CRONOLÓGICA
  type UnifiedEvent = {
    id: string;
    timestamp: string;
    category: 'feeding' | 'diaper' | 'sleep' | 'tummy';
    title: string;
    subtitle: string;
    detail?: string;
    author: string;
    alert?: string;
  };

  const unifiedList: UnifiedEvent[] = [];

  feedings.forEach((f) => {
    let title = 'Mamada no Peito';
    let sub = `${Math.round(((f.left_breast_seconds || 0) + (f.right_breast_seconds || 0)) / 60)} min no total`;
    if (f.type === 'bottle') {
      title = 'Mamadeira';
      sub = `${f.bottle_volume_ml || 0} ml (${f.bottle_content === 'breast_milk' ? 'Leite Materno' : 'Fórmula'})`;
    } else if (f.type === 'solid') {
      title = 'Comidinha / Papa';
      sub = `${f.solid_food_name || 'Refeição'} (Aceitação: ${f.solid_acceptance || 'Boa'})`;
    }

    unifiedList.push({
      id: f.id,
      timestamp: f.start_time,
      category: 'feeding',
      title,
      subtitle: sub,
      detail: f.notes,
      author: f.logged_by,
    });
  });

  diapers.forEach((d) => {
    let title = 'Troca de Fralda';
    let sub = 'Fralda Limpa';
    if (d.type === 'pee') sub = `Xixi (${d.pee_volume === 'heavy' ? 'Pesada' : 'Normal'})`;
    if (d.type === 'poo') sub = `Cocô (${d.poo_color || 'Amarelo'}, ${d.poo_consistency || 'Pastoso'})`;
    if (d.type === 'both') sub = `Xixi + Cocô (${d.poo_color || 'Amarelo'})`;

    unifiedList.push({
      id: d.id,
      timestamp: d.timestamp,
      category: 'diaper',
      title,
      subtitle: sub,
      detail: d.notes,
      author: d.logged_by,
      alert: d.clinical_alert,
    });
  });

  sleeps.forEach((s) => {
    const isOngoing = !s.end_time;
    const dur = s.duration_minutes ? formatMinutesFriendly(s.duration_minutes) : 'Dormindo agora...';
    unifiedList.push({
      id: s.id,
      timestamp: s.start_time,
      category: 'sleep',
      title: s.sleep_type === 'night' ? '🌙 Sono Noturno' : '☀️ Soneca Diurna',
      subtitle: `${dur} • ${s.location === 'crib' ? 'No berço' : s.location === 'arms' ? 'No colo' : 'No carrinho'}`,
      detail: s.notes,
      author: s.logged_by,
    });
  });

  tummyTimes.forEach((tt) => {
    unifiedList.push({
      id: tt.id,
      timestamp: tt.timestamp,
      category: 'tummy',
      title: '🤸 Tummy Time',
      subtitle: `${tt.duration_minutes} min de bruços fortalecendo pescoço`,
      detail: tt.notes,
      author: tt.logged_by,
    });
  });

  // Ordena do mais recente para o mais antigo
  unifiedList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Aplica filtro
  const filteredTimeline = filterType === 'all'
    ? unifiedList
    : unifiedList.filter((e) => e.category === filterType);

  // AÇÃO RÁPIDA: TUMMY TIME EM 1 TOQUE
  const handleQuickTummyTime = (minutes: number) => {
    addTummyTimeLog({
      baby_id: 'b1',
      timestamp: new Date().toISOString(),
      duration_minutes: minutes,
      notes: 'Sessão de estímulo motor no tapetinho.',
      logged_by: 'Mamãe',
    });
    Alert.alert('Tummy Time Registrado! 🤸', `${minutes} minutos salvos com sucesso.`);
  };

  // PASSAGEM DE PLANTÃO PARA WHATSAPP
  const handleShareHandover = () => {
    const summaryText =
      `📋 *RESUMO DA ROTINA DE HOJE - NURI*\n` +
      `👶 Bebê: *${baby.name}* (${ageInfo.formattedText})\n` +
      `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n\n` +
      `🍼 *ALIMENTAÇÃO:*\n` +
      `• Total de mamadas registradas: ${feedings24h.length}\n` +
      `• Peito: ${totalBreastMinutes} minutos no total\n` +
      `• Mamadeira: ${totalBottleMl} ml\n\n` +
      `🧷 *FRALDAS:*\n` +
      `• Trocas totais: ${diapers24h.length}\n` +
      `• Xixi: ${totalPee} | Cocô: ${totalPoo}\n\n` +
      `🌙 *SONO:*\n` +
      `• Total dormido nas 24h: ${formatMinutesFriendly(totalSleepMinutes)}\n` +
      `• Sonecas: ${sleeps24h.filter((s) => s.sleep_type === 'nap').length}\n\n` +
      `_Gerado pelo aplicativo NURI para a família._`;

    Alert.alert(
      'Passagem de Plantão Pronta!',
      summaryText,
      [
        { text: 'Copiar Texto', onPress: () => Alert.alert('Copiado!', 'Texto pronto para colar no WhatsApp da babá ou família.') },
        { text: 'Fechar' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER DA TELA */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: baby.avatar_url }} style={styles.babyAvatar} />
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.babyName}>{baby.name}</Text>
              <View style={styles.statusDot} />
            </View>
            <Text style={styles.babyAgeSubtitle}>
              Rotina de Hoje • {ageInfo.formattedText}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShareHandover} activeOpacity={0.8}>
          <Share2 size={16} color={Colors.primary} />
          <Text style={styles.shareBtnText}>Passar Plantão</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* CARDS DE STATUS RÁPIDO DO MOMENTO */}
        <View style={styles.statusCardsRow}>
          {/* ÚLTIMA MAMADA */}
          <TouchableOpacity
            style={styles.statusCard}
            onPress={() => router.push('/modals/add-feeding')}
            activeOpacity={0.8}
          >
            <View style={styles.statusCardHeader}>
              <Text style={styles.statusCardTitle}>ÚLTIMA MAMADA</Text>
              <Text style={styles.statusIcon}>🍼</Text>
            </View>
            <Text style={styles.statusTimeText}>
              {lastFeeding ? formatRelativeDate(lastFeeding.start_time) : 'Nenhuma'}
            </Text>
            <Text style={styles.statusSubDetail} numberOfLines={1}>
              {lastFeeding
                ? lastFeeding.type === 'breast'
                  ? `Seio ${lastFeeding.last_breast_used === 'right' ? 'D' : 'E'}`
                  : `${lastFeeding.bottle_volume_ml} ml`
                : 'Toque para registrar'}
            </Text>
          </TouchableOpacity>

          {/* ÚLTIMA FRALDA */}
          <TouchableOpacity
            style={styles.statusCard}
            onPress={() => router.push('/modals/add-diaper')}
            activeOpacity={0.8}
          >
            <View style={styles.statusCardHeader}>
              <Text style={styles.statusCardTitle}>ÚLTIMA FRALDA</Text>
              <Text style={styles.statusIcon}>🧷</Text>
            </View>
            <Text style={styles.statusTimeText}>
              {lastDiaper ? formatRelativeDate(lastDiaper.timestamp) : 'Nenhuma'}
            </Text>
            <Text style={styles.statusSubDetail} numberOfLines={1}>
              {lastDiaper
                ? lastDiaper.type === 'both'
                  ? 'Xixi + Cocô'
                  : lastDiaper.type === 'poo'
                  ? 'Cocô'
                  : 'Xixi'
                : 'Toque para registrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* HERO CARD: JANELA DE VIGÍLIA & STATUS DE SONO */}
        <View style={styles.wakeWindowCard}>
          <View style={styles.wakeHeaderRow}>
            <View style={styles.wakeTitleRow}>
              <Moon size={18} color={Colors.primary} />
              <Text style={styles.wakeCardTitle}>Janela de Vigília & Sono</Text>
            </View>

            <View style={[styles.wakeBadge, { backgroundColor: wakeWindow.badgeColor + '20' }]}>
              <Text style={[styles.wakeBadgeText, { color: wakeWindow.badgeColor }]}>
                {wakeWindow.badgeLabel}
              </Text>
            </View>
          </View>

          {activeOngoingSleep ? (
            <View style={styles.ongoingSleepRow}>
              <View>
                <Text style={styles.ongoingSleepLabel}>Status Atual:</Text>
                <Text style={styles.ongoingSleepVal}>Bebê dormindo agora...</Text>
              </View>
              <TouchableOpacity
                style={styles.finishSleepBtn}
                onPress={() => finishActiveSleep(activeOngoingSleep.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.finishSleepBtnText}>Bebê Acordou</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.wakeNumbersRow}>
                <View>
                  <Text style={styles.wakeNumberBig}>{formatMinutesFriendly(minutesAwake)}</Text>
                  <Text style={styles.wakeNumberSub}>Tempo que está acordado</Text>
                </View>

                <View style={styles.wakeIdealCol}>
                  <Text style={styles.wakeIdealLabel}>Janela Ideal ({ageMonths}m):</Text>
                  <Text style={styles.wakeIdealVal}>
                    {wakeWindow.minMinutes} a {wakeWindow.maxMinutes} min
                  </Text>
                </View>
              </View>

              {/* BARRA DE PROGRESSO DA JANELA */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${wakeWindow.progressPercentage}%`,
                      backgroundColor: wakeWindow.badgeColor,
                    },
                  ]}
                />
              </View>

              <Text style={styles.wakeGuidanceText}>{wakeWindow.guidanceText}</Text>
            </>
          )}
        </View>

        {/* BARRA DE BOTÕES DE AÇÃO RÁPIDA (+ MAMADA, + FRALDA, + SONO) */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionHeaderTitle}>Ações Rápidas em 1 Toque</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FDF2F4' }]}
              onPress={() => router.push('/modals/add-feeding')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnEmoji}>🤱</Text>
              <Text style={styles.actionBtnTitle}>+ Mamada</Text>
              <Text style={styles.actionBtnSub}>Peito / Mamadeira</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#F0F9FF' }]}
              onPress={() => router.push('/modals/add-diaper')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnEmoji}>🧷</Text>
              <Text style={styles.actionBtnTitle}>+ Fralda</Text>
              <Text style={styles.actionBtnSub}>Xixi / Cocô</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#F5F3FF' }]}
              onPress={() => router.push('/modals/add-sleep')}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnEmoji}>🌙</Text>
              <Text style={styles.actionBtnTitle}>+ Sono</Text>
              <Text style={styles.actionBtnSub}>Soneca / Noite</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FFFBEB' }]}
              onPress={() => handleQuickTummyTime(10)}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnEmoji}>🤸</Text>
              <Text style={styles.actionBtnTitle}>+ Tummy</Text>
              <Text style={styles.actionBtnSub}>10 min de bruços</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONSOLIDADO DAS ÚLTIMAS 24 HORAS */}
        <View style={styles.summary24hCard}>
          <Text style={styles.summary24hTitle}>Resumo das Últimas 24 Horas</Text>

          <View style={styles.summaryStatsRow}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatVal}>{feedings24h.length}</Text>
              <Text style={styles.summaryStatLabel}>Mamadas</Text>
              <Text style={styles.summaryStatNote}>
                {totalBreastMinutes > 0 ? `${totalBreastMinutes}m peito` : `${totalBottleMl}ml`}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatVal}>{diapers24h.length}</Text>
              <Text style={styles.summaryStatLabel}>Fraldas</Text>
              <Text style={styles.summaryStatNote}>
                {totalPee} xixi • {totalPoo} cocô
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatVal}>{formatMinutesFriendly(totalSleepMinutes)}</Text>
              <Text style={styles.summaryStatLabel}>Sono Total</Text>
              <Text style={styles.summaryStatNote}>
                {sleeps24h.length} soninhos
              </Text>
            </View>
          </View>
        </View>

        {/* FILTROS DA LINHA DO TEMPO */}
        <View style={styles.timelineSectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Linha do Tempo de Atividades</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsScroll}
          >
            {[
              { id: 'all', label: `Tudo (${unifiedList.length})` },
              { id: 'feeding', label: `🍼 Mamadas (${feedings.length})` },
              { id: 'diaper', label: `🧷 Fraldas (${diapers.length})` },
              { id: 'sleep', label: `🌙 Sono (${sleeps.length})` },
              { id: 'tummy', label: `🤸 Tummy (${tummyTimes.length})` },
            ].map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[
                  styles.filterPill,
                  filterType === f.id && styles.filterPillActive,
                ]}
                onPress={() => setFilterType(f.id as any)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filterType === f.id && styles.filterPillTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* LISTA DE ATIVIDADES CRONOLÓGICA */}
        {filteredTimeline.map((item) => (
          <View key={item.id} style={styles.eventCard}>
            <View style={styles.eventHeaderRow}>
              <View style={styles.eventCategoryBadge}>
                <Text style={styles.eventCategoryEmoji}>
                  {item.category === 'feeding'
                    ? '🍼'
                    : item.category === 'diaper'
                    ? '🧷'
                    : item.category === 'sleep'
                    ? '🌙'
                    : '🤸'}
                </Text>
                <Text style={styles.eventTitle}>{item.title}</Text>
              </View>

              <Text style={styles.eventTime}>{formatRelativeDate(item.timestamp)}</Text>
            </View>

            <Text style={styles.eventSubtitle}>{item.subtitle}</Text>

            {item.alert && (
              <View style={styles.eventAlertBox}>
                <AlertTriangle size={14} color="#D97706" />
                <Text style={styles.eventAlertText}>{item.alert}</Text>
              </View>
            )}

            {item.detail && <Text style={styles.eventDetailText}>"{item.detail}"</Text>}

            <View style={styles.eventFooterRow}>
              <Text style={styles.eventAuthorText}>Registrado por {item.author}</Text>
            </View>
          </View>
        ))}
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  babyAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  babyName: {
    fontSize: 16.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
  },
  babyAgeSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#D4E5DB',
  },
  shareBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 50,
  },
  statusCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.md,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  statusCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusCardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusTimeText: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statusSubDetail: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  wakeWindowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  wakeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wakeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wakeCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  wakeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  wakeBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  wakeNumbersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  wakeNumberBig: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  wakeNumberSub: {
    fontSize: 11.5,
    color: Colors.textMuted,
    marginTop: 1,
  },
  wakeIdealCol: {
    alignItems: 'flex-end',
  },
  wakeIdealLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  wakeIdealVal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3EDE2',
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Radius.full,
  },
  wakeGuidanceText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  ongoingSleepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: Radius.md,
  },
  ongoingSleepLabel: {
    fontSize: 11,
    color: Colors.primaryDark,
  },
  ongoingSleepVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  finishSleepBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  finishSleepBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickActionsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    borderRadius: Radius.xl,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    ...Shadows.subtle,
  },
  actionBtnEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  actionBtnTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  actionBtnSub: {
    fontSize: 9.5,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  summary24hCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  summary24hTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  summaryStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatVal: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  summaryStatLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  summaryStatNote: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F0ECE4',
  },
  timelineSectionHeader: {
    marginBottom: 12,
  },
  filterPillsScroll: {
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE6DC',
    marginBottom: 10,
    ...Shadows.subtle,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventCategoryEmoji: {
    fontSize: 16,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  eventTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  eventSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  eventAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: Radius.sm,
    marginTop: 6,
  },
  eventAlertText: {
    fontSize: 11,
    color: '#B45309',
    fontWeight: '600',
    flex: 1,
  },
  eventDetailText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textMuted,
    marginTop: 6,
  },
  eventFooterRow: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F7F3EC',
  },
  eventAuthorText: {
    fontSize: 10.5,
    color: Colors.textMuted,
  },
});
