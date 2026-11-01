import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ShieldAlert, AlertTriangle, Users, Phone, Share2, CheckCircle2 } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateBabyAge } from '../../src/utils/babyCalculations';

export default function CaregiverCardModal() {
  const { baby, emergencyShare } = useApp();
  const ageInfo = baby.birth_date ? calculateBabyAge(baby.birth_date) : null;

  const handleSharePass = () => {
    Alert.alert(
      'Passe Escolar Compartilhado',
      `Link seguro gerado com sucesso: https://nuri.app/passe/${emergencyShare.access_token}\n\nEnvie este link para a coordenação ou professora. Eles poderão visualizar os dados sem precisar criar conta.`,
      [{ text: 'Copiar Link' }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* IDENTIFICAÇÃO DO BEBÊ */}
      <View style={styles.babyCard}>
        <Image source={{ uri: baby.avatar_url }} style={styles.babyAvatar} />
        <View style={styles.babyInfo}>
          <Text style={styles.babyName}>{baby.name}</Text>
          <Text style={styles.babyAge}>{ageInfo?.formattedText || 'Recém-nascido'}</Text>
          <View style={styles.bloodBadge}>
            <Text style={styles.bloodBadgeText}>Tipo Sanguíneo: {baby.blood_type || 'O+'}</Text>
          </View>
        </View>
      </View>

      {/* ALERTA DE ALERGIAS (ALTA VISIBILIDADE) */}
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <AlertTriangle size={20} color={Colors.danger} />
          <Text style={styles.alertTitle}>ALERGIAS E RESTRIÇÕES ALIMENTARES</Text>
        </View>
        <View style={styles.allergiesList}>
          {baby.allergies.length > 0 ? (
            baby.allergies.map((allergy, i) => (
              <View key={i} style={styles.allergyItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.allergyText}>{allergy}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noAllergyText}>Nenhuma alergia relatada até o momento.</Text>
          )}
        </View>
      </View>

      {/* ORIENTAÇÕES MÉDICAS DE ROTINA */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <ShieldAlert size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Orientações de Emergência</Text>
        </View>
        <Text style={styles.instructionsText}>{emergencyShare.emergency_instructions}</Text>
      </View>

      {/* PESSOAS AUTORIZADAS A BUSCAR NA ESCOLA / CRECHE */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Users size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}>Pessoas Autorizadas a Buscar</Text>
        </View>

        <View style={styles.pickupsList}>
          {emergencyShare.authorized_pickups.map((person, idx) => (
            <View key={idx} style={styles.pickupCard}>
              <View style={styles.pickupHeader}>
                <Text style={styles.pickupName}>{person.name}</Text>
                <View style={styles.pickupRelationBadge}>
                  <Text style={styles.pickupRelationText}>{person.relationship}</Text>
                </View>
              </View>
              <Text style={styles.pickupDoc}>{person.document}</Text>
              <View style={styles.pickupPhoneRow}>
                <Phone size={12} color={Colors.primary} />
                <Text style={styles.pickupPhone}>{person.phone}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* BOTÃO COMPARTILHAR PASSE */}
      <TouchableOpacity style={styles.sharePassBtn} onPress={handleSharePass} activeOpacity={0.8}>
        <Share2 size={18} color={Colors.textInverted} />
        <Text style={styles.sharePassBtnText}>Compartilhar Passe Escolar Seguro</Text>
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
  babyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  babyAvatar: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  babyInfo: {
    flex: 1,
  },
  babyName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  babyAge: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bloodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    marginTop: 6,
  },
  bloodBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  alertCard: {
    backgroundColor: Colors.dangerLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#FEB2B2',
    marginBottom: Spacing.md,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.danger,
    letterSpacing: 0.5,
  },
  allergiesList: {
    gap: 6,
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.danger,
  },
  allergyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9B2C2C',
  },
  noAllergyText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  instructionsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  pickupsList: {
    gap: 8,
  },
  pickupCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  pickupName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  pickupRelationBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  pickupRelationText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  pickupDoc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  pickupPhoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pickupPhone: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  sharePassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: Radius.md,
    marginTop: Spacing.xs,
  },
  sharePassBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textInverted,
  },
});
