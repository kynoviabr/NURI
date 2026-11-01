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
  FileText,
  ChevronRight,
  Syringe,
  Activity,
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
      `Deseja marcar a vacina ${vaccineName} como aplicada hoje?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => markVaccineAsApplied(recordId, 'Posto de Saúde Central'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Caderneta de Saúde</Text>
        <Text style={styles.headerSubtitle}>Vacinas, dados vitais e contatos médicos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* CARTÃO DE EMERGÊNCIA & ESCOLA (DESTAQUE RÁPIDO) */}
        <TouchableOpacity
          style={styles.emergencyCard}
          onPress={() => router.push('/modals/caregiver-card')}
          activeOpacity={0.8}
        >
          <View style={styles.emergencyIconWrap}>
            <ShieldAlert size={24} color={Colors.secondary} />
          </View>
          <View style={styles.emergencyInfo}>
            <Text style={styles.emergencyTitle}>Passe Escolar & Ficha de Cuidador</Text>
            <Text style={styles.emergencyDesc}>
              Alergias, remédios autorizados e lista de quem pode buscar na escola
            </Text>
          </View>
          <ChevronRight size={18} color={Colors.secondary} />
        </TouchableOpacity>

        {/* ALERGIA E TIPO SANGUÍNEO */}
        <View style={styles.vitalCard}>
          <View style={styles.vitalItem}>
            <Text style={styles.vitalLabel}>Tipo Sanguíneo</Text>
            <Text style={styles.vitalValue}>{baby.blood_type || 'Não informado'}</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.vitalItem}>
            <Text style={styles.vitalLabel}>Alergias Conhecidas</Text>
            <Text style={[styles.vitalValue, { color: Colors.danger }]}>
              {baby.allergies.length > 0 ? baby.allergies.join(', ') : 'Nenhuma relatada'}
            </Text>
          </View>
        </View>

        {/* CONTROLE DE CRESCIMENTO (CURVAS OMS RESUMO) */}
        <View style={styles.growthSummaryCard}>
          <View style={styles.growthHeader}>
            <View style={styles.growthHeaderLeft}>
              <Activity size={18} color={Colors.primary} />
              <Text style={styles.growthTitle}>Última Medição Pediátrica</Text>
            </View>
            <Text style={styles.growthDate}>15 de Outubro</Text>
          </View>
          <View style={styles.growthMetricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>6.25 kg</Text>
              <Text style={styles.metricSub}>Peso (p50 OMS)</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>61.5 cm</Text>
              <Text style={styles.metricSub}>Comprimento</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>40.2 cm</Text>
              <Text style={styles.metricSub}>Perímetro Cefálico</Text>
            </View>
          </View>
        </View>

        {/* CALENDÁRIO VACINAL NACIONAL */}
        <View style={styles.vaccineSection}>
          <View style={styles.vaccineSectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Calendário de Vacinas</Text>
              <Text style={styles.sectionSubtitle}>
                {appliedCount} aplicadas • {pendingCount} próximas doses
              </Text>
            </View>

            {/* Abas de filtro */}
            <View style={styles.filterGroup}>
              <TouchableOpacity
                style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
                onPress={() => setFilter('all')}
              >
                <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>Todas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, filter === 'pending' && styles.filterChipActive]}
                onPress={() => setFilter('pending')}
              >
                <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>Pendentes</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* LISTA DE VACINAS */}
          <View style={styles.vaccinesList}>
            {filteredVaccines.map((record) => {
              const isApplied = record.status === 'applied';

              return (
                <View key={record.id} style={styles.vaccineCard}>
                  <View style={styles.vaccineRowTop}>
                    <View style={styles.vaccineTitleGroup}>
                      <View style={[styles.vaccineIconCircle, isApplied && styles.vaccineIconCircleApplied]}>
                        <Syringe size={16} color={isApplied ? Colors.success : Colors.primary} />
                      </View>
                      <View>
                        <Text style={styles.vaccineName}>{record.vaccine.name}</Text>
                        <Text style={styles.vaccineDisease}>{record.vaccine.target_disease}</Text>
                      </View>
                    </View>

                    {isApplied ? (
                      <View style={styles.statusBadgeApplied}>
                        <CheckCircle2 size={12} color={Colors.success} />
                        <Text style={styles.statusTextApplied}>Tomada</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.statusBadgePending}
                        onPress={() => handleApplyVaccine(record.id, record.vaccine.name)}
                      >
                        <Clock size={12} color={Colors.warning} />
                        <Text style={styles.statusTextPending}>Registrar</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {isApplied ? (
                    <View style={styles.appliedDetailsRow}>
                      <Text style={styles.appliedDetailText}>
                        Aplicada em: {record.applied_date} • {record.clinic_or_post}
                      </Text>
                      {record.batch_number && (
                        <Text style={styles.batchText}>Lote: {record.batch_number}</Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.appliedDetailsRow}>
                      <Text style={styles.scheduledDetailText}>
                        Idade recomendada: {record.vaccine.recommended_age_months === 0 ? 'Ao nascer' : `${record.vaccine.recommended_age_months} meses`}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* CONTATO DO PEDIATRA DE REFERÊNCIA */}
        <View style={styles.doctorCard}>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorRole}>Pediatra de Referência</Text>
            <Text style={styles.doctorName}>Dra. Camila Nogueira (CRM 142.890)</Text>
            <Text style={styles.doctorClinic}>Clínica Pediátrica Crescer • Seg a Sex</Text>
          </View>
          <TouchableOpacity style={styles.callButton} activeOpacity={0.8}>
            <Phone size={16} color={Colors.textInverted} />
            <Text style={styles.callButtonText}>Ligar</Text>
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
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryLight,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  emergencyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  emergencyDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  vitalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  vitalItem: {
    flex: 1,
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  growthSummaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  growthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  growthHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  growthTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  growthDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  growthMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  metricBox: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  metricSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  vaccineSection: {
    marginBottom: Spacing.md,
  },
  vaccineSectionHeader: {
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
    marginTop: 2,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceSubtle,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.textInverted,
  },
  vaccinesList: {
    gap: 8,
  },
  vaccineCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  vaccineRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaccineTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  vaccineIconCircle: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaccineIconCircleApplied: {
    backgroundColor: Colors.successLight,
  },
  vaccineName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  vaccineDisease: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statusBadgeApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  statusTextApplied: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  statusBadgePending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  statusTextPending: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warning,
  },
  appliedDetailsRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appliedDetailText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  batchText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  scheduledDetailText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  doctorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorRole: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  doctorClinic: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  callButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverted,
  },
});
