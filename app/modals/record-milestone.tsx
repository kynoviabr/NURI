import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Camera, Image as ImageIcon, Check, Calendar, Sparkles } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';

export default function RecordMilestoneModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    key: string;
    title: string;
    icon: string;
  }>();

  const { updateFirstMilestone, addMoment } = useApp();

  const milestoneKey = params.key || 'first_smile';
  const milestoneTitle = params.title || 'Marco Especial';
  const milestoneIcon = params.icon || '✨';

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
  );
  const [loggedBy, setLoggedBy] = useState('Mamãe');
  const [alsoPostToFeed, setAlsoPostToFeed] = useState(true);

  // CÂMERA
  const handlePickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão Necessária', 'Precisamos de acesso à câmera para fotografar esse marco!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setPhotoUrl(result.assets[0].uri);
      }
    } catch (e) {
      console.log('Erro ao abrir câmera:', e);
    }
  };

  // GALERIA
  const handlePickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão Necessária', 'Precisamos de acesso à galeria para selecionar a foto!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        setPhotoUrl(result.assets[0].uri);
      }
    } catch (e) {
      console.log('Erro ao abrir galeria:', e);
    }
  };

  const handleSave = () => {
    updateFirstMilestone(milestoneKey, {
      achieved_date: date,
      photo_url: photoUrl,
      notes: notes.trim() || undefined,
      logged_by: loggedBy,
    });

    // Opcionalmente também publica no feed da família
    if (alsoPostToFeed) {
      addMoment({
        created_by: 'u1',
        author_name: loggedBy === 'Papai' ? 'Lucas (Papai)' : 'Marina (Mamãe)',
        author_role_label: loggedBy,
        media_type: 'photo',
        media_url: photoUrl,
        caption: notes.trim() || `Conquistamos um marco inesquecível: ${milestoneTitle}! 🎉❤️`,
        milestone_type: 'first_time',
        milestone_title: milestoneTitle,
        taken_at: new Date(date).toISOString(),
      });
    }

    Alert.alert('Marco Registrado! 🏆', `${milestoneTitle} foi salvo no Livro do Bebê com sucesso.`, [
      { text: 'Lindo!', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* CABEÇALHO DO MARCO */}
      <View style={styles.milestoneHeaderCard}>
        <Text style={styles.milestoneHeaderIcon}>{milestoneIcon}</Text>
        <Text style={styles.milestoneHeaderTitle}>{milestoneTitle}</Text>
        <Text style={styles.milestoneHeaderSub}>
          Guarde a foto oficial e a data em que essa conquista aconteceu!
        </Text>
      </View>

      {/* FOTO OFICIAL DO MARCO */}
      <View style={styles.imageCard}>
        <Image source={{ uri: photoUrl }} style={styles.previewImage} resizeMode="cover" />

        <View style={styles.imageActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handlePickFromCamera}
            activeOpacity={0.7}
          >
            <Camera size={18} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Tirar Foto</Text>
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handlePickFromGallery}
            activeOpacity={0.7}
          >
            <ImageIcon size={18} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* DATA DO ACONTECIMENTO */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>DATA DA CONQUISTA (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.inputBox}
          value={date}
          onChangeText={setDate}
          placeholder="Ex: 2026-10-20"
        />
      </View>

      {/* HISTÓRIA / RELATO AFETIVO */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>HISTÓRIA DESTE MOMENTO</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Conte como aconteceu, quem estava junto e a reação do bebê..."
          placeholderTextColor="#A0A7B1"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* QUEM REGISTROU */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>REGISTRADO POR</Text>
        <View style={styles.rolesRow}>
          {['Mamãe', 'Papai', 'Vovó'].map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.roleChip, loggedBy === r && styles.roleChipActive]}
              onPress={() => setLoggedBy(r)}
            >
              <Text style={[styles.roleChipText, loggedBy === r && styles.roleChipTextActive]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.feedCheckRow}
          onPress={() => setAlsoPostToFeed(!alsoPostToFeed)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkCircle, alsoPostToFeed && styles.checkCircleActive]}>
            {alsoPostToFeed && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
          </View>
          <Text style={styles.feedCheckText}>
            Publicar também na Linha do Tempo da Família
          </Text>
        </TouchableOpacity>
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveBtnText}>Guardar no Livro de Primeiras Vezes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  milestoneHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  milestoneHeaderIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  milestoneHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  milestoneHeaderSub: {
    fontSize: 12.5,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  imageCard: {
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
    height: 240,
    backgroundColor: '#F5EFE6',
  },
  imageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#EAE3D6',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputBox: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 12,
    fontSize: 13.5,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 19,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radius.md,
    backgroundColor: '#F7F3EC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE4D6',
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
  feedCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#D4C9BC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  feedCheckText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    marginTop: 4,
    ...Shadows.subtle,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
