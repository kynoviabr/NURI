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
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';

export default function HealthScreen() {
  const router = useRouter();
  const { baby, vaccines, markVaccineAsApplied } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'applied'>('all');

  const filteredVaccines = vaccines.filter((v) => {
    if (filter === 'pending') return v.status === 'pending';
    if (filter === 'applied') return v.status === 'applied';
    return true;
  });

  const appliedCount = vaccines.filter((v) => v.status === 'applied').length;
  const pendingCount = vaccines.filter((v) => v.status === 'pending').length;

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
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Caderneta de Saúde</Text>
          <Text style={styles.headerSubtitle}>Vacinas do SUS/SBIm, crescimento e pediatria</Text>
        </View>
        <View style={styles.healthStatusPill}>
          <View style={styles.greenPulseDot} />
          <Text style={styles.healthStatusText}>Em dia</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PASSE ESCOLAR & CUIDADOR (CARTÃO HEROICO) */}
        <TouchableOpacity
          style={styles.schoolCard}
          onPress={() => router.push('/modals/caregiver-card')}
          activeOpacity={0.85}
        >
          <View style={styles.schoolIconCircle}>
            <ShieldAlert size={22} color={Colors.secondary} />
          </View>
          <View style={styles.schoolCardInfo}>
            <Text style={styles.schoolCardTitle}>Passe Escolar & Cuidador</Text>
            <Text style={styles.schoolCardSub}>
              Ficha de emergência, alergias e lista de quem pode buscar na creche
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.secondary} />
        </TouchableOpacity>

        {/* DADOS VITAIS: TIPO SANGUÍNEO & ALERGIAS */}
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalCard}>
            <Text style={styles.vitalLabel}>TIPO SANGUÍNEO</Text>
            <Text style={styles.vitalValueBig}>{baby.blood_type || 'O+'}</Text>
            <Text style={styles.vitalSub}>Fator Rh Positivo</Text>
          </View>

          <View style={[styles.vitalCard, styles.vitalCardAllergy]}>
            <View style={styles.allergyHeader}>
              <AlertTriangle size={14} color={Colors.danger} />
              <Text style={styles.allergyLabel}>ALERGIAS</Text>
            </View>
            <Text style={styles.allergyText} numberOfLines={2}>
              {baby.allergies.length > 0 ? baby.allergies.join(', ') : 'Nenhuma relatada'}
            </Text>
            <Text style={styles.allergyAlertSub}>Atenção redobrada</Text>
          </View>
        </View>

        {/* CRESCIMENTO: CURVAS OMS */}
        <View style={styles.growthCard}>
          <View style={styles.growthTop}>
            <View style={styles.growthTitleRow}>
              <Activity size={18} color={Colors.primary} />
              <Text style={styles.growthTitle}>Curvas de Crescimento (OMS)</Text>
            </View>
            <Text style={styles.growthDate}>15 de Outubro</Text>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricNumber}>6.25 <Text style={styles.metricUnit}>kg</Text></Text>
              <Text style={styles.metricName}>Peso</Text>
              <View style={styles.percentilePill}>
                <Text style={styles.percentilePillText}>p50 (Ideal)</Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricNumber}>61.5 <Text style={styles.metricUnit}>cm</Text></Text>
              <Text style={styles.metricName}>Comprimento</Text>
              <View style={styles.percentilePill}>
                <Text style={styles.percentilePillText}>p55 (Normal)</Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricNumber}>40.2 <Text style={styles.metricUnit}>cm</Text></Text>
              <Text style={styles.metricName}>Cefálico</Text>
              <View style={styles.percentilePill}>
                <Text style={styles.percentilePillText}>p50 (Normal)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CALENDÁRIO VACINAL NACIONAL */}
        <View style={styles.vaccinesSection}>
          <View style={styles.vaccinesHeader}>
            <View>
              <Text style={styles.sectionHeading}>Calendário de Vacinas</Text>
              <Text style={styles.sectionSubHeading}>
                {appliedCount} doses tomadas • {pendingCount} próximas
              </Text>
            </View>

            {/* Filtros em Pílulas */}
            <View style={styles.filterPills}>
              <TouchableOpacity
                style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
                onPress={() => setFilter('all')}
              >
                <Text style={[styles.filterBtnText, filter === 'all' && styles.filterBtnTextActive]}>Todas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterBtn, filter === 'pending' && styles.filterBtnActive]}
                onPress={() => setFilter('pending')}
              >
                <Text style={[styles.filterBtnText, filter === 'pending' && styles.filterBtnTextActive]}>Pendentes</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de Vacinas Estilo Cartão */}
          <View style={styles.vaccineCardsList}>
            {filteredVaccines.map((record) => {
              const isApplied = record.status === 'applied';

              return (
                <View key={record.id} style={styles.vaccineItemCard}>
                  <View style={styles.vaccineCardTop}>
                    <View style={styles.vaccineNameCol}>
                      <View style={[styles.syringeCircle, isApplied && styles.syringeCircleApplied]}>
                        <Syringe size={15} color={isApplied ? Colors.success : Colors.primary} />
                      </View>
                      <View style={styles.vaccineTextWrap}>
                        <Text style={styles.vaccineNameTitle}>{record.vaccine.name}</Text>
                        <Text style={styles.vaccineTargetDisease} numberOfLines={1}>
                          {record.vaccine.target_disease}
                        </Text>
                      </View>
                    </View>

                    {isApplied ? (
                      <View style={styles.appliedPill}>
                        <CheckCircle2 size={12} color={Colors.success} strokeWidth={2.5} />
                        <Text style={styles.appliedPillText}>Tomada</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.pendingActionBtn}
                        onPress={() => handleApplyVaccine(record.id, record.vaccine.name)}
                        activeOpacity={0.8}
                      >
                        <Clock size={12} color={Colors.accent} />
                        <Text style={styles.pendingActionText}>Registrar</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.vaccineFooter}>
                    <Text style={styles.vaccineMetaInfo}>
                      {isApplied
                        ? `Aplicada em: ${record.applied_date} • ${record.clinic_or_post}`
                        : `Idade recomendada: ${record.vaccine.recommended_age_months === 0 ? 'Ao nascer' : `${record.vaccine.recommended_age_months} meses`}`}
                    </Text>
                    {record.batch_number && (
                      <Text style={styles.batchLabel}>Lote {record.batch_number}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* PEDIATRA DE REFERÊNCIA */}
        <View style={styles.doctorWidget}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorAvatarText}>🩺</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorRoleLabel}>PEDIATRA DE CONFIANÇA</Text>
            <Text style={styles.doctorName}>Dra. Camila Nogueira</Text>
            <Text style={styles.doctorClinicName}>Clínica Pediátrica Crescer • CRM 142.890</Text>
          </View>
          <TouchableOpacity style={styles.callDoctorBtn} activeOpacity={0.8}>
            <Phone size={15} color="#FFFFFF" />
            <Text style={styles.callDoctorText}>Ligar</Text>
          </TouchableOpacity>
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
  healthStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
  },
  healthStatusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 50,
  },
  schoolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F4',
    padding: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#FCDFD7',
    marginBottom: Spacing.md,
    gap: 12,
    ...Shadows.subtle,
  },
  schoolIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCDFD7',
  },
  schoolCardInfo: {
    flex: 1,
  },
  schoolCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.secondaryDark,
  },
  schoolCardSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.md,
  },
  vitalCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  vitalCardAllergy: {
    backgroundColor: '#FFF8F8',
    borderColor: '#FEE2E2',
  },
  vitalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  vitalValueBig: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  vitalSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  allergyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.danger,
    letterSpacing: 0.5,
  },
  allergyText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.danger,
    marginTop: 4,
    minHeight: 32,
  },
  allergyAlertSub: {
    fontSize: 10.5,
    color: '#9B2C2C',
    fontWeight: '600',
  },
  growthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  growthTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  growthTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  growthTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  growthDate: {
    fontSize: 11.5,
    color: Colors.textMuted,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  metricUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  metricName: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  percentilePill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    marginTop: 4,
  },
  percentilePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F0EAE0',
  },
  vaccinesSection: {
    marginBottom: Spacing.md,
  },
  vaccinesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubHeading: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 6,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: '#EFEAE2',
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
  },
  filterBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  filterBtnTextActive: {
    color: '#FFFFFF',
  },
  vaccineCardsList: {
    gap: 10,
  },
  vaccineItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  vaccineCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaccineNameCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  syringeCircle: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syringeCircleApplied: {
    backgroundColor: Colors.successLight,
  },
  vaccineTextWrap: {
    flex: 1,
  },
  vaccineNameTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  vaccineTargetDisease: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  appliedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  appliedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  pendingActionBtn: {
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
  pendingActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
  },
  vaccineFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F6F2EC',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vaccineMetaInfo: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  batchLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  doctorWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
    ...Shadows.card,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorAvatarText: {
    fontSize: 22,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorRoleLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  doctorClinicName: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  callDoctorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  callDoctorText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
