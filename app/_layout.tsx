import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { AppProvider } from '../src/context/AppContext';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <StatusBar style="dark" backgroundColor={Colors.background} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            
            {/* CONTA & PERFIL */}
            <Stack.Screen
              name="modals/user-profile"
              options={{ presentation: 'modal', headerShown: true, title: 'Minha Conta & Família', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
            />
          
          {/* MODAIS DE MEMÓRIAS E ESCOLA */}
          <Stack.Screen
            name="modals/new-moment"
            options={{ presentation: 'modal', headerShown: true, title: 'Novo Momento', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          <Stack.Screen
            name="modals/caregiver-card"
            options={{ presentation: 'modal', headerShown: true, title: 'Passe Escolar & Cuidador', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          
          {/* MODAIS DE SAÚDE PEDIÁTRICA */}
          <Stack.Screen
            name="modals/add-growth"
            options={{ presentation: 'modal', headerShown: true, title: 'Nova Medição (Curvas OMS)', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          <Stack.Screen
            name="modals/add-medication"
            options={{ presentation: 'modal', headerShown: true, title: 'Registrar Remédio / Febre', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          <Stack.Screen
            name="modals/medical-report"
            options={{ presentation: 'modal', headerShown: true, title: 'Relatório para o Pediatra', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />

          {/* MODAIS DE GESTAÇÃO */}
          <Stack.Screen
            name="modals/add-ultrasound"
            options={{ presentation: 'modal', headerShown: true, title: 'Registrar Ultrassom', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          <Stack.Screen
            name="modals/maternal-health"
            options={{ presentation: 'modal', headerShown: true, title: 'Saúde Materna & Sintomas', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          <Stack.Screen
            name="modals/contraction-timer"
            options={{ presentation: 'modal', headerShown: true, title: 'Contador de Contrações', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />

          {/* MODAIS DE ROTINA DIÁRIA */}
          <Stack.Screen
            name="modals/add-feeding"
            options={{ presentation: 'modal', headerShown: true, title: 'Registrar Alimentação', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          <Stack.Screen
            name="modals/add-diaper"
            options={{ presentation: 'modal', headerShown: true, title: 'Registrar Troca de Fralda', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          <Stack.Screen
            name="modals/add-sleep"
            options={{ presentation: 'modal', headerShown: true, title: 'Registrar Sono & Soneca', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />

          {/* MODAIS DE MEMÓRIAS & MARCOS */}
          <Stack.Screen
            name="modals/record-milestone"
            options={{ presentation: 'modal', headerShown: true, title: 'Registrar Primeira Vez', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />

          {/* MODAIS DE CÍRCULO FAMILIAR & ESCOLA */}
          <Stack.Screen
            name="modals/invite-member"
            options={{ presentation: 'modal', headerShown: true, title: 'Convidar para a Família', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
          <Stack.Screen
            name="modals/add-school-note"
            options={{ presentation: 'modal', headerShown: true, title: 'Novo Recado da Escola / Babá', headerTintColor: Colors.textPrimary, headerStyle: { backgroundColor: '#FFFFFF' } }}
          />
        </Stack>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
