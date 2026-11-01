import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Play, Square, Clock, AlertTriangle, ShieldCheck } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';

export default function ContractionTimerModal() {
  const { contractions, addContraction } = useApp();

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggle = () => {
    if (!isRunning) {
      // Começou
      setSeconds(0);
      setIsRunning(true);
    } else {
      // Parou
      setIsRunning(false);
      if (seconds > 3) {
        addContraction(seconds, contractions.length > 0 ? 300 : undefined);
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Contador de Contrações</Text>
        <Text style={styles.headerSub}>
          Monitore o intervalo e a duração das contrações para saber a hora de ir à maternidade.
        </Text>
      </View>

      {/* PAINEL DO CRONÔMETRO CENTRAL */}
      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>{isRunning ? 'CONTRAÇÃO EM ANDAMENTO' : 'TOQUE PARA INICIAR'}</Text>
        <Text style={styles.timerDisplay}>{formatTime(seconds)}</Text>

        <TouchableOpacity
          style={[styles.timerButton, isRunning ? styles.timerButtonStop : styles.timerButtonStart]}
          onPress={handleToggle}
          activeOpacity={0.85}
        >
          {isRunning ? (
            <>
              <Square size={22} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.timerButtonText}>Parar Contração</Text>
            </>
          ) : (
            <>
              <Play size={22} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.timerButtonText}>Começou a Contração</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* REGRA 5-1-1 (ORIENTAÇÃO MÉDICA OBSTÉTRICA) */}
      <View style={styles.ruleCard}>
        <View style={styles.ruleHeader}>
          <AlertTriangle size={18} color="#B45309" />
          <Text style={styles.ruleTitle}>A REGRA DE OURO (5-1-1)</Text>
        </View>
        <Text style={styles.ruleDesc}>
          Vá para a maternidade quando as contrações ocorrerem a cada <Text style={styles.boldText}>5 minutos</Text>, durando pelo menos <Text style={styles.boldText}>1 minuto cada</Text>, de forma constante por <Text style={styles.boldText}>1 hora</Text>.
        </Text>
      </View>

      {/* HISTÓRICO DE CONTRAÇÕES */}
      <Text style={styles.historyTitle}>Histórico da Sessão ({contractions.length})</Text>
      <View style={styles.historyList}>
        {contractions.length > 0 ? (
          contractions.map((c, i) => (
            <View key={c.id} style={styles.historyRow}>
              <View style={styles.indexCircle}>
                <Text style={styles.indexCircleText}>{contractions.length - i}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyDuration}>Duração: {c.duration_seconds} segundos</Text>
                <Text style={styles.historyTime}>
                  Iniciada às {new Date(c.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </Text>
              </View>
              <View style={styles.intervalBadge}>
                <Clock size={11} color={Colors.textMuted} />
                <Text style={styles.intervalBadgeText}>
                  {c.interval_seconds ? `~${Math.floor(c.interval_seconds / 60)} min` : '1ª'}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma contração registrada nesta sessão ainda.</Text>
        )}
      </View>
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
  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.card,
  },
  timerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '900',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
    marginBottom: 20,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 16,
    borderRadius: Radius.lg,
    ...Shadows.subtle,
  },
  timerButtonStart: {
    backgroundColor: Colors.primary,
  },
  timerButtonStop: {
    backgroundColor: Colors.danger,
  },
  timerButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ruleCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ruleTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  ruleDesc: {
    fontSize: 12.5,
    color: '#92400E',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '800',
  },
  historyTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  historyList: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFE6',
    gap: 10,
  },
  indexCircle: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexCircleText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  historyDuration: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historyTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  intervalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  intervalBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  emptyText: {
    padding: 16,
    fontSize: 12.5,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
