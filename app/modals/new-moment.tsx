import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, Sparkles, Check } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { MilestoneType } from '../../src/types/database';

export default function NewMomentModal() {
  const router = useRouter();
  const { addMoment } = useApp();

  const [caption, setCaption] = useState('');
  const [milestoneType, setMilestoneType] = useState<MilestoneType>('mesversario');
  const [milestoneTitle, setMilestoneTitle] = useState('4º Mesversário');
  const [selectedPhoto, setSelectedPhoto] = useState(
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80'
  );

  const milestonePresets = [
    { type: 'mesversario' as MilestoneType, title: '4º Mesversário' },
    { type: 'first_time' as MilestoneType, title: 'Primeira Risada' },
    { type: 'first_time' as MilestoneType, title: 'Primeiro Banho de Mar' },
    { type: 'routine' as MilestoneType, title: 'Momento Fofura' },
    { type: 'gestation' as MilestoneType, title: 'Ultrassom 3D' },
  ];

  const handlePublish = () => {
    if (!caption.trim()) {
      Alert.alert('Adicione uma legenda', 'Conte um pouquinho sobre esse momento para a família!');
      return;
    }

    addMoment({
      created_by: 'u1',
      author_name: 'Marina (Mamãe)',
      author_role_label: 'Mãe',
      media_type: 'photo',
      media_url: selectedPhoto,
      caption: caption.trim(),
      milestone_type: milestoneType,
      milestone_title: milestoneTitle,
      taken_at: new Date().toISOString(),
    });

    Alert.alert('Publicado com Sucesso! 🎉', 'O momento foi adicionado à linha do tempo da família.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* SELETOR DE FOTO */}
      <View style={styles.imageSection}>
        <Image source={{ uri: selectedPhoto }} style={styles.previewImage} resizeMode="cover" />
        <View style={styles.imageActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() =>
              setSelectedPhoto(
                'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
              )
            }
          >
            <Camera size={16} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() =>
              setSelectedPhoto(
                'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
              )
            }
          >
            <ImageIcon size={16} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MARCOS / TAGS COMEMORATIVAS */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>MARCO OU COMEMORAÇÃO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetsRow}>
          {milestonePresets.map((preset, index) => {
            const isSelected = milestoneTitle === preset.title;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.presetChip, isSelected && styles.presetChipActive]}
                onPress={() => {
                  setMilestoneType(preset.type);
                  setMilestoneTitle(preset.title);
                }}
              >
                <Sparkles size={12} color={isSelected ? Colors.textInverted : Colors.secondary} />
                <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                  {preset.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LEGENDA / MEMÓRIA */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>LEGENDA DO MOMENTO</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="Conte para a família o que aconteceu de marcante hoje..."
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          value={caption}
          onChangeText={setCaption}
        />
      </View>

      {/* BOTÃO PUBLICAR */}
      <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} activeOpacity={0.8}>
        <Check size={18} color={Colors.textInverted} />
        <Text style={styles.publishBtnText}>Salvar na Linha do Tempo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.background,
    paddingBottom: 40,
  },
  imageSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  previewImage: {
    width: '100%',
    height: 240,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Spacing.sm,
    backgroundColor: Colors.surfaceSubtle,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  fieldSection: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  presetsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
  },
  presetChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  presetChipTextActive: {
    color: Colors.textInverted,
  },
  captionInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverted,
  },
});
