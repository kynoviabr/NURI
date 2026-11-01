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
import { Check, AlertTriangle, Package, FileText, Backpack } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { SchoolNoteType, SchoolNotePriority } from '../../src/types/database';

export default function AddSchoolNoteModal() {
  const router = useRouter();
  const { addSchoolNote } = useApp();

  const [type, setType] = useState<SchoolNoteType>('entry_note');
  const [priority, setPriority] = useState<SchoolNotePriority>('normal');
  const [title, setTitle] = useState('Recado de Entrada');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('Marina (Mamãe)');
  const [authorRole, setAuthorRole] = useState('Mãe');

  // ITENS DA MOCHILA SELECIONADOS
  const [selectedSupplies, setSelectedSupplies] = useState<string[]>([]);

  const noteTypes: {
    id: SchoolNoteType;
    label: string;
    icon: string;
    defaultTitle: string;
  }[] = [
    { id: 'entry_note', label: '🎒 Recado de Entrada', icon: '🎒', defaultTitle: 'Recado de Entrada - Mamãe' },
    { id: 'school_report', label: '📋 Relatório do Dia', icon: '📋', defaultTitle: 'Relatório do Berçário / Babá' },
    { id: 'supplies_needed', label: '📦 Reposição Mochila', icon: '📦', defaultTitle: 'Reposição de Itens na Mochila' },
    { id: 'incident', label: '🚨 Ocorrência / Alerta', icon: '🚨', defaultTitle: 'Ocorrência Médica / Comportamental' },
  ];

  const commonSupplies = [
    'Fraldas tamanho M',
    'Lenço umedecido',
    'Pomada de assadura',
    'Troca de roupa extra',
    'Fórmula infantil em pó',
    'Agasalho quentinho',
    'Paninho de boca',
  ];

  const toggleSupply = (supply: string) => {
    setSelectedSupplies((prev) =>
      prev.includes(supply) ? prev.filter((s) => s !== supply) : [...prev, supply]
    );
  };

  const handleSave = () => {
    if (!content.trim() && selectedSupplies.length === 0) {
      Alert.alert('Escreva o recado', 'Digite o aviso ou selecione os itens da mochila.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    addSchoolNote({
      date: todayStr,
      type,
      title: title.trim() || 'Recado Escolar',
      content: content.trim(),
      author_name: authorName,
      author_role: authorRole,
      priority,
      supplies_list: selectedSupplies.length > 0 ? selectedSupplies : undefined,
    });

    Alert.alert('Recado Registrado! 📝', 'O recado foi salvo na agenda escolar com sucesso.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SELEÇÃO DO TIPO DE RECADO */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tipo de Comunicação</Text>
        <View style={styles.typeGrid}>
          {noteTypes.map((nt) => {
            const isSelected = type === nt.id;
            return (
              <TouchableOpacity
                key={nt.id}
                style={[styles.typeTile, isSelected && styles.typeTileActive]}
                onPress={() => {
                  setType(nt.id);
                  setTitle(nt.defaultTitle);
                  if (nt.id === 'incident') setPriority('urgent');
                  else if (nt.id === 'supplies_needed') setPriority('important');
                  else setPriority('normal');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.typeIcon}>{nt.icon}</Text>
                <Text style={[styles.typeLabel, isSelected && styles.typeLabelActive]}>
                  {nt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* PRIORIDADE */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>PRIORIDADE DO RECADO</Text>
        <View style={styles.priorityRow}>
          {[
            { id: 'normal', label: 'Normal' },
            { id: 'important', label: 'Importante' },
            { id: 'urgent', label: '🚨 Urgente' },
          ].map((pr) => (
            <TouchableOpacity
              key={pr.id}
              style={[
                styles.priorityChip,
                priority === pr.id &&
                  (pr.id === 'urgent'
                    ? styles.priorityChipUrgent
                    : pr.id === 'important'
                    ? styles.priorityChipImportant
                    : styles.priorityChipActive),
              ]}
              onPress={() => setPriority(pr.id as SchoolNotePriority)}
            >
              <Text
                style={[
                  styles.priorityChipText,
                  priority === pr.id && styles.priorityChipTextActive,
                ]}
              >
                {pr.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* TÍTULO E CONTEÚDO */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>TÍTULO DO RECADO</Text>
        <TextInput
          style={styles.inputBox}
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Recado de Entrada"
        />

        <Text style={[styles.sectionLabel, { marginTop: 14 }]}>MENSAGEM / OBSERVAÇÕES</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ex: Théo mamou às 7h15, tomou remédio de refluxo e está bem disposto. Agasalho extra na mochila."
          placeholderTextColor="#A0A7B1"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* REPOSIÇÃO DE ITENS NA MOCHILA (SE APLICÁVEL) */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📦 Itens Necessários na Mochila</Text>
        <Text style={styles.suppliesHint}>
          Toque para marcar o que a família precisa repor na próxima ida:
        </Text>

        <View style={styles.suppliesGrid}>
          {commonSupplies.map((item) => {
            const isChecked = selectedSupplies.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[styles.supplyChip, isChecked && styles.supplyChipChecked]}
                onPress={() => toggleSupply(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkCircle, isChecked && styles.checkCircleChecked]}>
                  {isChecked && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                </View>
                <Text style={[styles.supplyText, isChecked && styles.supplyTextChecked]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* QUEM ESTÁ ESCREVENDO */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>QUEM ESTÁ ENVIANDO O RECADO?</Text>
        <View style={styles.authorsRow}>
          {[
            { name: 'Marina (Mamãe)', role: 'Mãe' },
            { name: 'Lucas (Papai)', role: 'Pai' },
            { name: 'Tia Sandra (Babá)', role: 'Cuidadora' },
            { name: 'Profª Juliana', role: 'Escola / Berçário' },
          ].map((a) => (
            <TouchableOpacity
              key={a.name}
              style={[styles.authorChip, authorName === a.name && styles.authorChipActive]}
              onPress={() => {
                setAuthorName(a.name);
                setAuthorRole(a.role);
              }}
            >
              <Text style={[styles.authorChipText, authorName === a.name && styles.authorChipTextActive]}>
                {a.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveBtnText}>Publicar Recado na Agenda</Text>
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeTile: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  typeTileActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  typeIcon: {
    fontSize: 22,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  priorityChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  priorityChipImportant: {
    backgroundColor: Colors.warning,
    borderColor: Colors.warning,
  },
  priorityChipUrgent: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  priorityChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  priorityChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  inputBox: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 13.5,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 85,
    textAlignVertical: 'top',
    lineHeight: 19,
  },
  suppliesHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  suppliesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supplyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9F6F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  supplyChipChecked: {
    backgroundColor: Colors.secondaryLight,
    borderColor: Colors.secondary,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: '#D4C9BC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleChecked: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  supplyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  supplyTextChecked: {
    color: Colors.secondaryDark,
    fontWeight: '700',
  },
  authorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  authorChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  authorChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  authorChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  authorChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    marginTop: 4,
    ...Shadows.subtle,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
