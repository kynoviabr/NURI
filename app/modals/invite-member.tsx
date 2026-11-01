import React, { useState } from 'react';
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
import { Share2, Users, ShieldCheck, Heart, Sparkles, Check, Copy } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { UserRole } from '../../src/types/database';

export default function InviteMemberModal() {
  const router = useRouter();
  const { family, baby, addFamilyMember } = useApp();

  const [relationship, setRelationship] = useState('Vovó');
  const [role, setRole] = useState<UserRole>('family');
  const [customName, setCustomName] = useState('');

  const relationshipPresets = [
    { label: 'Vovô / Vovó', role: 'family' as UserRole, defaultText: 'Vovó' },
    { label: 'Padrinho / Madrinha', role: 'family' as UserRole, defaultText: 'Dinda' },
    { label: 'Titio / Titia', role: 'family' as UserRole, defaultText: 'Titia' },
    { label: 'Babá / Cuidadora', role: 'caregiver' as UserRole, defaultText: 'Babá' },
    { label: 'Escola / Berçário', role: 'caregiver' as UserRole, defaultText: 'Escola' },
    { label: 'Papai / Mamãe (Admin)', role: 'admin' as UserRole, defaultText: 'Papai' },
  ];

  const roleProfiles: {
    id: UserRole;
    title: string;
    desc: string;
    icon: string;
    badge: string;
  }[] = [
    {
      id: 'family',
      title: 'Círculo Familiar Afetivo',
      desc: 'Pode ver fotos, vídeos e mesversários. Pode curtir e deixar comentários carinhosos. Sem acesso a prontuário médico confidencial.',
      icon: '🥰',
      badge: 'Ideal para Avós e Padrinhos',
    },
    {
      id: 'caregiver',
      title: 'Cuidador / Babá / Escola',
      desc: 'Pode registrar a rotina do dia (mamadas, fraldas, sonecas) e trocar recados na agenda escolar. Sem acesso ao feed social privado.',
      icon: '🍼',
      badge: 'Ideal para Babás e Creche',
    },
    {
      id: 'admin',
      title: 'Administrador Completo',
      desc: 'Controle total da família, exames médicos, histórico de vacinas e gerenciamento de membros.',
      icon: '👑',
      badge: 'Exclusivo para Pais',
    },
  ];

  // MENSAGEM DINÂMICA PERSONALIZADA PARA WHATSAPP
  const generateInviteMessage = () => {
    const memberLabel = customName.trim() || relationship;

    if (role === 'caregiver') {
      return (
        `Olá, ${memberLabel}! 👋\n\n` +
        `Estou te convidando para o aplicativo *NURI* como cuidador(a) do(a) *${baby.name}*.\n` +
        `Você terá acesso ao diário de rotina para registrar mamadas, fraldas, sonecas e recados da mochila de forma muito prática!\n\n` +
        `🔑 Nosso Código de Acesso: *${family.invite_code}*\n` +
        `📲 Baixe o app e insira o código na entrada: https://nuriapp.com.br/convite/${family.invite_code}`
      );
    }

    return (
      `Olá, ${memberLabel}! ❤️\n\n` +
      `Criei um cantinho 100% privado e seguro para nossa família acompanhar o crescimento do(a) *${baby.name}* no aplicativo *NURI*!\n` +
      `Lá você poderá ver todas as fotos exclusivas, vídeos e mesversários, sem nenhuma exposição pública no Instagram ou Google.\n\n` +
      `🔑 Nosso Código da Família: *${family.invite_code}*\n` +
      `📲 Baixe o app e entre com nosso código: https://nuriapp.com.br/convite/${family.invite_code}`
    );
  };

  const handleShareInvite = () => {
    const finalLabel = customName.trim()
      ? `${relationship} (${customName.trim()})`
      : relationship;

    // Registra o novo membro pré-autorizado
    addFamilyMember({
      relationship_label: finalLabel,
      role,
      can_post: role === 'admin' || role === 'family',
      can_view_routine: true,
      can_edit_routine: role === 'admin' || role === 'caregiver',
      can_view_health: role === 'admin' || role === 'family',
      can_edit_health: role === 'admin',
    });

    const msg = generateInviteMessage();

    Alert.alert(
      'Convite Gerado com Sucesso! 🎉',
      msg,
      [
        {
          text: 'Copiar Mensagem',
          onPress: () => {
            Alert.alert('Copiado!', 'Mensagem copiada. Agora cole na conversa do WhatsApp!');
            router.back();
          },
        },
        { text: 'Concluir', onPress: () => router.back() },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* CARD DO CÓDIGO DA FAMÍLIA */}
      <View style={styles.codeTicket}>
        <View style={styles.codeTicketHeader}>
          <Users size={20} color={Colors.primary} />
          <Text style={styles.codeTicketTitle}>Família: {family.name}</Text>
        </View>
        <Text style={styles.codeString}>{family.invite_code}</Text>
        <Text style={styles.codeHelp}>
          Este código exclusivo garante que apenas pessoas convidadas por você tenham acesso.
        </Text>
      </View>

      {/* SELEÇÃO DO PARENTESCO / PAPEL */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quem você está convidando?</Text>

        <View style={styles.presetsGrid}>
          {relationshipPresets.map((p, i) => {
            const isSelected = relationship === p.defaultText;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.presetChip, isSelected && styles.presetChipActive]}
                onPress={() => {
                  setRelationship(p.defaultText);
                  setRole(p.role);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.inputLabel, { marginTop: 14 }]}>Nome da pessoa (opcional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Ex: Vera Lúcia, Sandra, Tia Carol"
          placeholderTextColor="#A0A7B1"
          value={customName}
          onChangeText={setCustomName}
        />
      </View>

      {/* SELEÇÃO DO PERFIL DE PERMISSÕES */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Nível de Acesso & Permissões</Text>

        {roleProfiles.map((p) => {
          const isSelected = role === p.id;

          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.roleCard, isSelected && styles.roleCardActive]}
              onPress={() => setRole(p.id)}
              activeOpacity={0.8}
            >
              <View style={styles.roleHeaderRow}>
                <Text style={styles.roleEmoji}>{p.icon}</Text>
                <View style={styles.roleTitleCol}>
                  <Text style={[styles.roleTitle, isSelected && styles.roleTitleActive]}>
                    {p.title}
                  </Text>
                  <View style={styles.roleBadgePill}>
                    <Text style={styles.roleBadgeText}>{p.badge}</Text>
                  </View>
                </View>
                <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </View>

              <Text style={styles.roleDesc}>{p.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* PRÉVIA DA MENSAGEM DO WHATSAPP */}
      <View style={styles.previewBox}>
        <View style={styles.previewHeader}>
          <Sparkles size={14} color={Colors.secondary} />
          <Text style={styles.previewTitle}>PRÉVIA DO CONVITE PARA O WHATSAPP</Text>
        </View>
        <Text style={styles.previewText}>{generateInviteMessage()}</Text>
      </View>

      {/* BOTÃO COMPARTILHAR */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShareInvite} activeOpacity={0.85}>
        <Share2 size={18} color="#FFFFFF" />
        <Text style={styles.shareBtnText}>Gerar Convite & Enviar no WhatsApp</Text>
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
  codeTicket: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  codeTicketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  codeTicketTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  codeString: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: 3,
    marginVertical: 4,
  },
  codeHelp: {
    fontSize: 11.5,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 280,
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
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
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
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleCard: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 10,
  },
  roleCardActive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.primary,
    ...Shadows.subtle,
  },
  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  roleEmoji: {
    fontSize: 22,
  },
  roleTitleCol: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  roleTitleActive: {
    color: Colors.primary,
  },
  roleBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAE3D6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#D4C9BC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  roleDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginTop: 4,
  },
  previewBox: {
    backgroundColor: '#FBF9F5',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE4D6',
    marginBottom: Spacing.md,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  previewTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondaryDark,
    letterSpacing: 0.5,
  },
  previewText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  shareBtn: {
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
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
