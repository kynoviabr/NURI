import React, { useState, useEffect } from 'react';
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
import { Moon, Sun, Play, Square, Check, Sparkles, MapPin, Smile } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { SleepType, SleepLocation, SleepQuality } from '../../src/types/database';
import { formatTimerSeconds } from '../../src/utils/babyCalculations';

export default function AddSleepModal() {
  const router = useRouter();
  const { addSleepLog, sleeps, finishActiveSleep } = useApp();

  // Verifica se há sono em andamento (sem end_time)
  const activeOngoingSleep = sleeps.find((s) => !s.end_time);

  const [mode, setMode] = useState<'live' | 'manual'>(activeOngoingSleep ? 'live' : 'manual');
  const [sleepType, setSleepType] = useState<SleepType>('nap');
  const [location, setLocation] = useState<SleepLocation>('crib');
  const [quality, setQuality] = useState<SleepQuality>('calm');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [loggedBy, setLoggedBy] = useState('Mamãe');
  const [notes, setNotes] = useState('');

  // Contador em tempo real caso esteja dormindo agora
  const [liveElapsedSec, setLiveElapsedSec] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeOngoingSleep) {
      const startMs = new Date(activeOngoingSleep.start_time).getTime();
      const updateSeconds = () => {
        const diff = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
        setLiveElapsedSec(diff);
      };
      updateSeconds();
      interval = setInterval(updateSeconds, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeOngoingSleep]);

  const handleStartLiveSleep = () => {
    const nowIso = new Date().toISOString();
    addSleepLog({
      baby_id: 'b1',
      start_time: nowIso,
      sleep_type: sleepType,
      location,
      quality,
      logged_by: loggedBy,
      notes: notes.trim() || undefined,
    });
    Alert.alert('Bebê Nanando... 🌙', 'O cronômetro de sono começou. Ao acordar, finalize aqui no app.');
  };

  const handleWakeUp = () => {
    if (!activeOngoingSleep) return;
    finishActiveSleep(activeOngoingSleep.id);
    Alert.alert('Bebê Acordou! ☀️', 'Soneca finalizada e contabilizada na rotina diária.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleSaveManual = () => {
    const now = new Date();
    const start = new Date(now.getTime() - durationMinutes * 60 * 1000);

    addSleepLog({
      baby_id: 'b1',
      start_time: start.toISOString(),
      end_time: now.toISOString(),
      duration_minutes: durationMinutes,
      sleep_type: sleepType,
      location,
      quality,
      notes: notes.trim() || undefined,
      logged_by: loggedBy,
    });

    Alert.alert('Sono Registrado! 🌙', `Salvo: ${durationMinutes} min de ${sleepType === 'nap' ? 'soneca' : 'sono noturno'}.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const durationPresets = [30, 45, 60, 90, 120, 180, 240, 360];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SELETOR DE MODO (AO VIVO VS MANUAL) */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'live' && styles.modeTabActive]}
          onPress={() => setMode('live')}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeTabText, mode === 'live' && styles.modeTabTextActive]}>
            ⏱️ Dormindo Agora (Ao Vivo)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeTab, mode === 'manual' && styles.modeTabActive]}
          onPress={() => setMode('manual')}
          activeOpacity={0.8}
        >
          <Text style={[styles.modeTabText, mode === 'manual' && styles.modeTabTextActive]}>
            📝 Registro Manual
          </Text>
        </TouchableOpacity>
      </View>

      {/* MODO AO VIVO */}
      {mode === 'live' && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acompanhamento em Tempo Real</Text>

          {activeOngoingSleep ? (
            <View style={styles.ongoingBox}>
              <View style={styles.sleepingGlow}>
                <Moon size={36} color={Colors.primary} />
              </View>
              <Text style={styles.sleepingStatusTitle}>Bebê está dormindo agora</Text>
              <Text style={styles.liveTimerText}>{formatTimerSeconds(liveElapsedSec)}</Text>
              <Text style={styles.liveTimerSub}>Tempo total de soninho até o momento</Text>

              <TouchableOpacity
                style={styles.wakeUpBtn}
                onPress={handleWakeUp}
                activeOpacity={0.85}
              >
                <Square size={18} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.wakeUpBtnText}>Bebê Acordou! (Finalizar)</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.startLiveBox}>
              <Text style={styles.startLiveDesc}>
                Clique abaixo no momento exato em que o bebê fechar os olhinhos e adormecer. O app cuidará da contagem!
              </Text>

              <TouchableOpacity
                style={styles.startLiveBtn}
                onPress={handleStartLiveSleep}
                activeOpacity={0.85}
              >
                <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.startLiveBtnText}>Coloquei o Bebê para Nanar Agora</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* TIPO DE SONO (SONECA VS NOITE) */}
      <View style={styles.card}>
        <Text style={styles.sectionSublabel}>Tipo de Sono</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeBtn, sleepType === 'nap' && styles.typeBtnActive]}
            onPress={() => setSleepType('nap')}
            activeOpacity={0.8}
          >
            <Sun size={20} color={sleepType === 'nap' ? Colors.secondary : Colors.textSecondary} />
            <Text style={[styles.typeBtnText, sleepType === 'nap' && styles.typeBtnTextActive]}>
              Soneca Diurna
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, sleepType === 'night' && styles.typeBtnActive]}
            onPress={() => setSleepType('night')}
            activeOpacity={0.8}
          >
            <Moon size={20} color={sleepType === 'night' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.typeBtnText, sleepType === 'night' && styles.typeBtnTextActive]}>
              Sono Noturno
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DURAÇÃO MANUAL (APENAS SE MANUAL) */}
      {mode === 'manual' && (
        <View style={styles.card}>
          <Text style={styles.sectionSublabel}>Duração do Sono</Text>
          <View style={styles.durationBigRow}>
            <Text style={styles.durationNumber}>
              {durationMinutes >= 60
                ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ''}`
                : `${durationMinutes}m`}
            </Text>
          </View>

          <View style={styles.presetGrid}>
            {durationPresets.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.presetChip,
                  durationMinutes === m && styles.presetChipActive,
                ]}
                onPress={() => setDurationMinutes(m)}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    durationMinutes === m && styles.presetChipTextActive,
                  ]}
                >
                  {m < 60 ? `${m} min` : `${m / 60}h`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ONDE DORMIU? */}
      <View style={styles.card}>
        <Text style={styles.sectionSublabel}>Onde dormiu?</Text>
        <View style={styles.locationsGrid}>
          {[
            { id: 'crib', label: 'Berço' },
            { id: 'arms', label: 'No Colo' },
            { id: 'stroller', label: 'Carrinho' },
            { id: 'bed', label: 'Cama Compartilhada' },
          ].map((loc) => (
            <TouchableOpacity
              key={loc.id}
              style={[
                styles.locChip,
                location === loc.id && styles.locChipActive,
              ]}
              onPress={() => setLocation(loc.id as SleepLocation)}
            >
              <Text
                style={[
                  styles.locChipText,
                  location === loc.id && styles.locChipTextActive,
                ]}
              >
                {loc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionSublabel, { marginTop: 16 }]}>Qualidade do Sono</Text>
        <View style={styles.locationsGrid}>
          {[
            { id: 'calm', label: 'Tranquilo / Calmo' },
            { id: 'agitated', label: 'Agitado / Gemeu' },
            { id: 'restless', label: 'Acordou Várias Vezes' },
          ].map((q) => (
            <TouchableOpacity
              key={q.id}
              style={[
                styles.locChip,
                quality === q.id && styles.locChipActive,
              ]}
              onPress={() => setQuality(q.id as SleepQuality)}
            >
              <Text
                style={[
                  styles.locChipText,
                  quality === q.id && styles.locChipTextActive,
                ]}
              >
                {q.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* QUEM COLOCOU PARA DORMIR & NOTAS */}
      <View style={styles.card}>
        <Text style={styles.sectionSublabel}>Quem colocou para dormir?</Text>
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
          placeholder="Ex: Usou chupeta, ruído branco de chuva ligado."
          placeholderTextColor="#A0A7B1"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      {/* BOTÃO SALVAR SE MANUAL */}
      {mode === 'manual' && (
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveManual} activeOpacity={0.85}>
          <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.saveBtnText}>Salvar Registro de Sono</Text>
        </TouchableOpacity>
      )}
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
    fontSize: 12.5,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  ongoingBox: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  sleepingGlow: {
    width: 70,
    height: 70,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sleepingStatusTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  liveTimerText: {
    fontSize: 38,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: 2,
  },
  liveTimerSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 18,
  },
  wakeUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    width: '100%',
    ...Shadows.subtle,
  },
  wakeUpBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  startLiveBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  startLiveDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  startLiveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    width: '100%',
    ...Shadows.subtle,
  },
  startLiveBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '800',
  },
  sectionSublabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    borderWidth: 1.5,
    borderColor: '#ECE4D6',
  },
  typeBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.primary,
  },
  typeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  typeBtnTextActive: {
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  durationBigRow: {
    alignItems: 'center',
    marginBottom: 14,
  },
  durationNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primaryDark,
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
    fontSize: 12.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  locChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  locChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  locChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
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
