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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, Sparkles, Check, Calendar, Star } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { MilestoneType } from '../../src/types/database';

export default function NewMomentModal() {
  const router = useRouter();
  const { addMoment } = useApp();

  const [caption, setCaption] = useState('');
  const [milestoneType, setMilestoneType] = useState<MilestoneType>('mesversario');
  const [milestoneTitle, setMilestoneTitle] = useState('3º Mesversário');
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(3);
  const [selectedPhoto, setSelectedPhoto] = useState(
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
  );
  const [authorRole, setAuthorRole] = useState('Mamãe');

  // ABRIR CÂMERA DO CELULAR
  const handlePickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão Necessária', 'Precisamos de acesso à câmera para tirar fotos do bebê.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.log('Erro ao abrir câmera:', e);
      Alert.alert('Aviso', 'Não foi possível abrir a câmera neste dispositivo.');
    }
  };

  // ABRIR GALERIA DE FOTOS DO CELULAR
  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão Necessária', 'Precisamos de acesso à galeria para escolher fotos do bebê.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedPhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.log('Erro ao abrir galeria:', e);
      Alert.alert('Aviso', 'Não foi possível abrir a galeria neste dispositivo.');
    }
  };

  const milestonePresets = [
    { type: 'mesversario' as MilestoneType, title: '1º Mesversário', month: 1 },
    { type: 'mesversario' as MilestoneType, title: '2º Mesversário', month: 2 },
    { type: 'mesversario' as MilestoneType, title: '3º Mesversário', month: 3 },
    { type: 'mesversario' as MilestoneType, title: '4º Mesversário', month: 4 },
    { type: 'mesversario' as MilestoneType, title: '6º Mesversário (Meio Aninho)', month: 6 },
    { type: 'first_time' as MilestoneType, title: 'Primeiro Sorriso Social', month: undefined },
    { type: 'first_time' as MilestoneType, title: 'Primeiro Banho em Casa', month: undefined },
    { type: 'first_time' as MilestoneType, title: 'Primeiro Dentinho', month: undefined },
    { type: 'first_time' as MilestoneType, title: 'Primeira Papinha', month: undefined },
    { type: 'first_time' as MilestoneType, title: 'Primeiros Passinhos', month: undefined },
    { type: 'routine' as MilestoneType, title: 'Momento Fofura do Dia', month: undefined },
  ];

  const handlePublish = () => {
    if (!caption.trim()) {
      Alert.alert('Adicione uma legenda', 'Escreva uma recordação afetiva para a família sobre esse momento!');
      return;
    }

    addMoment({
      created_by: 'u1',
      author_name: authorRole.includes('Mamãe') ? 'Marina (Mamãe)' : authorRole.includes('Papai') ? 'Lucas (Papai)' : 'Vovó Vera',
      author_role_label: authorRole,
      media_type: 'photo',
      media_url: selectedPhoto,
      caption: caption.trim(),
      milestone_type: milestoneType,
      milestone_title: milestoneTitle,
      month_age: selectedMonth,
      taken_at: new Date().toISOString(),
    });

    Alert.alert('Publicado com Sucesso! 🎉', 'O momento foi adicionado ao álbum familiar.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {/* SELETOR E PREVIEW DE FOTO */}
      <View style={styles.imageSection}>
        <Image source={{ uri: selectedPhoto }} style={styles.previewImage} resizeMode="cover" />
        
        <View style={styles.imageActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handlePickFromCamera}
            activeOpacity={0.7}
          >
            <Camera size={18} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Tirar Foto (Câmera)</Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handlePickFromGallery}
            activeOpacity={0.7}
          >
            <ImageIcon size={18} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Escolher da Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MARCOS / COMEMORAÇÃO */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>MARCO OU COMEMORAÇÃO (OPCIONAL)</Text>
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
                  setSelectedMonth(preset.month);
                }}
              >
                <Sparkles size={12} color={isSelected ? '#FFFFFF' : Colors.secondary} />
                <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                  {preset.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LEGENDA / MEMÓRIA AFETIVA */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>LEGENDA AFETIVA DO MOMENTO</Text>
        <TextInput
          style={styles.captionInput}
          placeholder="Ex: Cada dia mais esperto, descobrindo as mãozinhas e rindo à toa com a família!"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          value={caption}
          onChangeText={setCaption}
        />
      </View>

      {/* QUEM ESTÁ POSTANDO */}
      <View style={styles.fieldSection}>
        <Text style={styles.fieldLabel}>QUEM ESTÁ GUARDANDO ESSA MEMÓRIA?</Text>
        <View style={styles.rolesRow}>
          {['Mamãe', 'Papai', 'Vovó', 'Dinda'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleChip, authorRole === r && styles.roleChipActive]}
              onPress={() => setAuthorRole(r)}
              activeOpacity={0.8}
            >
              <Text style={[styles.roleChipText, authorRole === r && styles.roleChipTextActive]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* BOTÃO PUBLICAR */}
      <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.publishBtnText}>Salvar no Álbum da Família</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  previewImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#F5EFE6',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EAE3D6',
  },
  fieldSection: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  presetsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  presetChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  presetChipTextActive: {
    color: '#FFFFFF',
  },
  captionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 20,
    ...Shadows.subtle,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  roleChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  roleChipTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: Radius.lg,
    marginTop: 8,
    ...Shadows.subtle,
  },
  publishBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
