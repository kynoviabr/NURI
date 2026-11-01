import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Share2, FileText, CheckCircle2, AlertTriangle, ShieldCheck, Activity } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateBabyAge } from '../../src/utils/babyCalculations';

export default function MedicalReportModal() {
  const { baby, growthLogs, vaccines, medicationLogs } = useApp();
  const ageInfo = baby.birth_date ? calculateBabyAge(baby.birth_date) : null;

  const appliedVaccines = vaccines.filter((v) => v.status === 'applied');
  const pendingVaccines = vaccines.filter((v) => v.status === 'pending');

  const handleShare = () => {
    Alert.alert(
      'Relatório Pronto para Envio!',
      `Relatório Pediátrico de ${baby.name} pronto para enviar via WhatsApp para a Dra. Camila Nogueira ou imprimir em PDF.`,
      [{ text: 'Simular Compartilhamento' }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* CARD ESTILO FOLHA DE PRONTUÁRIO PEDIÁTRICO */}
      <View style={styles.sheetCard}>
        {/* CABEÇALHO DO LAUDO */}
        <View style={styles.sheetHeader}>
          <View style={styles.clinicLogoWrap}>
            <Text style={styles.clinicLogoText}>NURI HEALTH</Text>
          </View>
          <Text style={styles.reportDate}>Emitido em: {new Date().toLocaleDateString('pt-BR')}</Text>
        </View>

        <Text style={styles.reportMainTitle}>Prontuário Pediátrico de Acompanhamento</Text>

        {/* IDENTIFICAÇÃO DO PACIENTE */}
        <View style={styles.patientBox}>
          <View style={styles.patientRow}>
            <Text style={styles.patientLabel}>PACIENTE:</Text>
            <Text style={styles.patientVal}>{baby.name}</Text>
          </View>
          <View style={styles.patientRow}>
            <Text style={styles.patientLabel}>IDADE ATUAL:</Text>
            <Text style={styles.patientVal}>{ageInfo?.formattedText || 'Recém-nascido'}</Text>
          </View>
          <View style={styles.patientRow}>
            <Text style={styles.patientLabel}>TIPO SANGUÍNEO:</Text>
            <Text style={styles.patientVal}>{baby.blood_type || 'O+'}</Text>
          </View>
          <View style={styles.patientRow}>
            <Text style={styles.patientLabel}>CONVÊNIO:</Text>
            <Text style={styles.patientVal}>
              {baby.health_insurance ? `${baby.health_insurance.plan_name} (${baby.health_insurance.card_number})` : 'Particular'}
            </Text>
          </View>
        </View>

        {/* ALERGIAS E RESTRIÇÕES */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionHeaderTitle}>ALERGIAS E CONDIÇÕES DIAGNOSTICADAS</Text>
          {baby.allergies.length > 0 ? (
            <View style={styles.alertTagsRow}>
              {baby.allergies.map((a, i) => (
                <View key={i} style={styles.allergyTag}>
                  <AlertTriangle size={12} color={Colors.danger} />
                  <Text style={styles.allergyTagText}>{a}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.normalText}>Nenhuma alergia conhecida relatada.</Text>
          )}
        </View>

        {/* HISTÓRICO DE CRESCIMENTO E CURVAS OMS */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionHeaderTitle}>EVOLUÇÃO PONDERAL (CURVAS OMS)</Text>
          <View style={styles.growthTable}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeadCol, { flex: 1.2 }]}>Data</Text>
              <Text style={styles.tableHeadCol}>Peso</Text>
              <Text style={styles.tableHeadCol}>Estatura</Text>
              <Text style={[styles.tableHeadCol, { flex: 1.2 }]}>Percentil</Text>
            </View>
            {growthLogs.map((log) => (
              <View key={log.id} style={styles.tableDataRow}>
                <Text style={[styles.tableCell, { flex: 1.2 }]}>{log.recorded_date}</Text>
                <Text style={styles.tableCellBold}>{log.weight_kg.toFixed(2)} kg</Text>
                <Text style={styles.tableCell}>{log.height_cm.toFixed(1)} cm</Text>
                <Text style={[styles.tableCellPercentile, { flex: 1.2 }]}>{log.percentile_weight || 'p50'}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* HISTÓRICO DE VACINAÇÃO */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionHeaderTitle}>IMUNIZAÇÃO & VACINAS APLICADAS ({appliedVaccines.length})</Text>
          <View style={styles.vaccinesReportList}>
            {appliedVaccines.map((v) => (
              <View key={v.id} style={styles.vaccineReportItem}>
                <CheckCircle2 size={13} color={Colors.success} />
                <Text style={styles.vaccineReportName}>{v.vaccine.name}</Text>
                <Text style={styles.vaccineReportDate}>({v.applied_date})</Text>
                <Text style={styles.vaccineReportPost}>{v.clinic_or_post}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ÚLTIMAS MEDICAÇÕES / FEBRES */}
        <View style={styles.sectionDivider}>
          <Text style={styles.sectionHeaderTitle}>MEDICAMENTOS MINISTRADOS (ÚLTIMOS 30 DIAS)</Text>
          {medicationLogs.length > 0 ? (
            medicationLogs.map((m) => (
              <View key={m.id} style={styles.medReportRow}>
                <View style={styles.medReportTop}>
                  <Text style={styles.medReportName}>{m.medicine_name} - {m.dosage}</Text>
                  {m.temperature_celsius && (
                    <Text style={styles.medReportTemp}>{m.temperature_celsius} ºC</Text>
                  )}
                </View>
                <Text style={styles.medReportMeta}>
                  {new Date(m.administered_at).toLocaleDateString('pt-BR')} às {new Date(m.administered_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Motivo: {m.reason || 'Febre'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.normalText}>Nenhum medicamento administrado recentemente.</Text>
          )}
        </View>
      </View>

      {/* BOTÃO COMPARTILHAR */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
        <Share2 size={18} color="#FFFFFF" strokeWidth={2.2} />
        <Text style={styles.shareBtnText}>Enviar Relatório para o Pediatra (WhatsApp / PDF)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.background,
    paddingBottom: 50,
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAE0',
    paddingBottom: 10,
    marginBottom: 12,
  },
  clinicLogoWrap: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  clinicLogoText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  reportDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  reportMainTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  patientBox: {
    backgroundColor: '#FAF7F2',
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#ECE4D6',
    gap: 4,
    marginBottom: 14,
  },
  patientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patientLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  patientVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
    paddingTop: 12,
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  alertTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF2F2',
    borderWidth: 1,
    borderColor: '#FED7D7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  allergyTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.danger,
  },
  normalText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  growthTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#EFEAE0',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F4EE',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEAE0',
  },
  tableHeadCol: {
    flex: 1,
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FAF7F2',
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  tableCellBold: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tableCellPercentile: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  vaccinesReportList: {
    gap: 6,
  },
  vaccineReportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vaccineReportName: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  vaccineReportDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  vaccineReportPost: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    marginLeft: 'auto',
  },
  medReportRow: {
    backgroundColor: '#FAF7F2',
    padding: 8,
    borderRadius: Radius.xs,
    marginBottom: 6,
  },
  medReportTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medReportName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  medReportTemp: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.danger,
  },
  medReportMeta: {
    fontSize: 10.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    ...Shadows.subtle,
  },
  shareBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
