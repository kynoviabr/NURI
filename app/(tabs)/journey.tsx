import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  Camera,
  ChevronRight,
  Plus,
  Heart,
  Activity,
  CheckCircle2,
  Clock,
  Briefcase,
  Timer,
  Calendar,
  Share2,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateGestation, calculateBabyAge, formatRelativeDate } from '../../src/utils/babyCalculations';

export default function JourneyScreen() {
  const router = useRouter();
  const { baby, ultrasounds, bellyPhotos, maternalLogs, maternityBag, toggleBagItem } = useApp();

  const isBorn = baby.status === 'born';
  const gestationInfo = baby.due_date ? calculateGestation(baby.due_date) : calculateGestation('2027-01-20');
  const ageInfo = isBorn && baby.birth_date ? calculateBabyAge(baby.birth_date) : null;

  // Sub-abas do Módulo Gestação
  const [gestationTab, setGestationTab] = useState<'week' | 'ultrasound' | 'belly' | 'health' | 'bag'>('week');
  const [selectedBagCategory, setSelectedBagCategory] = useState<'baby' | 'mom' | 'docs'>('baby');

  const filteredBagItems = maternityBag.filter((item) => {
    if (selectedBagCategory === 'baby') return item.category === 'baby';
    if (selectedBagCategory === 'mom') return item.category === 'mom';
    return item.category === 'docs';
  });

  const packedCount = maternityBag.filter((i) => i.is_packed).length;
  const totalBagItems = maternityBag.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER PRINCIPAL */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {isBorn ? 'Jornada do Bebê & Gravidez' : 'Central da Gestação'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isBorn
              ? `Evolução de ${baby.name} e memórias da gestação`
              : `Acompanhamento semana a semana de Maya`}
          </Text>
        </View>

        {/* BOTÃO CONTADOR DE CONTRAÇÕES (Acesso Rápido) */}
        <TouchableOpacity
          style={styles.contractionBtn}
          onPress={() => router.push('/modals/contraction-timer')}
          activeOpacity={0.8}
        >
          <Timer size={14} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.contractionBtnText}>Contrações</Text>
        </TouchableOpacity>
      </View>

      {/* SELETOR DE SUB-ABAS DA GESTAÇÃO */}
      <View style={styles.subTabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subTabsScroll}>
          <TouchableOpacity
            style={[styles.subTabBtn, gestationTab === 'week' && styles.subTabBtnActive]}
            onPress={() => setGestationTab('week')}
          >
            <Sparkles size={13} color={gestationTab === 'week' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.subTabBtnText, gestationTab === 'week' && styles.subTabBtnTextActive]}>
              Semana a Semana
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabBtn, gestationTab === 'ultrasound' && styles.subTabBtnActive]}
            onPress={() => setGestationTab('ultrasound')}
          >
            <Camera size={13} color={gestationTab === 'ultrasound' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.subTabBtnText, gestationTab === 'ultrasound' && styles.subTabBtnTextActive]}>
              Ultrassons ({ultrasounds.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabBtn, gestationTab === 'belly' && styles.subTabBtnActive]}
            onPress={() => setGestationTab('belly')}
          >
            <Heart size={13} color={gestationTab === 'belly' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.subTabBtnText, gestationTab === 'belly' && styles.subTabBtnTextActive]}>
              Diário da Barriga ({bellyPhotos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabBtn, gestationTab === 'health' && styles.subTabBtnActive]}
            onPress={() => setGestationTab('health')}
          >
            <Activity size={13} color={gestationTab === 'health' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.subTabBtnText, gestationTab === 'health' && styles.subTabBtnTextActive]}>
              Pré-Natal da Mãe
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabBtn, gestationTab === 'bag' && styles.subTabBtnActive]}
            onPress={() => setGestationTab('bag')}
          >
            <Briefcase size={13} color={gestationTab === 'bag' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.subTabBtnText, gestationTab === 'bag' && styles.subTabBtnTextActive]}>
              Mala Maternidade
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ============================================================ */}
        {/* ABA 1: SEMANA A SEMANA (ANATÔMICO) */}
        {/* ============================================================ */}
        {gestationTab === 'week' && (
          <View>
            {/* HERO DA SEMANA ATUAL */}
            <View style={styles.weekHeroCard}>
              <View style={styles.weekTopRow}>
                <View>
                  <Text style={styles.weekMiniLabel}>VOCÊ ESTÁ NA</Text>
                  <Text style={styles.weekBigTitle}>{gestationInfo.currentWeek}ª Semana</Text>
                  <Text style={styles.weekDaysSub}>Dia {gestationInfo.currentDay} de 7 da semana</Text>
                </View>
                <View style={styles.fruitCard}>
                  <Text style={styles.fruitEmoji}>🥑</Text>
                  <Text style={styles.fruitName}>{gestationInfo.fruitComparison}</Text>
                </View>
              </View>

              {/* MEDIDAS ESTIMADAS DO FETO */}
              <View style={styles.fetalStatsRow}>
                <View style={styles.fetalStatItem}>
                  <Text style={styles.fetalStatVal}>~28 cm</Text>
                  <Text style={styles.fetalStatSub}>Comprimento</Text>
                </View>
                <View style={styles.fetalDivider} />
                <View style={styles.fetalStatItem}>
                  <Text style={styles.fetalStatVal}>~450 g</Text>
                  <Text style={styles.fetalStatSub}>Peso Fetal</Text>
                </View>
                <View style={styles.fetalDivider} />
                <View style={styles.fetalStatItem}>
                  <Text style={styles.fetalStatVal}>126 dias</Text>
                  <Text style={styles.fetalStatSub}>Até o Parto</Text>
                </View>
              </View>

              {/* BARRA DE PROGRESSO DOS 9 MESES */}
              <View style={styles.progressWrap}>
                <View style={styles.progBarBg}>
                  <View style={[styles.progBarFill, { width: `${gestationInfo.percentage}%` }]} />
                </View>
                <View style={styles.progLabels}>
                  <Text style={styles.progLabelText}>1º Trimestre</Text>
                  <Text style={styles.progLabelCenter}>{gestationInfo.percentage}% completo</Text>
                  <Text style={styles.progLabelText}>Parto (40s)</Text>
                </View>
              </View>
            </View>

            {/* O QUE ESTÁ ACONTECENDO ESTA SEMANA */}
            <View style={styles.developmentBlock}>
              <View style={styles.blockTitleRow}>
                <Sparkles size={16} color={Colors.accent} />
                <Text style={styles.blockTitle}>Desenvolvimento Fetal na 22ª Semana</Text>
              </View>
              <Text style={styles.blockParagraph}>
                O feto já consegue ouvir sons do mundo exterior! Sua voz, o pulsar do seu coração e músicas suaves são percebidos com clareza. As sobrancelhas e pálpebras já estão totalmente formadas.
              </Text>
              <View style={styles.tipPartnerBox}>
                <Text style={styles.tipPartnerTitle}>💡 DICA PARA O PARCEIRO / PAPAI:</Text>
                <Text style={styles.tipPartnerDesc}>
                  Converse com a barriga diariamente. O bebê começará a reconhecer o timbre da sua voz antes mesmo de nascer!
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* ABA 2: GALERIA DE ULTRASSONS */}
        {/* ============================================================ */}
        {gestationTab === 'ultrasound' && (
          <View>
            <View style={styles.sectionActionBar}>
              <View>
                <Text style={styles.sectionMainTitle}>Cofre de Ultrassons</Text>
                <Text style={styles.sectionSubtitle}>Fotos, laudos e batimentos de cada ecografia</Text>
              </View>
              <TouchableOpacity
                style={styles.addPrimaryBtn}
                onPress={() => router.push('/modals/add-ultrasound')}
                activeOpacity={0.85}
              >
                <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.addPrimaryBtnText}>Novo Exame</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ultrasoundList}>
              {ultrasounds.map((exam) => (
                <View key={exam.id} style={styles.ultrasoundCard}>
                  <View style={styles.ultrasoundHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ultrasoundName}>{exam.exam_name}</Text>
                      <Text style={styles.ultrasoundMeta}>
                        {exam.gestational_week}ª Semana • {exam.exam_date}
                      </Text>
                    </View>
                    {exam.heart_rate_bpm && (
                      <View style={styles.bpmBadge}>
                        <Heart size={12} color={Colors.secondary} fill={Colors.secondary} />
                        <Text style={styles.bpmText}>{exam.heart_rate_bpm} bpm</Text>
                      </View>
                    )}
                  </View>

                  <Image source={{ uri: exam.photo_url }} style={styles.ultrasoundImg} resizeMode="cover" />

                  {exam.doctor_report && (
                    <View style={styles.examReportBox}>
                      <Text style={styles.examReportTitle}>LAUDO DO EXAMINADOR:</Text>
                      <Text style={styles.examReportText}>{exam.doctor_report}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* ABA 3: DIÁRIO DA BARRIGA (EVOLUÇÃO) */}
        {/* ============================================================ */}
        {gestationTab === 'belly' && (
          <View>
            <View style={styles.sectionActionBar}>
              <View>
                <Text style={styles.sectionMainTitle}>Evolução da Barriga</Text>
                <Text style={styles.sectionSubtitle}>A curva mais linda da sua vida semana a semana</Text>
              </View>
              <TouchableOpacity
                style={styles.addPrimaryBtn}
                onPress={() => router.push('/modals/new-moment')}
                activeOpacity={0.85}
              >
                <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.addPrimaryBtnText}>Foto da Semana</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bellyGrid}>
              {bellyPhotos.map((photo) => (
                <View key={photo.id} style={styles.bellyCard}>
                  <Image source={{ uri: photo.photo_url }} style={styles.bellyPhotoImg} resizeMode="cover" />
                  <View style={styles.bellyBadgePill}>
                    <Text style={styles.bellyBadgeText}>{photo.week}ª SEMANA</Text>
                  </View>
                  {photo.caption && (
                    <Text style={styles.bellyCaptionText} numberOfLines={2}>{photo.caption}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* ABA 4: PRÉ-NATAL & SINTOMAS */}
        {/* ============================================================ */}
        {gestationTab === 'health' && (
          <View>
            <View style={styles.sectionActionBar}>
              <View>
                <Text style={styles.sectionMainTitle}>Saúde da Gestante</Text>
                <Text style={styles.sectionSubtitle}>Pressão, ganho de peso e sintomas</Text>
              </View>
              <TouchableOpacity
                style={styles.addPrimaryBtn}
                onPress={() => router.push('/modals/maternal-health')}
                activeOpacity={0.85}
              >
                <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.addPrimaryBtnText}>Registrar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.maternalLogsList}>
              {maternalLogs.map((log) => (
                <View key={log.id} style={styles.maternalCard}>
                  <View style={styles.maternalCardHeader}>
                    <Text style={styles.maternalDate}>{log.recorded_date}</Text>
                    {log.blood_pressure && (
                      <View style={styles.bpBadge}>
                        <Text style={styles.bpBadgeText}>PA: {log.blood_pressure} mmHg</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.maternalMetricsRow}>
                    <View style={styles.maternalMetricItem}>
                      <Text style={styles.maternalMetricVal}>{log.weight_kg ? `${log.weight_kg} kg` : '--'}</Text>
                      <Text style={styles.maternalMetricLabel}>Peso da Mãe</Text>
                    </View>
                    <View style={styles.maternalMetricItem}>
                      <Text style={styles.maternalMetricVal}>{log.fasting_blood_glucose ? `${log.fasting_blood_glucose} mg/dL` : '85 mg/dL'}</Text>
                      <Text style={styles.maternalMetricLabel}>Glicemia</Text>
                    </View>
                  </View>

                  {log.symptoms.length > 0 && (
                    <View style={styles.symptomsRowTags}>
                      {log.symptoms.map((s, i) => (
                        <View key={i} style={styles.symptomTagItem}>
                          <Text style={styles.symptomTagItemText}>{s}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {log.notes && <Text style={styles.maternalNotes}>{log.notes}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* ABA 5: MALA DA MATERNIDADE */}
        {/* ============================================================ */}
        {gestationTab === 'bag' && (
          <View>
            <View style={styles.bagHeaderBox}>
              <View>
                <Text style={styles.sectionMainTitle}>Mala da Maternidade</Text>
                <Text style={styles.sectionSubtitle}>
                  {packedCount} de {totalBagItems} itens prontos na mala
                </Text>
              </View>

              <View style={styles.bagFilterTabs}>
                <TouchableOpacity
                  style={[styles.bagFilterBtn, selectedBagCategory === 'baby' && styles.bagFilterBtnActive]}
                  onPress={() => setSelectedBagCategory('baby')}
                >
                  <Text style={[styles.bagFilterBtnText, selectedBagCategory === 'baby' && styles.bagFilterBtnTextActive]}>
                    Bebê
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bagFilterBtn, selectedBagCategory === 'mom' && styles.bagFilterBtnActive]}
                  onPress={() => setSelectedBagCategory('mom')}
                >
                  <Text style={[styles.bagFilterBtnText, selectedBagCategory === 'mom' && styles.bagFilterBtnTextActive]}>
                    Mamãe
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bagFilterBtn, selectedBagCategory === 'docs' && styles.bagFilterBtnActive]}
                  onPress={() => setSelectedBagCategory('docs')}
                >
                  <Text style={[styles.bagFilterBtnText, selectedBagCategory === 'docs' && styles.bagFilterBtnTextActive]}>
                    Documentos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* LISTA DE ITENS COM CHECKBOX */}
            <View style={styles.bagItemsList}>
              {filteredBagItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.bagItemRow, item.is_packed && styles.bagItemRowPacked]}
                  onPress={() => toggleBagItem(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkboxCircle, item.is_packed && styles.checkboxCircleChecked]}>
                    {item.is_packed && <CheckCircle2 size={16} color="#FFFFFF" strokeWidth={2.5} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bagItemName, item.is_packed && styles.bagItemNamePacked]}>
                      {item.name}
                    </Text>
                    {item.quantity && <Text style={styles.bagItemQty}>{item.quantity}</Text>}
                  </View>
                  <Text style={[styles.packStatusText, item.is_packed && styles.packStatusTextPacked]}>
                    {item.is_packed ? 'Na mala' : 'Pendente'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  contractionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    ...Shadows.subtle,
  },
  contractionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subTabBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  subTabsScroll: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  subTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFE9',
  },
  subTabBtnActive: {
    backgroundColor: Colors.primary,
  },
  subTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  subTabBtnTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 50,
  },
  weekHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.card,
  },
  weekTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weekMiniLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  weekBigTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  weekDaysSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  fruitCard: {
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#FBE8CC',
  },
  fruitEmoji: {
    fontSize: 26,
  },
  fruitName: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  fetalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FAF7F2',
    padding: 12,
    borderRadius: Radius.md,
    marginBottom: 16,
  },
  fetalStatItem: {
    alignItems: 'center',
  },
  fetalStatVal: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  fetalStatSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  fetalDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#ECE4D6',
  },
  progressWrap: {
    marginTop: 2,
  },
  progBarBg: {
    height: 8,
    backgroundColor: '#F3EFE9',
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  progLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progLabelText: {
    fontSize: 10.5,
    color: Colors.textMuted,
  },
  progLabelCenter: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  developmentBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  blockTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  blockParagraph: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  tipPartnerBox: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#D4E5DB',
  },
  tipPartnerTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  tipPartnerDesc: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  sectionActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionMainTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  addPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    ...Shadows.subtle,
  },
  addPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ultrasoundList: {
    gap: 14,
  },
  ultrasoundCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  ultrasoundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ultrasoundName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  ultrasoundMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  bpmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  bpmText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  ultrasoundImg: {
    width: '100%',
    height: 220,
    borderRadius: Radius.md,
    marginBottom: 10,
  },
  examReportBox: {
    backgroundColor: '#FAF7F2',
    padding: 10,
    borderRadius: Radius.md,
  },
  examReportTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  examReportText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  bellyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bellyCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingBottom: 8,
    ...Shadows.subtle,
  },
  bellyPhotoImg: {
    width: '100%',
    height: 180,
  },
  bellyBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    margin: 8,
    marginBottom: 2,
  },
  bellyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondaryDark,
  },
  bellyCaptionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    paddingHorizontal: 8,
    marginTop: 2,
  },
  maternalLogsList: {
    gap: 10,
  },
  maternalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  maternalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maternalDate: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bpBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  bpBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.danger,
  },
  maternalMetricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  maternalMetricItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  maternalMetricVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  maternalMetricLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  symptomsRowTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  symptomTagItem: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  symptomTagItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondaryDark,
  },
  maternalNotes: {
    fontSize: 11.5,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  bagHeaderBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.subtle,
  },
  bagFilterTabs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  bagFilterBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F3EFE9',
  },
  bagFilterBtnActive: {
    backgroundColor: Colors.primary,
  },
  bagFilterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  bagFilterBtnTextActive: {
    color: '#FFFFFF',
  },
  bagItemsList: {
    gap: 8,
  },
  bagItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    ...Shadows.subtle,
  },
  bagItemRowPacked: {
    backgroundColor: '#FAFDFB',
    borderColor: '#D4E5DB',
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCircleChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  bagItemName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bagItemNamePacked: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  bagItemQty: {
    fontSize: 11.5,
    color: Colors.textMuted,
    marginTop: 1,
  },
  packStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  packStatusTextPacked: {
    color: Colors.success,
    fontWeight: '700',
  },
});
