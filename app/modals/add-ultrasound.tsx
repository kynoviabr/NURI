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
import { Heart, Activity, Camera, Check, Calendar } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';

export default function AddUltrasoundModal() {
  const router = useRouter();
  const { addUltrasound } = useApp();

  const [examName, setExamName] = useState('Morfológico de 2º Trimestre (3D/4D)');
  const [week, setWeek] = useState('22');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [clinic, setClinic] = useState('Clínica Alta Diagnósticos');
  const [heartRate, setHeartRate] = useState('148');
  const [doctorReport, setDoctorReport] = useState('Desenvolvimento anatômico normal, todos os órgãos formados.');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=80'
  );

  const examPresets = [
    '1º Transvaginal',
    'Morfológico 1º Trimestre (TN)',
    'Morfológico 2º Trimestre',
    'Ecografia 3D/4D Fetal',
    'Doppler Fetal',
  ];

  const handleSave = () => {
    if (!examName.trim() || !week) {
      Alert.alert('Dados Incompletos', 'Informe o tipo de ultrassom e a semana gestacional.');
      return;
    }

    addUltrasound({
      exam_name: examName.trim(),
      gestational_week: parseInt(week, 10) || 20,
      exam_date: examDate,
      doctor_or_clinic: clinic.trim(),
      photo_url: photoUrl,
      heart_rate_bpm: heartRate ? parseInt(heartRate, 10) : undefined,
      doctor_report: doctorReport.trim(),
    });

    Alert.alert('Ultrassom Registrado! 👶', 'A ecografia foi adicionada à linha do tempo pré-natal.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Registrar Ultrassom / Ecografia</Text>
        <Text style={styles.headerSub}>Guarde as imagens, batimentos e o laudo médico de cada exame.</Text>
      </View>

      {/* FOTO DO EXAME */}
      <View style={styles.photoBox}>
        <Image source={{ uri: photoUrl }} style={styles.previewImg} resizeMode="cover" />
        <TouchableOpacity
          style={styles.changePhotoBtn}
          onPress={() =>
            setPhotoUrl(
              'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
            )
          }
        >
          <Camera size={14} color={Colors.primary} />
          <Text style={styles.changePhotoText}>Alterar Imagem do Exame</Text>
        </TouchableOpacity>
      </View>

      {/* TIPO DE ULTRASSOM */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>TIPO DE ULTRASSOM *</Text>
        <TextInput style={styles.textInput} value={examName} onChangeText={setExamName} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {examPresets.map((preset, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.chip, examName === preset && styles.chipActive]}
              onPress={() => setExamName(preset)}
            >
              <Text style={[styles.chipText, examName === preset && styles.chipTextActive]}>{preset}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* SEMANA GESTACIONAL & DATA */}
      <View style={styles.rowTwo}>
        <View style={[styles.fieldBlock, { flex: 1 }]}>
          <Text style={styles.fieldLabel}>SEMANA GESTACIONAL *</Text>
          <TextInput
            style={styles.textInput}
            value={week}
            onChangeText={setWeek}
            keyboardType="number-pad"
            placeholder="Ex: 22"
          />
        </View>

        <View style={[styles.fieldBlock, { flex: 1.3 }]}>
          <Text style={styles.fieldLabel}>DATA DO EXAME</Text>
          <TextInput
            style={styles.textInput}
            value={examDate}
            onChangeText={setExamDate}
            placeholder="AAAA-MM-DD"
          />
        </View>
      </View>

      {/* BATIMENTOS CARDÍACOS (BPM) */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>BATIMENTOS CARDÍACOS FETAIS (BPM)</Text>
        <View style={styles.inputWithIcon}>
          <Heart size={18} color={Colors.secondary} />
          <TextInput
            style={styles.innerInput}
            value={heartRate}
            onChangeText={setHeartRate}
            keyboardType="number-pad"
            placeholder="Ex: 148"
          />
          <Text style={styles.unitSuffix}>bpm</Text>
        </View>
      </View>

      {/* CLÍNICA OU MÉDICO */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>CLÍNICA / MÉDICO EXAMINADOR</Text>
        <TextInput
          style={styles.textInput}
          value={clinic}
          onChangeText={setClinic}
          placeholder="Ex: Laboratório Fleury, Dr. Marcos"
        />
      </View>

      {/* LAUDO / NOTAS DO MÉDICO */}
      <View style={styles.fieldBlock}>
        <Text style={styles.fieldLabel}>NOTAS E CONCLUSÃO DO LAUDO</Text>
        <TextInput
          style={styles.textArea}
          value={doctorReport}
          onChangeText={setDoctorReport}
          placeholder="Ex: Translucência nucal normal, peso estimado 500g, tudo perfeito."
          multiline
          numberOfLines={3}
        />
      </View>

      {/* BOTÃO SALVAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
        <Check size={18} color="#FFFFFF" strokeWidth={2.5} />
        <Text style={styles.saveBtnText}>Salvar Ultrassom na Galeria</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.background,
    paddingBottom: 50,
  },
  headerInfo: {
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  photoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    ...Shadows.subtle,
  },
  previewImg: {
    width: '100%',
    height: 200,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceSubtle,
  },
  changePhotoText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  innerInput: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  unitSuffix: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    marginTop: 8,
    ...Shadows.subtle,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
