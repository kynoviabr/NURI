import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, G } from 'react-native-svg';
import { ShieldCheck, Heart, Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { UserRole } from '../../src/types/database';

// Ícone Oficial do Google
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

// Ícone Oficial do Facebook
const FacebookIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="#FFFFFF"
    />
  </Svg>
);

// Ícone Oficial da Apple
const AppleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 170 170">
    <Path
      d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.86-12-14.46-6.19-9.45-11.04-20.44-14.56-32.96-3.52-12.52-5.28-24.59-5.28-36.21 0-13.69 3.52-25.12 10.56-34.29 7.04-9.16 15.85-13.84 26.43-14.04 5.34 0 11.2 1.37 17.58 4.11 6.38 2.74 10.15 4.17 11.31 4.29 1.58-.22 5.63-1.74 12.16-4.57 6.53-2.83 12.18-4.14 16.96-3.93 12.63.63 22.84 5.25 30.64 13.86-11.09 6.74-16.53 15.88-16.32 27.42.21 9.04 3.73 16.73 10.56 23.08 6.83 6.34 14.86 10.05 24.09 11.13-2.22 6.83-5.02 14.28-8.4 22.36zM119.22 33.56c-.09-.34-.14-.7-.14-1.08 0-7.38 2.82-14.41 8.46-21.09 5.64-6.68 12.72-10.74 21.24-12.18.52 3.8.44 7.6-.24 11.41-.68 3.8-2.29 7.42-4.83 10.87-2.9 3.96-6.47 7.02-10.72 9.18-4.25 2.16-8.83 3.31-13.77 3.44v-.55z"
      fill="#FFFFFF"
    />
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const {
    signInWithSocial,
    signInWithEmail,
    signUpWithEmail,
    enterDemoMode,
    isLoading,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Executa login social com Google, Facebook ou Apple
  const handleSocial = async (provider: 'google' | 'facebook' | 'apple') => {
    setNotice(null);
    const res = await signInWithSocial(provider);
    if (!res.success) {
      if (res.error?.includes('provider is not enabled') || res.error?.includes('Unsupported provider')) {
        setNotice(
          `O login via ${provider.toUpperCase()} precisa ser ativado no seu painel Supabase com as credenciais da API.`
        );
      } else {
        Alert.alert('Aviso de Autenticação', res.error || 'Não foi possível concluir o login.');
      }
    } else {
      router.replace('/(tabs)');
    }
  };

  // Login ou Cadastro por Email
  const handleEmailAuth = async () => {
    setNotice(null);
    if (!email || !password) {
      Alert.alert('Preencha os campos', 'Informe seu email e senha para prosseguir.');
      return;
    }

    if (authMode === 'signup' && !fullName) {
      Alert.alert('Nome obrigatório', 'Informe como deseja ser chamado pela família.');
      return;
    }

    if (authMode === 'login') {
      const res = await signInWithEmail(email, password);
      if (res.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erro no Login', res.error || 'Verifique seus dados de acesso.');
      }
    } else {
      const res = await signUpWithEmail(email, password, fullName);
      if (res.success) {
        Alert.alert('Conta criada com sucesso!', 'Bem-vindo ao NURI! Acessando sua conta...');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Erro no Cadastro', res.error || 'Não foi possível criar a conta.');
      }
    }
  };

  // Acesso rápido de testes no modo demonstração
  const handleFastDemo = (role: UserRole) => {
    enterDemoMode(role);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* LOGO & BOAS-VINDAS */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Sparkles size={28} color="#FFFFFF" strokeWidth={2.4} />
          </View>
          <Text style={styles.brandTitle}>NURI</Text>
          <Text style={styles.tagline}>Bebê & Círculo Familiar</Text>
          <Text style={styles.description}>
            Acompanhe a gestação, rotina diária, saúde pediátrica e eternize memórias em um espaço 100% privado.
          </Text>
        </View>

        {/* MENSAGEM / AVISO INFORMATIVO */}
        {notice && (
          <View style={styles.noticeBox}>
            <ShieldCheck size={18} color={Colors.primary} />
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        )}

        {/* BOTÕES DE LOGIN SOCIAL (GOOGLE, FACEBOOK, APPLE) */}
        <View style={styles.socialSection}>
          {/* BOTÃO GOOGLE (GMAIL) */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={() => handleSocial('google')}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <View style={styles.btnIconContainer}>
              <GoogleIcon />
            </View>
            <Text style={styles.googleBtnText}>Continuar com o Google (Gmail)</Text>
          </TouchableOpacity>

          {/* BOTÃO FACEBOOK (META) */}
          <TouchableOpacity
            style={styles.facebookBtn}
            onPress={() => handleSocial('facebook')}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            <View style={styles.btnIconContainer}>
              <FacebookIcon />
            </View>
            <Text style={styles.facebookBtnText}>Continuar com o Facebook</Text>
          </TouchableOpacity>

          {/* BOTÃO APPLE (OBRIGATÓRIO APP STORE) */}
          {(Platform.OS === 'ios' || Platform.OS === 'web') && (
            <TouchableOpacity
              style={styles.appleBtn}
              onPress={() => handleSocial('apple')}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              <View style={styles.btnIconContainer}>
                <AppleIcon />
              </View>
              <Text style={styles.appleBtnText}>Iniciar sessão com a Apple</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* DIVISOR */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU COM EMAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* FORMULÁRIO DE EMAIL / SENHA */}
        <View style={styles.formCard}>
          {authMode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Seu Nome Completo</Text>
              <View style={styles.inputWrapper}>
                <User size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Marina Silva"
                  placeholderTextColor={Colors.textSecondary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Seu Email</Text>
            <View style={styles.inputWrapper}>
              <Mail size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Ex: seuemail@exemplo.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Senha de Acesso</Text>
            <View style={styles.inputWrapper}>
              <Lock size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 dígitos"
                placeholderTextColor={Colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleEmailAuth}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>
                  {authMode === 'login' ? 'Entrar no Aplicativo' : 'Criar Minha Conta NURI'}
                </Text>
                <ArrowRight size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          {/* TOGGLE ENTRE LOGIN E CADASTRO */}
          <TouchableOpacity
            style={styles.toggleAuthMode}
            onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          >
            <Text style={styles.toggleAuthText}>
              {authMode === 'login' ? (
                <>Não tem conta? <Text style={styles.toggleAuthHighlight}>Cadastre-se grátis</Text></>
              ) : (
                <>Já tem conta? <Text style={styles.toggleAuthHighlight}>Fazer login</Text></>
              )}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MODO TESTES RÁPIDOS (DEMONSTRAÇÃO COM 1 TOQUE) */}
        <View style={styles.demoSection}>
          <Text style={styles.demoSectionTitle}>⚡ Testar com 1 Toque (Perfis Simulados):</Text>
          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => handleFastDemo('admin')}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBtnTitle}>👑 Pais / Admin</Text>
              <Text style={styles.demoBtnSub}>Acesso Geral</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => handleFastDemo('family')}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBtnTitle}>👵 Vovó / Família</Text>
              <Text style={styles.demoBtnSub}>Fotos & Afeto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => handleFastDemo('caregiver')}
              activeOpacity={0.7}
            >
              <Text style={styles.demoBtnTitle}>🍼 Babá / Escola</Text>
              <Text style={styles.demoBtnSub}>Rotina & Diário</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SELO DE PRIVACIDADE E TERMOS */}
        <View style={styles.footer}>
          <View style={styles.privacyBadge}>
            <ShieldCheck size={14} color="#059669" />
            <Text style={styles.privacyText}>Privacidade protegida • Criptografia Supabase</Text>
          </View>
          <Text style={styles.termsText}>
            Ao continuar, você concorda com os Termos de Uso e Política de Privacidade do Nuri.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 13.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF3F2',
    borderWidth: 1,
    borderColor: '#FECDCA',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  noticeText: {
    flex: 1,
    fontSize: 12.5,
    color: '#B42318',
    lineHeight: 18,
    fontWeight: '500',
  },
  socialSection: {
    gap: 12,
    marginBottom: Spacing.lg,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    ...Shadows.subtle,
  },
  googleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#344054',
    marginLeft: 12,
  },
  facebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1877F2',
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    ...Shadows.subtle,
  },
  facebookBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    ...Shadows.subtle,
  },
  appleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  btnIconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4E7EC',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E4E7EC',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#FAF8F5',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
    ...Shadows.subtle,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  toggleAuthMode: {
    alignItems: 'center',
    marginTop: 14,
  },
  toggleAuthText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  toggleAuthHighlight: {
    fontWeight: '800',
    color: Colors.primary,
  },
  demoSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: Spacing.lg,
  },
  demoSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0369A1',
    marginBottom: 10,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  demoBtnTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  demoBtnSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  termsText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 300,
  },
});
