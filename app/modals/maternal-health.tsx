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
import { Activity, Scale, Heart, Droplet, Check, Plus } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';

export default function MaternalHealthModal() {
  const router = useRouter();
  const { addMaternalLog } = useApp();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [bloodPressure, setBloodPressure] = useState('115/75');
  const [glucose, setGlucose] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Azia leve']);
  const [notes, setNotes] = useState('');

  const commonSymptoms = [
    'Enjoo matinal',
    'Azia leve',
    'Dor na lombar',
    'Inchaço nos pés',
    'Cansaço excessivo',
    'Cólica leve de adaptação',
    'Insônia',
    'Contrações de treinamento',
  ];

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSave = () => {
    const numWeight = weight ? parseFloat(weight.replace(',', '.')) : undefined;
    const numGlucose = glucose ? parseInt(glucose, 10) : undefined;

    addMaternalLog({
      recorded_date: date,
      weight_kg: numWeight,
      blood_pressure: bloodPressure.trim() || undefined,
      fasting_blood_glucose: numGlucose,
      symptoms: selectedSymptoms,
      notes: notes.trim() || undefined,
    });

    Alert.alert('Dados Pré-Natal Salvos! 🩺', 'Informações registradas com sucesso no diário da gestação.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Saúde da Gestante & Sintomas</Text>
        <Text style={styles.headerSub}>Monitore pressão arterial, ganho de peso e sintomas diários.</Text>
      </View>

      {/* DATA */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>DATA DO REGISTRO</Text>
        <TextInput style={styles.textInput} value={date} onChangeText={setDate} />
      </View>

      {/* PRESSÃO ARTERIAL */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>PRESSÃO ARTERIAL (MMHG) - ESSENCIAL</Text>
        <View style={styles.inputWithIcon}>
          <Heart size={18} color={Colors.danger} />
          <TextInput
            style={styles.innerInput}
            value={bloodPressure}
            onChangeText={setBloodPressure}
            placeholder="Ex: 110/70 ou 120/80"
          />
          <Text style={styles.unitSuffix}>mmHg</Text>
        </View>
      </View>

      {/* PESO ATUAL DA MÃE */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>PESO DA GESTANTE (KG)</Text>
        <View style={styles.inputWithIcon}>
          <Scale size={18} color={Colors.primary} />
          <TextInput
            style={styles.innerInput}
            value={weight}
            onChangeText={setWeight}
            placeholder="Ex: 64.5"
            keyboardType="decimal-pad"
          />
          <Text style={styles.unitSuffix}>kg</Text>
        </View>
      </View>

      {/* GLICEMIA (OPCIONAL) */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>GLICEMIA DE JEJUM (MG/DL) - OPCIONAL</Text>
        <View style={styles.inputWithIcon}>
          <Droplet size={18} color={Colors.accent} />
          <TextInput
            style={styles.innerInput}
            value={glucose}
            onChangeText={setGlucose}
            placeholder="Ex: 85"
            keyboardType="number-pad"
          />
          <Text style={styles.unitSuffix}>mg/dL</Text>
        </View>
      </View>

      {/* SINTOMAS DO DIA (SELEÇÃO RÁPIDA) */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>SINTOMAS SENTIDOS HOJE</Text>
        <View style={styles.symptomsGrid}>
          {commonSymptoms.map((sym, i) => {
            const isSelected = selectedSymptoms.includes(sym);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.symptomChip, isSelected && styles.symptomChipActive]}
                onPress={() => toggleSymptom(sym)}
                activeOpacity={0.7}
              >
                <Text style={[styles.symptomChipText, isSelected && styles.symptomChipTextActive]}>
                  {isSelected ? `✓ ${sym}` : sym}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* NOTAS DO PRÉ-NATAL */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>ANOTAÇÕES DA CONSULTA PRÉ-NATAL</Text>
        <TextInput
          style={styles.textArea}
          value={notes}
          onChangeText={setNotes}
          placeholder="Ex: Médico aumentou a dose de ferro e orientou repouso."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveBtnText}>Salvar Registro Pré-Natal</Text>
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
    marginBottom: 14,
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
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  symptomChipActive: {
    backgroundColor: Colors.secondaryLight,
    borderColor: Colors.secondary,
  },
  symptomChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  symptomChipTextActive: {
    color: Colors.secondaryDark,
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
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
