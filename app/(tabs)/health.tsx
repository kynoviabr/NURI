import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Phone,
  ChevronRight,
  Syringe,
  Activity,
  HeartPulse,
  AlertTriangle,
  Plus,
  Scale,
  Pill,
  Thermometer,
  FileText,
  CreditCard,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { classifyTemperature, formatRelativeDate } from '../../src/utils/babyCalculations';

export default function HealthScreen() {
  const router = useRouter();
  const { baby, vaccines, markVaccineAsApplied, growthLogs, medicationLogs, appointments } = useApp();

  const [activeTab, setActiveTab] = useState<'vaccines' | 'growth' | 'meds' | 'appointments'>('vaccines');
  const [vaccineFilter, setVaccineFilter] = useState<'all' | 'pending' | 'applied'>('all');

  const filteredVaccines = vaccines.filter((v) => {
    if (vaccineFilter === 'pending') return v.status === 'pending';
    if (vaccineFilter === 'applied') return v.status === 'applied';
    return true;
  });

  const appliedCount = vaccines.filter((v) => v.status === 'applied').length;
  const pendingCount = vaccines.filter((v) => v.status === 'pending').length;

  const latestGrowth = growthLogs.length > 0 ? growthLogs[0] : null;

  const handleApplyVaccine = (recordId: string, vaccineName: string) => {
    Alert.alert(
      'Confirmar Aplicação',
      `Marcar a vacina ${vaccineName} como aplicada hoje?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => markVaccineAsApplied(recordId, 'Posto de Saúde Municipal'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER PRINCIPAL */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Central de Saúde do Bebê</Text>
          <Text style={styles.headerSubtitle}>Controle pediátrico 360° de {baby.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.reportHeaderBtn}
          onPress={() => router.push('/modals/medical-report')}
          activeOpacity={0.8}
        >
          <FileText size={15} color={Colors.primary} />
          <Text style={styles.reportHeaderBtnText}>Laudo</Text>
        </TouchableOpacity>
      </View>

      {/* SELETOR DE ABAS DE SAÚDE */}
      <View style={styles.tabBarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'vaccines' && styles.tabButtonActive]}
            onPress={() => setActiveTab('vaccines')}
          >
            <Syringe size={14} color={activeTab === 'vaccines' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.tabButtonText, activeTab === 'vaccines' && styles.tabButtonTextActive]}>
              Vacinas ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'growth' && styles.tabButtonActive]}
            onPress={() => setActiveTab('growth')}
          >
            <Activity size={14} color={activeTab === 'growth' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.tabButtonText, activeTab === 'growth' && styles.tabButtonTextActive]}>
              Curvas OMS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'meds' && styles.tabButtonActive]}
            onPress={() => setActiveTab('meds')}
          >
            <Pill size={14} color={activeTab === 'meds' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.tabButtonText, activeTab === 'meds' && styles.tabButtonTextActive]}>
              Remédios & Febre
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'appointments' && styles.tabButtonActive]}
            onPress={() => setActiveTab('appointments')}
          >
            <HeartPulse size={14} color={activeTab === 'appointments' ? '#FFFFFF' : Colors.textSecondary} />
            <Text style={[styles.tabButtonText, activeTab === 'appointments' && styles.tabButtonTextActive]}>
              Consultas & Convênio
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PASSE ESCOLAR E ALERGIAS (SEMPRE ACESSÍVEL NO TOPO) */}
        <TouchableOpacity
          style={styles.schoolEmergencyCard}
          onPress={() => router.push('/modals/caregiver-card')}
          activeOpacity={0.85}
        >
          <View style={styles.emergencyIconWrap}>
            <ShieldAlert size={20} color={Colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyCardHeading}>Passe Escolar & Alergias</Text>
            <Text style={styles.emergencyCardDesc}>
              Tipo {baby.blood_type || 'O+'} • Alergias: {baby.allergies.join(', ') || 'Nenhuma'}
            </Text>
          </View>
          <ChevronRight size={16} color={Colors.secondary} />
        </TouchableOpacity>

        {/* ============================================================ */}
        {/* ABA 1: VACINAS */}
        {/* ============================================================ */}
        {activeTab === 'vaccines' && (
          <View>
            {/* RESUMO DE COBERTURA */}
            <View style={styles.vaccineHeroBox}>
              <View style={styles.vaccineHeroInfo}>
                <Text style={styles.vaccineHeroTitle}>Calendário Nacional (SUS & Particular)</Text>
                <Text style={styles.vaccineHeroSub}>
                  {appliedCount} doses aplicadas • {pendingCount} doses pendentes
                </Text>
              </View>

              <View style={styles.vaccineFiltersRow}>
                <TouchableOpacity
                  style={[styles.vaccineFilterChip, vaccineFilter === 'all' && styles.vaccineFilterChipActive]}
                  onPress={() => setVaccineFilter('all')}
                >
                  <Text style={[styles.vaccineFilterChipText, vaccineFilter === 'all' && styles.vaccineFilterChipTextActive]}>
                    Todas
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.vaccineFilterChip, vaccineFilter === 'pending' && styles.vaccineFilterChipActive]}
                  onPress={() => setVaccineFilter('pending')}
                >
                  <Text style={[styles.vaccineFilterChipText, vaccineFilter === 'pending' && styles.vaccineFilterChipTextActive]}>
                    Pendentes ({pendingCount})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.vaccineFilterChip, vaccineFilter === 'applied' && styles.vaccineFilterChipActive]}
                  onPress={() => setVaccineFilter('applied')}
                >
                  <Text style={[styles.vaccineFilterChipText, vaccineFilter === 'applied' && styles.vaccineFilterChipTextActive]}>
                    Tomadas ({appliedCount})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* LISTA DE VACINAS */}
            <View style={styles.vaccineListGap}>
              {filteredVaccines.map((record) => {
                const isApplied = record.status === 'applied';

                return (
                  <View key={record.id} style={styles.vaccineCardItem}>
                    <View style={styles.vaccineRowMain}>
                      <View style={[styles.vaccineDot, isApplied && styles.vaccineDotApplied]}>
                        <Syringe size={14} color={isApplied ? Colors.success : Colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.vaccineTitleText}>{record.vaccine.name}</Text>
                          {record.vaccine.is_private_clinic && (
                            <View style={styles.privateClinicBadge}>
                              <Text style={styles.privateClinicText}>Particular</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.vaccineDiseaseSubtitle}>{record.vaccine.target_disease}</Text>
                      </View>

                      {isApplied ? (
                        <View style={styles.appliedCheckBadge}>
                          <CheckCircle2 size={12} color={Colors.success} strokeWidth={2.5} />
                          <Text style={styles.appliedCheckText}>Tomada</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.recordDoseBtn}
                          onPress={() => handleApplyVaccine(record.id, record.vaccine.name)}
                          activeOpacity={0.8}
                        >
                          <Clock size={12} color={Colors.accent} />
                          <Text style={styles.recordDoseText}>Registrar</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.vaccineCardFooter}>
                      <Text style={styles.vaccineFooterInfo}>
                        {isApplied
                          ? `Aplicada em: ${record.applied_date} • ${record.clinic_or_post}`
                          : `Idade recomendada: ${record.vaccine.recommended_age_months === 0 ? 'Ao nascer' : `${record.vaccine.recommended_age_months} meses`}`}
                      </Text>
                      {record.batch_number && (
                        <Text style={styles.batchLabelText}>Lote: {record.batch_number}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* ABA 2: CRESCIMENTO & CURVAS OMS */}
        {/* ============================================================ */}
        {activeTab === 'growth' && (
          <View>
            <View style={styles.sectionActionBar}>
              <View>
                <Text style={styles.sectionMainTitle}>Curvas de Crescimento OMS</Text>
                <Text style={styles.sectionSubtitle}>Histórico ponderal e percentis oficiais</Text>
              </View>
              <TouchableOpacity
                style={styles.addPrimaryBtn}
                onPress={() => router.push('/modals/add-growth')}
                activeOpacity={0.85}
              >
                <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.addPrimaryBtnText}>Nova Medição</Text>
              </TouchableOpacity>
            </View>

            {/* CARTÃO DA ÚLTIMA MEDIÇÃO */}
            {latestGrowth && (
              <View style={styles.latestGrowthCard}>
                <View style={styles.latestGrowthHeader}>
                  <Text style={styles.latestGrowthTag}>ÚLTIMA AVALIAÇÃO</Text>
                  <Text style={styles.latestGrowthDate}>{latestGrowth.recorded_date}</Text>
                </View>

                <View style={styles.growthMetricsRow}>
                  <View style={styles.growthMetricCol}>
                    <Text style={styles.growthMetricVal}>{latestGrowth.weight_kg.toFixed(2)} <Text style={styles.growthMetricUnit}>kg</Text></Text>
                    <Text style={styles.growthMetricLabel}>Peso Atual</Text>
                    <View style={styles.growthPill}>
                      <Text style={styles.growthPillText}>{latestGrowth.percentile_weight || 'p50 OMS'}</Text>
                    </View>
                  </View>

                  <View style={styles.metricVertDivider} />

                  <View style={styles.growthMetricCol}>
                    <Text style={styles.growthMetricVal}>{latestGrowth.height_cm.toFixed(1)} <Text style={styles.growthMetricUnit}>cm</Text></Text>
                    <Text style={styles.growthMetricLabel}>Estatura</Text>
                    <View style={styles.growthPill}>
                      <Text style={styles.growthPillText}>Adequado</Text>
                    </View>
                  </View>

                  <View style={styles.metricVertDivider} />

                  <View style={styles.growthMetricCol}>
                    <Text style={styles.growthMetricVal}>{latestGrowth.head_circumference_cm ? `${latestGrowth.head_circumference_cm} cm` : '--'}</Text>
                    <Text style={styles.growthMetricLabel}>Cefálico</Text>
                    <View style={styles.growthPill}>
                      <Text style={styles.growthPillText}>Normal</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* TABELA DE HISTÓRICO */}
            <Text style={styles.historyListTitle}>Histórico de Pesagens</Text>
            <View style={styles.growthHistoryCard}>
              {growthLogs.map((log) => (
                <View key={log.id} style={styles.growthHistoryRow}>
                  <View style={styles.growthDateBadge}>
                    <Text style={styles.growthDateBadgeText}>{log.recorded_date}</Text>
                  </View>
                  <View style={{ flex: 1, paddingHorizontal: 8 }}>
                    <Text style={styles.growthWeightBig}>{log.weight_kg.toFixed(2)} kg • {log.height_cm.toFixed(1)} cm</Text>
                    <Text style={styles.growthNotesText}>{log.notes || 'Medição de rotina'}</Text>
                  </View>
                  <View style={styles.percentileBadgeBox}>
                    <Text style={styles.percentileBadgeText}>{log.percentile_weight || 'p50'}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* ABA 3: REMÉDIOS & FEBRE */}
        {/* ============================================================ */}
        {activeTab === 'meds' && (
          <View>
            <View style={styles.sectionActionBar}>
              <View>
                <Text style={styles.sectionMainTitle}>Controle de Febre & Remédios</Text>
                <Text style={styles.sectionSubtitle}>Horários e alertas da próxima dose</Text>
              </View>
              <TouchableOpacity
                style={styles.addPrimaryBtn}
                onPress={() => router.push('/modals/add-medication')}
                activeOpacity={0.85}
              >
                <Plus size={15} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.addPrimaryBtnText}>Registrar Dose</Text>
              </TouchableOpacity>
            </View>

            {/* ALERTA DE PRÓXIMA DOSE PROGRAMADA */}
            {medicationLogs.length > 0 && medicationLogs[0].next_dose_at && (
              <View style={styles.nextDoseAlertCard}>
                <Clock size={20} color={Colors.accent} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.nextDoseHeading}>Próxima Dose Programada</Text>
                  <Text style={styles.nextDoseDetail}>
                    {medicationLogs[0].medicine_name} ({medicationLogs[0].dosage}) às{' '}
                    {new Date(medicationLogs[0].next_dose_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            )}

            {/* HISTÓRICO DE DOSES E TEMPERATURAS */}
            <Text style={styles.historyListTitle}>Doses e Episódios Registrados</Text>
            <View style={styles.medsHistoryList}>
              {medicationLogs.map((m) => {
                const tempClass = m.temperature_celsius ? classifyTemperature(m.temperature_celsius) : null;

                return (
                  <View key={m.id} style={styles.medicationCardItem}>
                    <View style={styles.medCardTop}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Pill size={16} color={Colors.primary} />
                        <Text style={styles.medNameText}>{m.medicine_name}</Text>
                        <Text style={styles.medDoseTag}>{m.dosage}</Text>
                      </View>

                      {tempClass && (
                        <View style={[styles.tempBadgePill, { backgroundColor: `${tempClass.color}15` }]}>
                          <Thermometer size={12} color={tempClass.color} />
                          <Text style={[styles.tempBadgeText, { color: tempClass.color }]}>
                            {m.temperature_celsius} ºC
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.medReasonText}>
                      Motivo: {m.reason || 'Febre'} • Ministrado por: {m.administered_by}
                    </Text>

                    {m.notes && <Text style={styles.medNotesSmall}>{m.notes}</Text>}

                    <View style={styles.medCardFooter}>
                      <Text style={styles.medTimestampText}>
                        Administrado: {new Date(m.administered_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ({formatRelativeDate(m.administered_at)})
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ============================================================ */}
        {/* ABA 4: CONSULTAS & CONVÊNIO */}
        {/* ============================================================ */}
        {activeTab === 'appointments' && (
          <View>
            {/* CARTÃO DO PLANO DE SAÚDE */}
            <View style={styles.insuranceCard}>
              <View style={styles.insuranceHeader}>
                <CreditCard size={18} color={Colors.primary} />
                <Text style={styles.insuranceTitle}>Plano de Saúde & Emergência</Text>
              </View>
              <Text style={styles.insurancePlanName}>{baby.health_insurance?.plan_name || 'Bradesco Saúde Top'}</Text>
              <Text style={styles.insuranceCardNum}>Carteirinha: {baby.health_insurance?.card_number || '789.456.123.001'}</Text>
              <Text style={styles.insuranceHolder}>Titular: {baby.health_insurance?.holder_name || 'Lucas Silva'}</Text>
              <View style={styles.insuranceFooterRow}>
                <Text style={styles.insurancePhone}>Emergência 24h: {baby.health_insurance?.emergency_phone || '0800-701-2700'}</Text>
              </View>
            </View>

            {/* PEDIATRA DE REFERÊNCIA */}
            <View style={styles.doctorCardFull}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={styles.doctorEmojiCircle}>
                  <Text style={{ fontSize: 22 }}>🩺</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.doctorRoleSub}>PEDIATRA DE REFERÊNCIA</Text>
                  <Text style={styles.doctorNameHeading}>Dra. Camila Nogueira</Text>
                  <Text style={styles.doctorClinicSub}>Clínica Pediátrica Crescer • CRM 142.890</Text>
                </View>
                <TouchableOpacity style={styles.callDoctorBtnCircle}>
                  <Phone size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* HISTÓRICO DE CONSULTAS PEDIÁTRICAS */}
            <Text style={styles.historyListTitle}>Histórico de Consultas de Rotina</Text>
            {appointments.map((appt) => (
              <View key={appt.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.appointmentDoctor}>{appt.doctor_name} ({appt.specialty})</Text>
                  <Text style={styles.appointmentDate}>{appt.appointment_date}</Text>
                </View>
                {appt.doctor_diagnosis_notes && (
                  <View style={styles.diagnosisBox}>
                    <Text style={styles.diagnosisLabel}>DIAGNÓSTICO E ORIENTAÇÕES:</Text>
                    <Text style={styles.diagnosisText}>{appt.doctor_diagnosis_notes}</Text>
                  </View>
                )}
                {appt.prescription_notes && (
                  <View style={styles.prescBox}>
                    <Text style={styles.prescLabel}>RECEITAS E RECOMENDAÇÕES:</Text>
                    <Text style={styles.prescText}>{appt.prescription_notes}</Text>
                  </View>
                )}
              </View>
            ))}
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
  reportHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#D4E5DB',
  },
  reportHeaderBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: 8,
  },
  tabsScroll: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFE9',
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 50,
  },
  schoolEmergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F4',
    padding: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#FCDFD7',
    marginBottom: Spacing.md,
    gap: 10,
    ...Shadows.subtle,
  },
  emergencyIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCDFD7',
  },
  emergencyCardHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.secondaryDark,
  },
  emergencyCardDesc: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  sectionActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  vaccineHeroBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.subtle,
  },
  vaccineHeroInfo: {
    marginBottom: 12,
  },
  vaccineHeroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  vaccineHeroSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  vaccineFiltersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vaccineFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFE9',
  },
  vaccineFilterChipActive: {
    backgroundColor: Colors.primary,
  },
  vaccineFilterChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  vaccineFilterChipTextActive: {
    color: '#FFFFFF',
  },
  vaccineListGap: {
    gap: 10,
  },
  vaccineCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  vaccineRowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  vaccineDot: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaccineDotApplied: {
    backgroundColor: Colors.successLight,
  },
  vaccineTitleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  privateClinicBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
  },
  privateClinicText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#D97706',
  },
  vaccineDiseaseSubtitle: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  appliedCheckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  appliedCheckText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  recordDoseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#FBE8CC',
  },
  recordDoseText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
  },
  vaccineCardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F6F2EC',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vaccineFooterInfo: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  batchLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  latestGrowthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.card,
  },
  latestGrowthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  latestGrowthTag: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  latestGrowthDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  growthMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  growthMetricCol: {
    alignItems: 'center',
    flex: 1,
  },
  growthMetricVal: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  growthMetricUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  growthMetricLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  growthPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    marginTop: 4,
  },
  growthPillText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  metricVertDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#F0EAE0',
  },
  historyListTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  growthHistoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  growthHistoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFE6',
  },
  growthDateBadge: {
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  growthDateBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  growthWeightBig: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  growthNotesText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  percentileBadgeBox: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  percentileBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  nextDoseAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBF0',
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#FDE8B3',
    marginBottom: 14,
  },
  nextDoseHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  nextDoseDetail: {
    fontSize: 12,
    color: Colors.textPrimary,
    marginTop: 1,
  },
  medsHistoryList: {
    gap: 10,
  },
  medicationCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  medCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  medDoseTag: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
  },
  tempBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  tempBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  medReasonText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  medNotesSmall: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  medCardFooter: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  medTimestampText: {
    fontSize: 10.5,
    color: Colors.textMuted,
  },
  insuranceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.card,
  },
  insuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  insuranceTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  insurancePlanName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  insuranceCardNum: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  insuranceHolder: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  insuranceFooterRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0EAE0',
  },
  insurancePhone: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  doctorCardFull: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 14,
    ...Shadows.subtle,
  },
  doctorEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorRoleSub: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  doctorNameHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  doctorClinicSub: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  callDoctorBtnCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    ...Shadows.subtle,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentDoctor: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  appointmentDate: {
    fontSize: 11.5,
    color: Colors.textMuted,
  },
  diagnosisBox: {
    backgroundColor: '#FAF7F2',
    padding: 8,
    borderRadius: Radius.xs,
    marginBottom: 6,
  },
  diagnosisLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  diagnosisText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  prescBox: {
    backgroundColor: '#F3F9F5',
    padding: 8,
    borderRadius: Radius.xs,
  },
  prescLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  prescText: {
    fontSize: 12,
    color: Colors.primaryDark,
    lineHeight: 16,
  },
});
