import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Play, Pause, RotateCcw, Check, Sparkles, Clock, Milk, Utensils } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { formatTimerSeconds } from '../../src/utils/babyCalculations';
import { FeedingType, BottleContent, SolidAcceptance } from '../../src/types/database';

export default function AddFeedingModal() {
  const router = useRouter();
  const { addFeedingLog } = useApp();

  const [activeTab, setActiveTab] = useState<FeedingType>('breast');

  // ESTADO DO CRONÔMETRO DE PEITO
  const [activeBreast, setActiveBreast] = useState<'left' | 'right' | null>(null);
  const [leftSeconds, setLeftSeconds] = useState(0);
  const [rightSeconds, setRightSeconds] = useState(0);
  const [isManualBreast, setIsManualBreast] = useState(false);
  const [manualLeftMin, setManualLeftMin] = useState('10');
  const [manualRightMin, setManualRightMin] = useState('10');

  // ESTADO DA MAMADEIRA
  const [bottleMl, setBottleMl] = useState<number>(120);
  const [bottleContent, setBottleContent] = useState<BottleContent>('breast_milk');

  // ESTADO DE COMIDA
  const [foodDescription, setFoodDescription] = useState('');
  const [foodAcceptance, setFoodAcceptance] = useState<SolidAcceptance>('great');

  // GERAL
  const [loggedBy, setLoggedBy] = useState('Mamãe');
  const [notes, setNotes] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeBreast) {
      timerRef.current = setInterval(() => {
        if (activeBreast === 'left') {
          setLeftSeconds((prev) => prev + 1);
        } else if (activeBreast === 'right') {
          setRightSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeBreast]);

  const toggleBreast = (side: 'left' | 'right') => {
    if (activeBreast === side) {
      // Pausa
      setActiveBreast(null);
    } else {
      // Começa o lado escolhido
      setActiveBreast(side);
    }
  };

  const handleResetTimers = () => {
    setActiveBreast(null);
    setLeftSeconds(0);
    setRightSeconds(0);
  };

  const handleSave = () => {
    const nowIso = new Date().toISOString();

    if (activeTab === 'breast') {
      const finalLeftSec = isManualBreast ? (parseInt(manualLeftMin, 10) || 0) * 60 : leftSeconds;
      const finalRightSec = isManualBreast ? (parseInt(manualRightMin, 10) || 0) * 60 : rightSeconds;

      if (finalLeftSec === 0 && finalRightSec === 0) {
        Alert.alert('Tempo zerado', 'Inicie o cronômetro ou digite os minutos manuais para registrar a mamada.');
        return;
      }

      const lastSide = finalRightSec > 0 && finalRightSec >= finalLeftSec ? 'right' : 'left';

      addFeedingLog({
        baby_id: 'b1',
        type: 'breast',
        start_time: nowIso,
        end_time: nowIso,
        left_breast_seconds: finalLeftSec,
        right_breast_seconds: finalRightSec,
        last_breast_used: lastSide,
        notes: notes.trim() || undefined,
        logged_by: loggedBy,
      });

      Alert.alert('Mamada Registrada! 🤱', `Registrado: ${Math.round(finalLeftSec / 60)}m no Seio E e ${Math.round(finalRightSec / 60)}m no Seio D.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else if (activeTab === 'bottle') {
      if (!bottleMl || bottleMl <= 0) {
        Alert.alert('Volume Inválido', 'Informe a quantidade em ml tomada na mamadeira.');
        return;
      }

      addFeedingLog({
        baby_id: 'b1',
        type: 'bottle',
        start_time: nowIso,
        bottle_volume_ml: bottleMl,
        bottle_content: bottleContent,
        notes: notes.trim() || undefined,
        logged_by: loggedBy,
      });

      Alert.alert('Mamadeira Registrada! 🍼', `Registrado: ${bottleMl} ml de ${bottleContent === 'breast_milk' ? 'Leite Materno' : 'Fórmula'}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      if (!foodDescription.trim()) {
        Alert.alert('Descreva a refeição', 'Ex: Papinha de cenoura com batata doce.');
        return;
      }

      addFeedingLog({
        baby_id: 'b1',
        type: 'solid',
        start_time: nowIso,
        solid_food_name: foodDescription.trim(),
        solid_acceptance: foodAcceptance,
        notes: notes.trim() || undefined,
        logged_by: loggedBy,
      });

      Alert.alert('Refeição Registrada! 🥣', `Registrado com aceitação: ${foodAcceptance}.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  const bottlePresets = [30, 60, 90, 120, 150, 180, 210, 240];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SELETOR DE MODO */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, activeTab === 'breast' && styles.modeTabActive]}
          onPress={() => setActiveTab('breast')}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeTabText, activeTab === 'breast' && styles.modeTabTextActive]}>
            🤱 Peito
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, activeTab === 'bottle' && styles.modeTabActive]}
          onPress={() => setActiveTab('bottle')}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeTabText, activeTab === 'bottle' && styles.modeTabTextActive]}>
            🍼 Mamadeira
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, activeTab === 'solid' && styles.modeTabActive]}
          onPress={() => setActiveTab('solid')}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeTabText, activeTab === 'solid' && styles.modeTabTextActive]}>
            🥣 Comidinha
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTEÚDO: PEITO / AMAMENTAÇÃO */}
      {activeTab === 'breast' && (
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Cronômetro de Amamentação</Text>
            <TouchableOpacity
              onPress={() => setIsManualBreast(!isManualBreast)}
              style={styles.manualToggle}
            >
              <Text style={styles.manualToggleText}>
                {isManualBreast ? 'Usar Cronômetro' : 'Inserir Minutos'}
              </Text>
            </TouchableOpacity>
          </View>

          {!isManualBreast ? (
            <>
              <View style={styles.breastTimerRow}>
                {/* SEIO ESQUERDO */}
                <TouchableOpacity
                  style={[
                    styles.breastCircleBtn,
                    activeBreast === 'left' && styles.breastCircleBtnActive,
                  ]}
                  onPress={() => toggleBreast('left')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.breastLabel}>Seio Esquerdo</Text>
                  <Text style={styles.breastTimerNumber}>
                    {formatTimerSeconds(leftSeconds)}
                  </Text>
                  <View style={styles.breastPlayRow}>
                    {activeBreast === 'left' ? (
                      <Pause size={18} color="#FFFFFF" />
                    ) : (
                      <Play size={18} color={Colors.primary} fill={Colors.primary} />
                    )}
                    <Text
                      style={[
                        styles.breastStatusText,
                        activeBreast === 'left' && styles.breastStatusTextActive,
                      ]}
                    >
                      {activeBreast === 'left' ? 'Mamando...' : 'Iniciar'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* SEIO DIREITO */}
                <TouchableOpacity
                  style={[
                    styles.breastCircleBtn,
                    activeBreast === 'right' && styles.breastCircleBtnActive,
                  ]}
                  onPress={() => toggleBreast('right')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.breastLabel}>Seio Direito</Text>
                  <Text style={styles.breastTimerNumber}>
                    {formatTimerSeconds(rightSeconds)}
                  </Text>
                  <View style={styles.breastPlayRow}>
                    {activeBreast === 'right' ? (
                      <Pause size={18} color="#FFFFFF" />
                    ) : (
                      <Play size={18} color={Colors.primary} fill={Colors.primary} />
                    )}
                    <Text
                      style={[
                        styles.breastStatusText,
                        activeBreast === 'right' && styles.breastStatusTextActive,
                      ]}
                    >
                      {activeBreast === 'right' ? 'Mamando...' : 'Iniciar'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* CONTROLES DO CRONÔMETRO */}
              <View style={styles.timerControlsRow}>
                <Text style={styles.totalTimeText}>
                  Tempo Total:{' '}
                  <Text style={styles.totalTimeBold}>
                    {formatTimerSeconds(leftSeconds + rightSeconds)}
                  </Text>
                </Text>
                {(leftSeconds > 0 || rightSeconds > 0) && (
                  <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={handleResetTimers}
                    activeOpacity={0.7}
                  >
                    <RotateCcw size={14} color={Colors.danger} />
                    <Text style={styles.resetBtnText}>Zerar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            /* ENTRADA MANUAL DE MINUTOS */
            <View style={styles.manualBreastInputs}>
              <View style={styles.inputCol}>
                <Text style={styles.inputColLabel}>Seio Esquerdo (minutos)</Text>
                <TextInput
                  style={styles.textInputBox}
                  keyboardType="numeric"
                  value={manualLeftMin}
                  onChangeText={setManualLeftMin}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.inputColLabel}>Seio Direito (minutos)</Text>
                <TextInput
                  style={styles.textInputBox}
                  keyboardType="numeric"
                  value={manualRightMin}
                  onChangeText={setManualRightMin}
                />
              </View>
            </View>
          )}

          <View style={styles.tipBox}>
            <Sparkles size={14} color={Colors.secondary} />
            <Text style={styles.tipText}>
              Dica Pediátrica: Alterne o primeiro seio a cada mamada para estimular a produção por igual e prevenir empedramento (ingurgitamento).
            </Text>
          </View>
        </View>
      )}

      {/* CONTEÚDO: MAMADEIRA */}
      {activeTab === 'bottle' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Registro de Mamadeira</Text>
          
          <Text style={styles.sectionSublabel}>Tipo de Conteúdo</Text>
          <View style={styles.contentPillsRow}>
            {[
              { id: 'breast_milk', label: 'Leite Materno' },
              { id: 'formula', label: 'Fórmula Infantil' },
              { id: 'water', label: 'Água' },
              { id: 'other', label: 'Outro' },
            ].map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.contentPill,
                  bottleContent === c.id && styles.contentPillActive,
                ]}
                onPress={() => setBottleContent(c.id as BottleContent)}
              >
                <Text
                  style={[
                    styles.contentPillText,
                    bottleContent === c.id && styles.contentPillTextActive,
                  ]}
                >
                  {c.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionSublabel}>Quantidade em Mililitros (ml)</Text>
          <View style={styles.volumeDisplayRow}>
            <Text style={styles.volumeBigText}>{bottleMl}</Text>
            <Text style={styles.volumeMlUnit}>ml</Text>
          </View>

          <View style={styles.presetGrid}>
            {bottlePresets.map((ml) => (
              <TouchableOpacity
                key={ml}
                style={[
                  styles.presetChip,
                  bottleMl === ml && styles.presetChipActive,
                ]}
                onPress={() => setBottleMl(ml)}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    bottleMl === ml && styles.presetChipTextActive,
                  ]}
                >
                  {ml} ml
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* CONTEÚDO: INTRODUÇÃO ALIMENTAR */}
      {activeTab === 'solid' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Introdução Alimentar / Refeição</Text>
          
          <Text style={styles.sectionSublabel}>O que o bebê comeu?</Text>
          <TextInput
            style={styles.foodInput}
            placeholder="Ex: Papinha de mandioquinha com carne moída"
            placeholderTextColor="#A0A7B1"
            value={foodDescription}
            onChangeText={setFoodDescription}
          />

          <Text style={styles.sectionSublabel}>Aceitação</Text>
          <View style={styles.acceptanceRow}>
            {[
              { id: 'great', label: '😋 Adorou' },
              { id: 'good', label: '🙂 Comeu bem' },
              { id: 'little', label: '🤏 Comeu pouco' },
              { id: 'refused', label: '🙅 Recusou' },
            ].map((a) => (
              <TouchableOpacity
                key={a.id}
                style={[
                  styles.acceptancePill,
                  foodAcceptance === a.id && styles.acceptancePillActive,
                ]}
                onPress={() => setFoodAcceptance(a.id as SolidAcceptance)}
              >
                <Text
                  style={[
                    styles.acceptancePillText,
                    foodAcceptance === a.id && styles.acceptancePillTextActive,
                  ]}
                >
                  {a.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* QUEM MINISTROU & OBSERVAÇÕES */}
      <View style={styles.card}>
        <Text style={styles.sectionSublabel}>Quem alimentou?</Text>
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
          placeholder="Ex: Arrotou rápido, sem refluxo, bem calmo."
          placeholderTextColor="#A0A7B1"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveBtnText}>Salvar Alimentação</Text>
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
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  modeTabActive: {
    backgroundColor: Colors.primary,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  manualToggle: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  manualToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  breastTimerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  breastCircleBtn: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  breastCircleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  breastLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  breastTimerNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  breastPlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  breastStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  breastStatusTextActive: {
    color: '#FFFFFF',
  },
  timerControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
    marginBottom: 12,
  },
  totalTimeText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  totalTimeBold: {
    fontWeight: '800',
    color: Colors.primary,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.danger,
  },
  manualBreastInputs: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputCol: {
    flex: 1,
  },
  inputColLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  textInputBox: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: Colors.accentLight,
    padding: 12,
    borderRadius: Radius.md,
  },
  tipText: {
    fontSize: 11.5,
    color: '#8A5A00',
    lineHeight: 16,
    flex: 1,
  },
  sectionSublabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  contentPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  contentPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: '#F7F3EC',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  contentPillActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  contentPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  contentPillTextActive: {
    color: '#FFFFFF',
  },
  volumeDisplayRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  volumeBigText: {
    fontSize: 44,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  volumeMlUnit: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  presetChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  foodInput: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  acceptanceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  acceptancePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  acceptancePillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  acceptancePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  acceptancePillTextActive: {
    color: Colors.primary,
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
    marginTop: 8,
    ...Shadows.subtle,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
