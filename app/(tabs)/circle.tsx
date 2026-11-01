import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Copy, Share2, ShieldCheck, Heart, UserPlus, ChevronRight } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';

export default function CircleScreen() {
  const { family, members } = useApp();

  const handleCopyCode = () => {
    Alert.alert(
      'Código Copiado!',
      `O código da família ${family.invite_code} foi copiado. Envie para os avós e tios no WhatsApp!`,
      [{ text: 'Maravilha!' }]
    );
  };

  const handleShareInvite = () => {
    Alert.alert(
      'Compartilhar Convite',
      `"Olá! Baixe o app Nuri para acompanhar o crescimento do nosso bebê de forma privada e segura. Nosso código de família é: ${family.invite_code}"`,
      [{ text: 'Simular envio' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Círculo Familiar</Text>
        <Text style={styles.headerSubtitle}>Rede social 100% privada da família</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* CARTÃO DO CÓDIGO DE CONVITE */}
        <View style={styles.inviteCard}>
          <View style={styles.inviteHeader}>
            <View style={styles.inviteIconCircle}>
              <Users size={22} color={Colors.primary} />
            </View>
            <View style={styles.inviteHeaderText}>
              <Text style={styles.inviteFamilyName}>{family.name}</Text>
              <Text style={styles.inviteFamilySub}>Convide quem você mais ama</Text>
            </View>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>CÓDIGO DE ACESSO DA FAMÍLIA</Text>
            <View style={styles.codeRow}>
              <Text style={styles.codeText}>{family.invite_code}</Text>
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopyCode} activeOpacity={0.7}>
                <Copy size={16} color={Colors.primary} />
                <Text style={styles.copyBtnText}>Copiar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.shareBtn} onPress={handleShareInvite} activeOpacity={0.8}>
            <Share2 size={16} color={Colors.textInverted} />
            <Text style={styles.shareBtnText}>Enviar Convite pelo WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE MEMBROS ATUAIS */}
        <View style={styles.membersSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Membros Conectados ({members.length})</Text>
            <TouchableOpacity style={styles.addMemberBtn} onPress={handleShareInvite}>
              <UserPlus size={14} color={Colors.primary} />
              <Text style={styles.addMemberText}>Convidar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.membersList}>
            {members.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Text style={styles.memberAvatarText}>
                    {member.relationship_label.charAt(0)}
                  </Text>
                </View>

                <View style={styles.memberInfo}>
                  <Text style={styles.memberRelation}>{member.relationship_label}</Text>
                  <View style={styles.permissionsRow}>
                    <View
                      style={[
                        styles.roleBadge,
                        member.role === 'admin'
                          ? styles.roleBadgeAdmin
                          : member.role === 'caregiver'
                          ? styles.roleBadgeCaregiver
                          : styles.roleBadgeFamily,
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleBadgeText,
                          member.role === 'admin'
                            ? styles.roleBadgeTextAdmin
                            : member.role === 'caregiver'
                            ? styles.roleBadgeTextCaregiver
                            : styles.roleBadgeTextFamily,
                        ]}
                      >
                        {member.role === 'admin'
                          ? 'Administrador (Pai/Mãe)'
                          : member.role === 'caregiver'
                          ? 'Cuidador / Escola'
                          : 'Família'}
                      </Text>
                    </View>
                  </View>
                </View>

                <ChevronRight size={16} color={Colors.textMuted} />
              </View>
            ))}
          </View>
        </View>

        {/* PRIVACIDADE E SEGURANÇA (GARANTIA NURI) */}
        <View style={styles.privacyBanner}>
          <ShieldCheck size={24} color={Colors.primary} />
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>Privacidade Infantil e Segurança</Text>
            <Text style={styles.privacyText}>
              Fotos, vídeos e dados médicos são criptografados. Somente pessoas com o código da
              família aprovado pelos pais têm acesso à linha do tempo.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  inviteCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  inviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  inviteIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteHeaderText: {
    flex: 1,
  },
  inviteFamilyName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  inviteFamilySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  codeContainer: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Radius.md,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textInverted,
  },
  membersSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addMemberText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  membersList: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.secondary,
  },
  memberInfo: {
    flex: 1,
  },
  memberRelation: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  permissionsRow: {
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  roleBadgeAdmin: {
    backgroundColor: Colors.primaryLight,
  },
  roleBadgeFamily: {
    backgroundColor: Colors.secondaryLight,
  },
  roleBadgeCaregiver: {
    backgroundColor: Colors.infoLight,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  roleBadgeTextAdmin: {
    color: Colors.primaryDark,
  },
  roleBadgeTextFamily: {
    color: Colors.secondaryDark,
  },
  roleBadgeTextCaregiver: {
    color: Colors.info,
  },
  privacyBanner: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  privacyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
