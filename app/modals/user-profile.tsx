import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Users,
  Baby,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Share2,
} from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { UserRole } from '../../src/types/database';

export default function UserProfileModal() {
  const router = useRouter();
  const { profile, signOut, enterDemoMode, isDemoMode } = useAuth();
  const { family, baby } = useApp();

  const handleSignOut = async () => {
    Alert.alert(
      'Encerrar Sessão',
      'Deseja realmente sair da sua conta no NURI?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleSwitchDemoRole = (role: UserRole) => {
    enterDemoMode(role);
    Alert.alert('Perfil Alterado!', `Você agora está visualizando o app no papel de: ${role.toUpperCase()}`);
  };

  const currentRole = profile?.role || 'admin';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* CARD DO USUÁRIO LOGADO */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={36} color={Colors.primary} />
            </View>
          )}
          <View style={styles.providerBadge}>
            <Text style={styles.providerBadgeText}>
              {profile?.provider === 'google'
                ? '🔴 Google'
                : profile?.provider === 'facebook'
                ? '🔵 Facebook'
                : '✉️ Email'}
            </Text>
          </View>
        </View>

        <Text style={styles.userName}>{profile?.name || 'Família Silva'}</Text>
        <Text style={styles.userEmail}>{profile?.email || 'contato@nuri.app'}</Text>

        <View style={styles.roleTag}>
          <ShieldCheck size={14} color="#059669" />
          <Text style={styles.roleTagText}>
            {currentRole === 'admin'
              ? '👑 Administrador / Pais (Acesso Total)'
              : currentRole === 'family'
              ? '🏡 Família / Parentes (Visualização & Fotos)'
              : '🍼 Cuidador / Escola (Rotina & Diário)'}
          </Text>
        </View>
      </View>

      {/* DADOS DA FAMÍLIA & BEBÊ */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Círculo Familiar Ativo</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Users size={18} color={Colors.primary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nome da Família</Text>
            <Text style={styles.infoValue}>{family.name}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Baby size={18} color={Colors.secondary} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Bebê Cadastrado</Text>
            <Text style={styles.infoValue}>
              {baby.name} ({baby.status === 'born' ? 'Nascido' : 'Em Gestação'})
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <KeyRound size={18} color="#D97706" />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Código de Convite da Família</Text>
            <Text style={styles.infoValueCode}>{family.invite_code}</Text>
          </View>
        </View>
      </View>

      {/* ALTERNADOR DE PAPEL (PARA DEMONSTRAÇÃO E TESTES) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Sparkles size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Simular Nível de Permissão</Text>
        </View>
        <Text style={styles.sectionDescription}>
          Alterne entre os papéis para testar as regras de acesso da família:
        </Text>

        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[styles.roleBtn, currentRole === 'admin' && styles.roleBtnActive]}
            onPress={() => handleSwitchDemoRole('admin')}
          >
            <Text style={[styles.roleBtnTitle, currentRole === 'admin' && styles.roleBtnTitleActive]}>
              👑 Pais / Admin
            </Text>
            <Text style={styles.roleBtnDesc}>Edição total de saúde e família</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, currentRole === 'family' && styles.roleBtnActive]}
            onPress={() => handleSwitchDemoRole('family')}
          >
            <Text style={[styles.roleBtnTitle, currentRole === 'family' && styles.roleBtnTitleActive]}>
              👵 Vovô / Vovó
            </Text>
            <Text style={styles.roleBtnDesc}>Acesso a fotos, sem editar saúde</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, currentRole === 'caregiver' && styles.roleBtnActive]}
            onPress={() => handleSwitchDemoRole('caregiver')}
          >
            <Text style={[styles.roleBtnTitle, currentRole === 'caregiver' && styles.roleBtnTitleActive]}>
              🍼 Babá / Escola
            </Text>
            <Text style={styles.roleBtnDesc}>Registra mamadas e diário escolar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTÃO DE LOGOUT */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.8}>
        <LogOut size={18} color="#DC2626" />
        <Text style={styles.signOutBtnText}>Sair da Conta / Trocar Usuário</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>NURI v1.0.0 • Supabase Auth & SecureStore</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#F0EBE1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  providerBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    ...Shadows.subtle,
  },
  providerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  roleTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F2EFE9',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  infoValueCode: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  roleOptions: {
    gap: 8,
  },
  roleBtn: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E4E7EC',
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  roleBtnActive: {
    backgroundColor: '#FFF7ED',
    borderColor: Colors.primary,
  },
  roleBtnTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  roleBtnTitleActive: {
    color: Colors.primary,
  },
  roleBtnDesc: {
    fontSize: 11.5,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: Radius.md,
    paddingVertical: 14,
    marginBottom: Spacing.lg,
  },
  signOutBtnText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  versionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
