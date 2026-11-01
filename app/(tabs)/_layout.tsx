import React from 'react';
import { Tabs } from 'expo-router';
import { Image as ImageIcon, Sparkles, ShieldPlus, Users, Clock } from 'lucide-react-native';
import { Colors, Shadows } from '../../src/constants/theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#A0A7B1',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 10,
          ...Shadows.subtle,
        },
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          letterSpacing: 0.1,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Memórias',
          tabBarIcon: ({ color, focused }) => (
            <ImageIcon color={color} size={focused ? 23 : 21} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="routine"
        options={{
          title: 'Rotina',
          tabBarIcon: ({ color, focused }) => (
            <Clock color={color} size={focused ? 23 : 21} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Jornada',
          tabBarIcon: ({ color, focused }) => (
            <Sparkles color={color} size={focused ? 23 : 21} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />

      <Tabs.Screen
        name="health"
        options={{
          title: 'Saúde',
          tabBarIcon: ({ color, focused }) => (
            <ShieldPlus color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Família',
          tabBarIcon: ({ color, focused }) => (
            <Users color={color} size={focused ? 24 : 22} strokeWidth={focused ? 2.4 : 1.8} />
          ),
        }}
      />
    </Tabs>
  );
}
