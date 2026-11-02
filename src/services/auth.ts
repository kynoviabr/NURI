/**
 * NURI AUTH SERVICE
 * Gerenciamento de autenticação via Supabase Auth:
 * - Google (Gmail) OAuth
 * - Facebook (Meta) OAuth
 * - Apple Sign In
 * - Email / Senha
 * Suporta Expo WebBrowser e Deep Linking nativo.
 */
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';

// Necessário para fechar o popup/janela de autenticação em ambiente Web
WebBrowser.maybeCompleteAuthSession();

export type OAuthProvider = 'google' | 'facebook' | 'apple';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

/**
 * Inicia o fluxo de login social OAuth (Google, Facebook ou Apple)
 */
export async function signInWithSocial(provider: OAuthProvider): Promise<{ session?: Session | null; user?: User | null; error?: string }> {
  try {
    // URL de retorno do App (Deep Link nativo ou URL web)
    const redirectUrl = Linking.createURL('/auth/callback');

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: Platform.OS !== 'web',
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Se estiver no Web, o Supabase já lida com o redirecionamento
    if (Platform.OS === 'web') {
      return {};
    }

    // No iOS e Android, abrimos a sessão segura in-app
    if (data?.url) {
      const authResult = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl, {
        showInRecents: true,
      });

      if (authResult.type === 'success' && authResult.url) {
        // Extrai tokens ou código de autorização da URL de retorno
        const session = await createSessionFromUrl(authResult.url);
        return { session, user: session?.user ?? null };
      } else if (authResult.type === 'cancel' || authResult.type === 'dismiss') {
        return { error: 'Login cancelado pelo usuário.' };
      }
    }

    return { error: 'Não foi possível iniciar o navegador de autenticação.' };
  } catch (err: any) {
    return { error: err?.message || 'Erro inesperado durante login social.' };
  }
}

/**
 * Processa a URL de retorno com tokens (hash) ou PKCE (code)
 */
export async function createSessionFromUrl(url: string): Promise<Session | null> {
  try {
    const cleanUrl = url.replace('#', '?');
    const parsed = Linking.parse(cleanUrl);
    const queryParams = parsed.queryParams || {};

    // 1. Fluxo PKCE (código de autorização)
    const code = queryParams.code as string | undefined;
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      return data.session;
    }

    // 2. Fluxo Implícito (Tokens na URL)
    const accessToken = queryParams.access_token as string | undefined;
    const refreshToken = queryParams.refresh_token as string | undefined;
    if (accessToken && refreshToken) {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) throw error;
      return data.session;
    }

    return null;
  } catch (err) {
    console.warn('Erro ao processar sessão a partir da URL:', err);
    return null;
  }
}

/**
 * Login com Email e Senha
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Cadastro com Email e Senha
 */
export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Encerra a sessão ativa
 */
export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Obtém a sessão atual
 */
export async function getCurrentSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
