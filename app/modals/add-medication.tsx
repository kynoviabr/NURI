import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Pill, Thermometer, Clock, User, Check, AlertCircle } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { classifyTemperature } from '../../src/utils/babyCalculations';

export default function AddMedicationModal() {
  const router = useRouter();
  const { addMedicationLog } = useApp();

  const [medicine, setMedicine] = useState('Paracetamol Bebê');
  const [dosage, setDosage] = useState('12 gotas');
  const [temperature, setTemperature] = useState('');
  const [intervalHours, setIntervalHours] = useState(6);
  const [administeredBy, setAdministeredBy] = useState('Mamãe');
  const [reason, setReason] = useState('Febre pós-vacina');

  const medicinePresets = ['Paracetamol Bebê', 'Dipirona Gotas', 'Ibuprofeno Infantil', 'Vitamina D', 'Soro Fisiológico'];
  const intervalPresets = [4, 6, 8, 12];
  const caregivers = ['Mamãe', 'Papai', 'Vovó', 'Babá'];

  const numTemp = parseFloat(temperature.replace(',', '.'));
  const tempClass = !isNaN(numTemp) && numTemp > 30 ? classifyTemperature(numTemp) : null;

  const handleSave = () => {
    if (!medicine.trim() || !dosage.trim()) {
      Alert.alert('Dados Incompletos', 'Informe o nome do medicamento e a dosagem administrada.');
      return;
    }

    addMedicationLog({
      medicine_name: medicine.trim(),
      dosage: dosage.trim(),
      temperature_celsius: !isNaN(numTemp) && numTemp > 30 ? numTemp : undefined,
      interval_hours: intervalHours,
      administered_by: administeredBy,
      reason: reason.trim(),
    });

    Alert.alert('Medicamento Registrado! 💊', `Próxima dose calculada para daqui a ${intervalHours} horas.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Registrar Remédio / Febre</Text>
        <Text style={styles.headerSub}>
          Evite superdosagem acidental e calcule o horário exato da próxima dose.
        </Text>
      </View>

      {/* MEDICAMENTO */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>NOME DO MEDICAMENTO *</Text>
        <TextInput
          style={styles.textInput}
          value={medicine}
          onChangeText={setMedicine}
          placeholder="Ex: Paracetamol Bebê"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {medicinePresets.map((med, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.chip, medicine === med && styles.chipActive]}
              onPress={() => setMedicine(med)}
            >
              <Text style={[styles.chipText, medicine === med && styles.chipTextActive]}>{med}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* DOSAGEM */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>DOSAGEM MINISTRADA *</Text>
        <View style={styles.inputWithIcon}>
          <Pill size={18} color={Colors.primary} />
          <TextInput
            style={styles.innerInput}
            value={dosage}
            onChangeText={setDosage}
            placeholder="Ex: 12 gotas, 2.5 ml, 1 seringa"
          />
        </View>
      </View>

      {/* TEMPERATURA / FEBRE (OPCIONAL) */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>TEMPERATURA CORPORAL (º C) - SE HOUVER FEBRE</Text>
        <View style={styles.inputWithIcon}>
          <Thermometer size={18} color={tempClass ? tempClass.color : Colors.danger} />
          <TextInput
            style={styles.innerInput}
            value={temperature}
            onChangeText={setTemperature}
            placeholder="Ex: 38.2"
            keyboardType="decimal-pad"
          />
          <Text style={styles.unitSuffix}>ºC</Text>
        </View>

        {tempClass && (
          <View style={[styles.tempAlertCard, { backgroundColor: `${tempClass.color}15`, borderColor: tempClass.color }]}>
            <AlertCircle size={16} color={tempClass.color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.tempAlertTitle, { color: tempClass.color }]}>{tempClass.label}</Text>
              <Text style={styles.tempAlertAdvice}>{tempClass.advice}</Text>
            </View>
          </View>
        )}
      </View>

      {/* INTERVALO DE HORAS (PARA PRÓXIMA DOSE) */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>INTERVALO ENTRE AS DOSES (HORAS)</Text>
        <View style={styles.intervalGrid}>
          {intervalPresets.map((hr) => (
            <TouchableOpacity
              key={hr}
              style={[styles.intervalBtn, intervalHours === hr && styles.intervalBtnActive]}
              onPress={() => setIntervalHours(hr)}
            >
              <Clock size={14} color={intervalHours === hr ? '#FFFFFF' : Colors.textSecondary} />
              <Text style={[styles.intervalBtnText, intervalHours === hr && styles.intervalBtnTextActive]}>
                A cada {hr}h
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* QUEM MINISTROU */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>QUEM DEU O REMÉDIO?</Text>
        <View style={styles.caregiversRow}>
          {caregivers.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.caregiverBtn, administeredBy === c && styles.caregiverBtnActive]}
              onPress={() => setAdministeredBy(c)}
            >
              <Text style={[styles.caregiverBtnText, administeredBy === c && styles.caregiverBtnTextActive]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* MOTIVO */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>MOTIVO / SINTOMA</Text>
        <TextInput
          style={styles.textInput}
          value={reason}
          onChangeText={setReason}
          placeholder="Ex: Febre após vacina de 2 meses, dor de dente"
        />
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveBtnText}>Registrar Dose & Ativar Lembrete</Text>
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
  headerInfo: {
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  innerInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  unitSuffix: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tempAlertCard: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginTop: 8,
  },
  tempAlertTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  tempAlertAdvice: {
    fontSize: 11.5,
    color: Colors.textPrimary,
    marginTop: 1,
    lineHeight: 16,
  },
  intervalGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  intervalBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  intervalBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  intervalBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  intervalBtnTextActive: {
    color: '#FFFFFF',
  },
  caregiversRow: {
    flexDirection: 'row',
    gap: 8,
  },
  caregiverBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  caregiverBtnActive: {
    backgroundColor: Colors.secondaryLight,
    borderColor: Colors.secondary,
  },
  caregiverBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  caregiverBtnTextActive: {
    color: Colors.secondaryDark,
    fontWeight: '800',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    marginTop: 8,
    ...Shadows.subtle,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
