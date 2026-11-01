import React from 'react';
import { Tabs } from 'expo-router';
import { Image as ImageIcon, Sparkles, ShieldPlus, Users } from 'lucide-react-native';
import { Colors } from '../../src/constants/theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Memórias',
          tabBarIcon: ({ color, size }) => <ImageIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Jornada',
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Saúde',
          tabBarIcon: ({ color, size }) => <ShieldPlus color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Família',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
