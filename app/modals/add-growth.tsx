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
import { Activity, Scale, Ruler, Brain, Check, Calendar } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateWHOWeightPercentile, calculateBabyAge } from '../../src/utils/babyCalculations';

export default function AddGrowthModal() {
  const router = useRouter();
  const { baby, addGrowthLog } = useApp();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [headCirc, setHeadCirc] = useState('');
  const [notes, setNotes] = useState('');

  const numWeight = parseFloat(weight.replace(',', '.'));
  const ageMonths = baby.birth_date ? calculateBabyAge(baby.birth_date).months : 3;
  const livePercentile = !isNaN(numWeight) && numWeight > 0 ? calculateWHOWeightPercentile(numWeight, ageMonths) : null;

  const handleSave = () => {
    if (!weight || isNaN(numWeight) || numWeight <= 0) {
      Alert.alert('Dado obrigatório', 'Por favor, informe o peso atual do bebê em kg (ex: 6.45).');
      return;
    }

    const numHeight = parseFloat(height.replace(',', '.')) || 60;
    const numHead = headCirc ? parseFloat(headCirc.replace(',', '.')) : undefined;

    addGrowthLog({
      recorded_date: date,
      weight_kg: numWeight,
      height_cm: numHeight,
      head_circumference_cm: numHead,
      notes: notes.trim() || 'Medição de rotina',
    });

    Alert.alert('Medição Salva!', 'Os dados foram registrados e o percentil da OMS foi calculado.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Registrar Peso e Altura</Text>
        <Text style={styles.headerSub}>
          Calcula automaticamente o percentil da Organização Mundial da Saúde (OMS).
        </Text>
      </View>

      {/* DATA DA MEDIÇÃO */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>DATA DA MEDIÇÃO</Text>
        <View style={styles.inputIconRow}>
          <Calendar size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.inputField}
            value={date}
            onChangeText={setDate}
            placeholder="AAAA-MM-DD"
          />
        </View>
      </View>

      {/* PESO (KG) */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>PESO ATUAL (KG) *</Text>
        <View style={styles.inputIconRow}>
          <Scale size={18} color={Colors.primary} />
          <TextInput
            style={styles.inputField}
            value={weight}
            onChangeText={setWeight}
            placeholder="Ex: 6.45"
            keyboardType="decimal-pad"
          />
          <Text style={styles.unitSuffix}>kg</Text>
        </View>

        {livePercentile && (
          <View style={styles.percentileLiveBox}>
            <Activity size={14} color={Colors.primary} />
            <Text style={styles.percentileLiveText}>Percentil Estimado OMS: {livePercentile}</Text>
          </View>
        )}
      </View>

      {/* COMPRIMENTO (CM) */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>ESTATURA / COMPRIMENTO (CM)</Text>
        <View style={styles.inputIconRow}>
          <Ruler size={18} color={Colors.secondary} />
          <TextInput
            style={styles.inputField}
            value={height}
            onChangeText={setHeight}
            placeholder="Ex: 62.0"
            keyboardType="decimal-pad"
          />
          <Text style={styles.unitSuffix}>cm</Text>
        </View>
      </View>

      {/* PERÍMETRO CEFÁLICO (CM) */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>PERÍMETRO CEFÁLICO (CM) - OPCIONAL</Text>
        <View style={styles.inputIconRow}>
          <Brain size={18} color={Colors.accent} />
          <TextInput
            style={styles.inputField}
            value={headCirc}
            onChangeText={setHeadCirc}
            placeholder="Ex: 40.5"
            keyboardType="decimal-pad"
          />
          <Text style={styles.unitSuffix}>cm</Text>
        </View>
      </View>

      {/* OBSERVAÇÕES / CONSULTA */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>OBSERVAÇÕES DO PEDIATRA OU CONSULTA</Text>
        <TextInput
          style={styles.textArea}
          value={notes}
          onChangeText={setNotes}
          placeholder="Ex: Consulta de rotina de 3 meses. Bebê mamando bem, ganho adequado de peso."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveBtnText}>Salvar Medição no Histórico</Text>
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
  inputIconRow: {
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
  inputField: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  unitSuffix: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  percentileLiveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    padding: 8,
    borderRadius: Radius.sm,
    marginTop: 6,
  },
  percentileLiveText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
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
