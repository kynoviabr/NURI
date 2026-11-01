import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/context/AppContext';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modals/new-moment"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Novo Momento',
              headerTintColor: Colors.textPrimary,
              headerStyle: { backgroundColor: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="modals/caregiver-card"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Passe Escolar & Cuidador',
              headerTintColor: Colors.textPrimary,
              headerStyle: { backgroundColor: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="modals/add-growth"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Nova Medição (Curvas OMS)',
              headerTintColor: Colors.textPrimary,
              headerStyle: { backgroundColor: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="modals/add-medication"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Registrar Remédio / Febre',
              headerTintColor: Colors.textPrimary,
              headerStyle: { backgroundColor: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="modals/medical-report"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Relatório para o Pediatra',
              headerTintColor: Colors.textPrimary,
              headerStyle: { backgroundColor: '#FFFFFF' },
            }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
