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
              headerStyle: { backgroundColor: Colors.surface },
            }}
          />
          <Stack.Screen
            name="modals/caregiver-card"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Ficha da Escola & Cuidador',
              headerTintColor: Colors.textPrimary,
              headerStyle: { backgroundColor: Colors.surface },
            }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
