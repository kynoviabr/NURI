import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Check, AlertTriangle, AlertCircle, Sparkles, ShieldAlert } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { analyzeDiaper } from '../../src/utils/babyCalculations';
import {
  DiaperType,
  DiaperPooColor,
  DiaperPooConsistency,
  DiaperPeeVolume,
} from '../../src/types/database';

export default function AddDiaperModal() {
  const router = useRouter();
  const { addDiaperLog } = useApp();

  const [type, setType] = useState<DiaperType>('both');
  const [pooColor, setPooColor] = useState<DiaperPooColor>('yellow');
  const [pooConsistency, setPooConsistency] = useState<DiaperPooConsistency>('pasty');
  const [peeVolume, setPeeVolume] = useState<DiaperPeeVolume>('normal');
  const [loggedBy, setLoggedBy] = useState('Mamãe');
  const [notes, setNotes] = useState('');

  const hasPoo = type === 'poo' || type === 'both';
  const hasPee = type === 'pee' || type === 'both';

  // ANÁLISE CLÍNICA EM TEMPO REAL
  const clinicalCheck = analyzeDiaper(type, hasPoo ? pooColor : undefined, hasPoo ? pooConsistency : undefined);

  const colorsList: { id: DiaperPooColor; label: string; hex: string; note: string }[] = [
    { id: 'yellow', label: 'Amarelo Ouro', hex: '#EAB308', note: 'Ideal' },
    { id: 'green', label: 'Verde', hex: '#22C55E', note: 'Comum' },
    { id: 'brown', label: 'Marrom', hex: '#854D0E', note: 'Normal' },
    { id: 'black', label: 'Preto', hex: '#1E293B', note: 'Mecônio/Ferro' },
    { id: 'red', label: 'Vermelho', hex: '#DC2626', note: 'Alerta Sangue' },
    { id: 'white', label: 'Branco / Argila', hex: '#E2E8F0', note: 'Alerta Urgente' },
  ];

  const handleSave = () => {
    const nowIso = new Date().toISOString();

    addDiaperLog({
      baby_id: 'b1',
      timestamp: nowIso,
      type,
      poo_color: hasPoo ? pooColor : undefined,
      poo_consistency: hasPoo ? pooConsistency : undefined,
      pee_volume: hasPee ? peeVolume : undefined,
      clinical_alert: clinicalCheck.alertLevel !== 'normal' ? clinicalCheck.message : undefined,
      notes: notes.trim() || undefined,
      logged_by: loggedBy,
    });

    if (clinicalCheck.alertLevel === 'urgent') {
      Alert.alert(
        clinicalCheck.title,
        clinicalCheck.message,
        [{ text: 'Entendido', onPress: () => router.back() }]
      );
    } else {
      Alert.alert('Fralda Registrada! 🧷', 'Troca salva no diário do bebê com sucesso.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SELEÇÃO DO TIPO DE FRALDA */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>O que tinha na fraldinha?</Text>
        
        <View style={styles.typeGrid}>
          {[
            { id: 'both', label: 'Xixi + Cocô', icon: '💧+💩' },
            { id: 'pee', label: 'Apenas Xixi', icon: '💧' },
            { id: 'poo', label: 'Apenas Cocô', icon: '💩' },
            { id: 'dry', label: 'Fralda Limpa', icon: '✨' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.typeBtn,
                type === item.id && styles.typeBtnActive,
              ]}
              onPress={() => setType(item.id as DiaperType)}
              activeOpacity={0.8}
            >
              <Text style={styles.typeIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  type === item.id && styles.typeLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* DETALHES DE XIXI (SE APLICÁVEL) */}
      {hasPee && (
        <View style={styles.card}>
          <Text style={styles.sectionSublabel}>Quantidade de Xixi</Text>
          <View style={styles.volumeRow}>
            {[
              { id: 'light', label: 'Leve / Pouco' },
              { id: 'normal', label: 'Normal' },
              { id: 'heavy', label: 'Muito Pesada' },
            ].map((v) => (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.volumeChip,
                  peeVolume === v.id && styles.volumeChipActive,
                ]}
                onPress={() => setPeeVolume(v.id as DiaperPeeVolume)}
              >
                <Text
                  style={[
                    styles.volumeChipText,
                    peeVolume === v.id && styles.volumeChipTextActive,
                  ]}
                >
                  {v.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* DETALHES DE COCÔ (SE APLICÁVEL) */}
      {hasPoo && (
        <View style={styles.card}>
          <Text style={styles.sectionSublabel}>Cor das Fezes</Text>
          <View style={styles.colorsGrid}>
            {colorsList.map((c) => {
              const isSelected = pooColor === c.id;
              const isDanger = c.id === 'red' || c.id === 'white';

              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.colorTile,
                    isSelected && styles.colorTileActive,
                    isDanger && styles.colorTileDanger,
                  ]}
                  onPress={() => setPooColor(c.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: c.hex },
                      c.id === 'white' && { borderWidth: 1, borderColor: '#CBD5E1' },
                    ]}
                  />
                  <Text style={[styles.colorTileLabel, isSelected && styles.colorTileLabelActive]}>
                    {c.label}
                  </Text>
                  <Text style={styles.colorTileNote}>{c.note}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionSublabel, { marginTop: 16 }]}>Consistência</Text>
          <View style={styles.consistencyRow}>
            {[
              { id: 'pasty', label: 'Pastoso (Ideal)' },
              { id: 'liquid', label: 'Líquido (Diarreia)' },
              { id: 'formed', label: 'Firme / Formado' },
              { id: 'hard', label: 'Ressecado (Bolinhas)' },
            ].map((cs) => (
              <TouchableOpacity
                key={cs.id}
                style={[
                  styles.consistencyChip,
                  pooConsistency === cs.id && styles.consistencyChipActive,
                ]}
                onPress={() => setPooConsistency(cs.id as DiaperPooConsistency)}
              >
                <Text
                  style={[
                    styles.consistencyChipText,
                    pooConsistency === cs.id && styles.consistencyChipTextActive,
                  ]}
                >
                  {cs.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* FEEDBACK PEDIÁTRICO INTELIGENTE EM TEMPO REAL */}
      <View
        style={[
          styles.clinicalAlertBox,
          clinicalCheck.alertLevel === 'urgent'
            ? styles.clinicalUrgent
            : clinicalCheck.alertLevel === 'warning'
            ? styles.clinicalWarning
            : styles.clinicalNormal,
        ]}
      >
        <View style={styles.clinicalHeaderRow}>
          {clinicalCheck.alertLevel === 'urgent' ? (
            <ShieldAlert size={20} color="#DC2626" />
          ) : clinicalCheck.alertLevel === 'warning' ? (
            <AlertTriangle size={18} color="#D97706" />
          ) : (
            <Sparkles size={18} color={Colors.primary} />
          )}
          <Text
            style={[
              styles.clinicalAlertTitle,
              clinicalCheck.alertLevel === 'urgent'
                ? styles.textUrgent
                : clinicalCheck.alertLevel === 'warning'
                ? styles.textWarning
                : styles.textNormal,
            ]}
          >
            {clinicalCheck.title}
          </Text>
        </View>
        <Text style={styles.clinicalAlertMsg}>{clinicalCheck.message}</Text>
      </View>

      {/* QUEM TROCOU & NOTAS */}
      <View style={styles.card}>
        <Text style={styles.sectionSublabel}>Quem trocou?</Text>
        <View style={styles.loggedByRow}>
          {['Mamãe', 'Papai', 'Vovó', 'Babá'].map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.loggedByChip,
                loggedBy === p && styles.loggedByChipActive,
              ]}
              onPress={() => setLoggedBy(p)}
            >
              <Text
                style={[
                  styles.loggedByChipText,
                  loggedBy === p && styles.loggedByChipTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionSublabel, { marginTop: 14 }]}>Observações (opcional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Ex: Passou pomada preventiva de assadura."
          placeholderTextColor="#A0A7B1"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveBtnText}>Salvar Fralda</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.lg,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 6,
  },
  typeBtnActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  typeIcon: {
    fontSize: 24,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  typeLabelActive: {
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  sectionSublabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  volumeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  volumeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  volumeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  volumeChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  volumeChipTextActive: {
    color: '#FFFFFF',
  },
  colorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorTile: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorTileActive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.primary,
  },
  colorTileDanger: {
    backgroundColor: '#FFF7F7',
  },
  colorDot: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    marginBottom: 6,
  },
  colorTileLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  colorTileLabelActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  colorTileNote: {
    fontSize: 9.5,
    color: Colors.textMuted,
    marginTop: 2,
  },
  consistencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  consistencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  consistencyChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  consistencyChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  consistencyChipTextActive: {
    color: '#FFFFFF',
  },
  clinicalAlertBox: {
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
  },
  clinicalNormal: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  clinicalWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  clinicalUrgent: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  clinicalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  clinicalAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  textNormal: {
    color: '#166534',
  },
  textWarning: {
    color: '#B45309',
  },
  textUrgent: {
    color: '#991B1B',
  },
  clinicalAlertMsg: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  loggedByRow: {
    flexDirection: 'row',
    gap: 8,
  },
  loggedByChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    backgroundColor: '#F7F3EC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  loggedByChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  loggedByChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  loggedByChipTextActive: {
    color: '#FFFFFF',
  },
  notesInput: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 13,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 60,
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    marginTop: 6,
    ...Shadows.subtle,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
