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
import { Users, Copy, Share2, ShieldCheck, Heart, UserPlus, ChevronRight, Lock } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';

export default function CircleScreen() {
  const { family, members } = useApp();

  const handleCopyCode = () => {
    Alert.alert(
      'Código Copiado!',
      `O código da família ${family.invite_code} foi copiado. Envie para os avós e padrinhos no WhatsApp!`,
      [{ text: 'Maravilha!' }]
    );
  };

  const handleShareInvite = () => {
    Alert.alert(
      'Compartilhar Convite',
      `"Olá! Baixe o app Nuri para acompanhar o crescimento do nosso bebê de forma privada e segura. Nosso código de família é: ${family.invite_code}"`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Círculo Familiar</Text>
          <Text style={styles.headerSubtitle}>Rede social 100% privada da família</Text>
        </View>
        <View style={styles.privatePill}>
          <Lock size={12} color={Colors.primary} />
          <Text style={styles.privatePillText}>Fechado</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* CARTÃO DE CONVITE DA FAMÍLIA (ESTILO TICKET PREMIUM) */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View style={styles.ticketIconCircle}>
              <Users size={22} color={Colors.primary} />
            </View>
            <View style={styles.ticketHeaderTextWrap}>
              <Text style={styles.ticketFamilyName}>{family.name}</Text>
              <Text style={styles.ticketSub}>Convide quem você mais ama</Text>
            </View>
          </View>

          <View style={styles.codeBox}>
            <Text style={styles.codeBoxLabel}>CÓDIGO DE ENTRADA EXCLUSIVO</Text>
            <View style={styles.codeRow}>
              <Text style={styles.codeString}>{family.invite_code}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode} activeOpacity={0.7}>
                <Copy size={15} color={Colors.primary} />
                <Text style={styles.copyButtonText}>Copiar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.whatsappBtn} onPress={handleShareInvite} activeOpacity={0.85}>
            <Share2 size={16} color="#FFFFFF" />
            <Text style={styles.whatsappBtnText}>Convidar Avós e Padrinhos via WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE MEMBROS CONECTADOS */}
        <View style={styles.membersSection}>
          <View style={styles.membersHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Membros Conectados ({members.length})</Text>
              <Text style={styles.sectionSubtitle}>Quem tem acesso às fotos e momentos</Text>
            </View>
            <TouchableOpacity style={styles.inviteMiniBtn} onPress={handleShareInvite}>
              <UserPlus size={14} color={Colors.primary} />
              <Text style={styles.inviteMiniText}>Convidar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.membersListCard}>
            {members.map((member) => (
              <View key={member.id} style={styles.memberRow}>
                <View style={styles.memberAvatarCircle}>
                  <Text style={styles.memberAvatarLetter}>
                    {member.relationship_label.charAt(0)}
                  </Text>
                </View>

                <View style={styles.memberMeta}>
                  <Text style={styles.memberRelationName}>{member.relationship_label}</Text>
                  <View style={styles.rolesRow}>
                    <View
                      style={[
                        styles.roleTag,
                        member.role === 'admin'
                          ? styles.roleTagAdmin
                          : member.role === 'caregiver'
                          ? styles.roleTagCaregiver
                          : styles.roleTagFamily,
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleTagText,
                          member.role === 'admin'
                            ? styles.roleTagTextAdmin
                            : member.role === 'caregiver'
                            ? styles.roleTagTextCaregiver
                            : styles.roleTagTextFamily,
                        ]}
                      >
                        {member.role === 'admin'
                          ? 'Administrador (Pai/Mãe)'
                          : member.role === 'caregiver'
                          ? 'Cuidador / Escola'
                          : 'Círculo Familiar'}
                      </Text>
                    </View>
                  </View>
                </View>

                <ChevronRight size={16} color="#D8D0C5" />
              </View>
            ))}
          </View>
        </View>

        {/* COMPLIANCE E PRIVACIDADE INFANTIL */}
        <View style={styles.securityBox}>
          <ShieldCheck size={26} color={Colors.primary} />
          <View style={styles.securityTextWrap}>
            <Text style={styles.securityTitle}>Privacidade Infantil e Segurança</Text>
            <Text style={styles.securityDesc}>
              Zero algoritmos, zero anúncios e zero exposição pública no Google. Suas memórias
              familiares pertencem exclusivamente a você e aos parentes que você convidar.
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  privatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  privatePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 50,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  ticketIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketHeaderTextWrap: {
    flex: 1,
  },
  ticketFamilyName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  ticketSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  codeBox: {
    backgroundColor: '#FAF7F2',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECE4D6',
    marginBottom: 14,
  },
  codeBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeString: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2D8C7',
    ...Shadows.subtle,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    borderRadius: Radius.md,
    ...Shadows.subtle,
  },
  whatsappBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  membersSection: {
    marginBottom: Spacing.lg,
  },
  membersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  inviteMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  inviteMiniText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  membersListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFE6',
    gap: 12,
  },
  memberAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarLetter: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.secondary,
  },
  memberMeta: {
    flex: 1,
  },
  memberRelationName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rolesRow: {
    marginTop: 3,
  },
  roleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  roleTagAdmin: {
    backgroundColor: Colors.primaryLight,
  },
  roleTagFamily: {
    backgroundColor: Colors.secondaryLight,
  },
  roleTagCaregiver: {
    backgroundColor: Colors.infoLight,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  roleTagTextAdmin: {
    color: Colors.primaryDark,
  },
  roleTagTextFamily: {
    color: Colors.secondaryDark,
  },
  roleTagTextCaregiver: {
    color: Colors.info,
  },
  securityBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  securityTextWrap: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
});
