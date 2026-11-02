import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import {
  signInWithSocial as authSignInSocial,
  signInWithEmail as authSignInEmail,
  signUpWithEmail as authSignUpEmail,
  signOutUser,
  OAuthProvider,
} from '../services/auth';
import { UserRole } from '../types/database';

export interface UserAccountProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  provider?: string;
  role: UserRole;
  relationship: string;
}

interface AuthContextData {
  user: User | null;
  session: Session | null;
  profile: UserAccountProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  signInWithSocial: (provider: OAuthProvider) => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  enterDemoMode: (role?: UserRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserAccountProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Inicializa sessão do Supabase ao abrir o app
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
          if (data.session?.user) {
            mapUserToProfile(data.session.user);
          }
        }
      } catch (err) {
        console.warn('Erro ao restaurar sessão Supabase:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initSession();

    // Listener reativo de mudanças de estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setIsDemoMode(false);
        mapUserToProfile(currentSession.user);
      } else if (!isDemoMode) {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  function mapUserToProfile(supabaseUser: User) {
    const meta = supabaseUser.user_metadata || {};
    const fullName = meta.full_name || meta.name || supabaseUser.email?.split('@')[0] || 'Família NURI';
    const avatar = meta.avatar_url || meta.picture;
    const provider = supabaseUser.app_metadata.provider || 'email';

    setProfile({
      id: supabaseUser.id,
      name: fullName,
      email: supabaseUser.email || '',
      avatar_url: avatar,
      provider,
      role: 'admin',
      relationship: 'Mãe / Pai (Admin)',
    });
  }

  // Login Social
  const handleSignInWithSocial = async (provider: OAuthProvider) => {
    try {
      setIsLoading(true);
      const res = await authSignInSocial(provider);
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.session) {
        setSession(res.session);
        setUser(res.session.user);
        mapUserToProfile(res.session.user);
        setIsDemoMode(false);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Falha ao autenticar com rede social.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Login com Email e Senha
  const handleSignInWithEmail = async (email: string, pass: string) => {
    try {
      setIsLoading(true);
      const res = await authSignInEmail(email, pass);
      if (res.session) {
        setSession(res.session);
        setUser(res.session.user);
        mapUserToProfile(res.session.user);
        setIsDemoMode(false);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Email ou senha inválidos.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Cadastro com Email e Senha
  const handleSignUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      setIsLoading(true);
      const res = await authSignUpEmail(email, pass, name);
      if (res.session) {
        setSession(res.session);
        setUser(res.session.user);
        mapUserToProfile(res.session.user);
        setIsDemoMode(false);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Falha ao cadastrar conta.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Ativa Modo Demonstração com papéis configuráveis para testes
  const enterDemoMode = (role: UserRole = 'admin') => {
    setIsDemoMode(true);
    if (role === 'admin') {
      setProfile({
        id: 'demo-user-marina',
        name: 'Marina Silva (Mãe)',
        email: 'marina.silva@gmail.com',
        avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        provider: 'google',
        role: 'admin',
        relationship: 'Mãe (Administradora)',
      });
    } else if (role === 'family') {
      setProfile({
        id: 'demo-user-vera',
        name: 'Vera Lúcia (Vovó)',
        email: 'vovo.vera@gmail.com',
        avatar_url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150',
        provider: 'facebook',
        role: 'family',
        relationship: 'Vovó Materna',
      });
    } else {
      setProfile({
        id: 'demo-user-juliana',
        name: 'Juliana Paes (Babá)',
        email: 'juliana.cuidar@gmail.com',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        provider: 'email',
        role: 'caregiver',
        relationship: 'Babá / Cuidadora',
      });
    }
  };

  // Logout
  const signOut = async () => {
    try {
      setIsLoading(true);
      await signOutUser();
    } catch (err) {
      console.warn('Erro ao deslogar do Supabase:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsDemoMode(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isDemoMode,
        signInWithSocial: handleSignInWithSocial,
        signInWithEmail: handleSignInWithEmail,
        signUpWithEmail: handleSignUpWithEmail,
        enterDemoMode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
