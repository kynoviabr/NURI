import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Users,
  Copy,
  Share2,
  ShieldCheck,
  UserPlus,
  ChevronRight,
  Lock,
  Plus,
  Backpack,
  FileText,
  AlertTriangle,
  Trash2,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { formatRelativeDate } from '../../src/utils/babyCalculations';
import { UserRole, EmergencyPickup } from '../../src/types/database';

export default function CircleScreen() {
  const router = useRouter();
  const {
    family,
    members,
    baby,
    schoolNotes,
    removeFamilyMember,
    updateMemberRole,
    emergencyShare,
    updateEmergencyShare,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'members' | 'school' | 'pickup'>('members');

  // FORMULÁRIO RÁPIDO PARA ADICIONAR PESSOA AUTORIZADA
  const [showAddPickup, setShowAddPickup] = useState(false);
  const [pickupName, setPickupName] = useState('');
  const [pickupDoc, setPickupDoc] = useState('');
  const [pickupPhone, setPickupPhone] = useState('');
  const [pickupRel, setPickupRel] = useState('Avó Materna');

  const handleCopyCode = () => {
    Alert.alert(
      'Código Copiado! 📋',
      `O código exclusivo da família (${family.invite_code}) foi copiado. Envie para quem você quer convidar.`,
      [{ text: 'OK' }]
    );
  };

  const handleRemoveMember = (id: string, name: string) => {
    Alert.alert(
      'Remover Acesso?',
      `Tem certeza de que deseja revogar o acesso de "${name}"? Essa pessoa não poderá mais ver fotos ou interagir.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Revogar Acesso',
          style: 'destructive',
          onPress: () => removeFamilyMember(id),
        },
      ]
    );
  };

  const handleChangeRole = (memberId: string, currentRole: UserRole, memberName: string) => {
    Alert.alert(
      `Alterar Papel de ${memberName}`,
      'Escolha o novo nível de permissão:',
      [
        { text: '👑 Administrador (Pais)', onPress: () => updateMemberRole(memberId, 'admin') },
        { text: '🥰 Família (Ver fotos e comentar)', onPress: () => updateMemberRole(memberId, 'family') },
        { text: '🍼 Cuidador / Babá / Creche', onPress: () => updateMemberRole(memberId, 'caregiver') },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const handleAddPickup = () => {
    if (!pickupName.trim() || !pickupPhone.trim()) {
      Alert.alert('Dados Incompletos', 'Informe ao menos o nome completo e o telefone da pessoa autorizada.');
      return;
    }

    const newPickup: EmergencyPickup = {
      name: pickupName.trim(),
      document: pickupDoc.trim() || 'Não informado',
      phone: pickupPhone.trim(),
      relationship: pickupRel,
    };

    updateEmergencyShare({
      authorized_pickups: [...emergencyShare.authorized_pickups, newPickup],
    });

    setPickupName('');
    setPickupDoc('');
    setPickupPhone('');
    setShowAddPickup(false);

    Alert.alert('Pessoa Autorizada! 🪪', 'Cadastro salvo e disponível no Passe Escolar.');
  };

  const handleRemovePickup = (index: number) => {
    const updated = emergencyShare.authorized_pickups.filter((_, i) => i !== index);
    updateEmergencyShare({ authorized_pickups: updated });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER DA TELA */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Círculo Familiar & Escola</Text>
          <Text style={styles.headerSubtitle}>Rede privada e gestão de cuidadores</Text>
        </View>
        <View style={styles.privatePill}>
          <Lock size={12} color={Colors.primary} />
          <Text style={styles.privatePillText}>100% Fechado</Text>
        </View>
      </View>

      {/* SELETOR DE SUB-ABAS */}
      <View style={styles.subTabsContainer}>
        <TouchableOpacity
          style={[styles.subTabItem, activeSubTab === 'members' && styles.subTabItemActive]}
          onPress={() => setActiveSubTab('members')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, activeSubTab === 'members' && styles.subTabTextActive]}>
            Membros ({members.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabItem, activeSubTab === 'school' && styles.subTabItemActive]}
          onPress={() => setActiveSubTab('school')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, activeSubTab === 'school' && styles.subTabTextActive]}>
            🎒 Diário Escola & Babá ({schoolNotes.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabItem, activeSubTab === 'pickup' && styles.subTabItemActive]}
          onPress={() => setActiveSubTab('pickup')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, activeSubTab === 'pickup' && styles.subTabTextActive]}>
            🪪 Passe Escolar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ========================================================================= */}
        {/* SUB-ABA 1: MEMBROS & PAPÉIS */}
        {/* ========================================================================= */}
        {activeSubTab === 'members' && (
          <>
            {/* TICKET DE CONVITE DA FAMÍLIA */}
            <View style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={styles.ticketIconCircle}>
                  <Users size={22} color={Colors.primary} />
                </View>
                <View style={styles.ticketHeaderTextWrap}>
                  <Text style={styles.ticketFamilyName}>{family.name}</Text>
                  <Text style={styles.ticketSub}>Convide quem você mais ama</Text>
                </View>
              </View>

              <View style={styles.codeBox}>
                <Text style={styles.codeBoxLabel}>CÓDIGO DE ENTRADA EXCLUSIVO</Text>
                <View style={styles.codeRow}>
                  <Text style={styles.codeString}>{family.invite_code}</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode} activeOpacity={0.7}>
                    <Copy size={15} color={Colors.primary} />
                    <Text style={styles.copyButtonText}>Copiar</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.whatsappBtn}
                onPress={() => router.push('/modals/invite-member')}
                activeOpacity={0.85}
              >
                <Share2 size={16} color="#FFFFFF" />
                <Text style={styles.whatsappBtnText}>Convidar Membro / Cuidador</Text>
              </TouchableOpacity>
            </View>

            {/* LISTA DE MEMBROS E GESTÃO DE PAPÉIS */}
            <View style={styles.membersSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Membros Conectados ({members.length})</Text>
                <TouchableOpacity
                  style={styles.inviteMiniBtn}
                  onPress={() => router.push('/modals/invite-member')}
                >
                  <UserPlus size={14} color={Colors.primary} />
                  <Text style={styles.inviteMiniText}>+ Convidar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.membersListCard}>
                {members.map((member) => {
                  const isAdmin = member.role === 'admin';

                  return (
                    <View key={member.id} style={styles.memberRow}>
                      <View style={styles.memberAvatarCircle}>
                        <Text style={styles.memberAvatarLetter}>
                          {member.relationship_label.charAt(0)}
                        </Text>
                      </View>

                      <View style={styles.memberMeta}>
                        <Text style={styles.memberRelationName}>{member.relationship_label}</Text>
                        
                        <TouchableOpacity
                          style={styles.rolesRow}
                          onPress={() => handleChangeRole(member.id, member.role, member.relationship_label)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles.roleTag,
                              member.role === 'admin'
                                ? styles.roleTagAdmin
                                : member.role === 'caregiver'
                                ? styles.roleTagCaregiver
                                : styles.roleTagFamily,
                            ]}
                          >
                            <Text
                              style={[
                                styles.roleTagText,
                                member.role === 'admin'
                                  ? styles.roleTagTextAdmin
                                  : member.role === 'caregiver'
                                  ? styles.roleTagTextCaregiver
                                  : styles.roleTagTextFamily,
                              ]}
                            >
                              {member.role === 'admin'
                                ? '👑 Administrador (Pais)'
                                : member.role === 'caregiver'
                                ? '🍼 Cuidador / Escola'
                                : '🥰 Círculo Familiar'}
                            </Text>
                          </View>
                          <Text style={styles.changeRoleHint}>• Alterar</Text>
                        </TouchableOpacity>
                      </View>

                      {!isAdmin && (
                        <TouchableOpacity
                          style={styles.deleteMemberBtn}
                          onPress={() => handleRemoveMember(member.id, member.relationship_label)}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={16} color={Colors.danger} />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* BOX DE PRIVACIDADE E SEGURANÇA LGPD/COPPA */}
            <View style={styles.securityBox}>
              <ShieldCheck size={26} color={Colors.primary} />
              <View style={styles.securityTextWrap}>
                <Text style={styles.securityTitle}>Privacidade Infantil Blindada</Text>
                <Text style={styles.securityDesc}>
                  Zero anúncios, zero algoritmos e dados protegidos por criptografia. As memórias
                  do seu bebê pertencem exclusivamente à família que você autorizar.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* ========================================================================= */}
        {/* SUB-ABA 2: DIÁRIO ESCOLA & BABÁ */}
        {/* ========================================================================= */}
        {activeSubTab === 'school' && (
          <View style={styles.schoolContainer}>
            {/* HERO CARD DE AÇÃO */}
            <View style={styles.schoolHeroCard}>
              <View style={styles.schoolHeroTop}>
                <View style={styles.schoolIconCircle}>
                  <Backpack size={22} color={Colors.primary} />
                </View>
                <View style={styles.schoolHeroTextCol}>
                  <Text style={styles.schoolHeroTitle}>Comunicação Escola & Cuidadores</Text>
                  <Text style={styles.schoolHeroSub}>
                    Troca direta de recados de entrada, saídas e itens da mochila
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.newNoteBtn}
                onPress={() => router.push('/modals/add-school-note')}
                activeOpacity={0.85}
              >
                <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.newNoteBtnText}>Novo Recado da Mochila / Escola</Text>
              </TouchableOpacity>
            </View>

            {/* LISTA DE RECADOS DA ESCOLA / BABÁ */}
            <Text style={styles.sectionTitle}>Histórico de Recados & Avisos</Text>

            {schoolNotes.map((note) => {
              const isUrgent = note.priority === 'urgent';
              const isImportant = note.priority === 'important';

              return (
                <View
                  key={note.id}
                  style={[
                    styles.noteCard,
                    isUrgent && styles.noteCardUrgent,
                    isImportant && styles.noteCardImportant,
                  ]}
                >
                  <View style={styles.noteHeaderRow}>
                    <View style={styles.noteTitleRow}>
                      <Text style={styles.noteTitle}>{note.title}</Text>
                      {isUrgent && (
                        <View style={styles.urgentBadge}>
                          <AlertTriangle size={11} color="#FFFFFF" />
                          <Text style={styles.urgentBadgeText}>Urgente</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.noteDate}>{formatRelativeDate(note.created_at)}</Text>
                  </View>

                  <Text style={styles.noteContent}>{note.content}</Text>

                  {/* LISTA DE ITENS PARA REPOSIÇÃO */}
                  {note.supplies_list && note.supplies_list.length > 0 && (
                    <View style={styles.suppliesBox}>
                      <Text style={styles.suppliesBoxLabel}>ITENS PARA ENVIAR NA MOCHILA:</Text>
                      <View style={styles.suppliesPillsRow}>
                        {note.supplies_list.map((sp, idx) => (
                          <View key={idx} style={styles.supplyPill}>
                            <Text style={styles.supplyPillText}>✓ {sp}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  <View style={styles.noteFooter}>
                    <Text style={styles.noteAuthorText}>
                      Enviado por: <Text style={styles.boldText}>{note.author_name}</Text> ({note.author_role})
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ========================================================================= */}
        {/* SUB-ABA 3: PASSE ESCOLAR & RETIRADA */}
        {/* ========================================================================= */}
        {activeSubTab === 'pickup' && (
          <View style={styles.pickupContainer}>
            {/* CARD DO PASSE OFICIAL */}
            <View style={styles.schoolPassCard}>
              <View style={styles.schoolPassHeader}>
                <View>
                  <Text style={styles.schoolPassLabel}>PASSE ESCOLAR & BERÇÁRIO</Text>
                  <Text style={styles.schoolPassBaby}>{baby.name}</Text>
                </View>
                <TouchableOpacity
                  style={styles.openFullPassBtn}
                  onPress={() => router.push('/modals/caregiver-card')}
                  activeOpacity={0.8}
                >
                  <ExternalLink size={14} color={Colors.primary} />
                  <Text style={styles.openFullPassText}>Abrir Completo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.schoolPassDetails}>
                <View style={styles.passDetailItem}>
                  <Text style={styles.passDetailLabel}>Tipo Sanguíneo</Text>
                  <Text style={styles.passDetailVal}>{baby.blood_type || 'O+'}</Text>
                </View>
                <View style={styles.passDetailItem}>
                  <Text style={styles.passDetailLabel}>Alergias</Text>
                  <Text style={styles.passDetailVal}>
                    {baby.allergies.length > 0 ? baby.allergies.join(', ') : 'Nenhuma'}
                  </Text>
                </View>
                <View style={styles.passDetailItem}>
                  <Text style={styles.passDetailLabel}>Convênio</Text>
                  <Text style={styles.passDetailVal}>
                    {baby.health_insurance?.plan_name || 'Bradesco Saúde'}
                  </Text>
                </View>
              </View>
            </View>

            {/* LISTA DE PESSOAS AUTORIZADAS */}
            <View style={styles.pickupsSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  Pessoas Autorizadas a Retirar ({emergencyShare.authorized_pickups.length})
                </Text>
                <TouchableOpacity
                  style={styles.addPickupMiniBtn}
                  onPress={() => setShowAddPickup(!showAddPickup)}
                >
                  <Text style={styles.addPickupMiniText}>
                    {showAddPickup ? 'Cancelar' : '+ Nova Pessoa'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* FORMULÁRIO RÁPIDO PARA ADICIONAR */}
              {showAddPickup && (
                <View style={styles.addPickupBox}>
                  <Text style={styles.addPickupBoxTitle}>Adicionar Pessoa Autorizada</Text>
                  
                  <TextInput
                    style={styles.pickupInput}
                    placeholder="Nome completo (Ex: Tio Roberto)"
                    placeholderTextColor="#A0A7B1"
                    value={pickupName}
                    onChangeText={setPickupName}
                  />

                  <View style={styles.pickupInputRow}>
                    <TextInput
                      style={[styles.pickupInput, { flex: 1 }]}
                      placeholder="CPF ou RG"
                      placeholderTextColor="#A0A7B1"
                      value={pickupDoc}
                      onChangeText={setPickupDoc}
                    />
                    <TextInput
                      style={[styles.pickupInput, { flex: 1 }]}
                      placeholder="Telefone celular"
                      placeholderTextColor="#A0A7B1"
                      value={pickupPhone}
                      onChangeText={setPickupPhone}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <TextInput
                    style={styles.pickupInput}
                    placeholder="Parentesco (Ex: Padrinho, Tio, Vizinha)"
                    placeholderTextColor="#A0A7B1"
                    value={pickupRel}
                    onChangeText={setPickupRel}
                  />

                  <TouchableOpacity
                    style={styles.confirmAddPickupBtn}
                    onPress={handleAddPickup}
                    activeOpacity={0.85}
                  >
                    <CheckCircle2 size={16} color="#FFFFFF" />
                    <Text style={styles.confirmAddPickupText}>Salvar Autorização</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* CARDS DAS PESSOAS AUTORIZADAS */}
              {emergencyShare.authorized_pickups.map((person, idx) => (
                <View key={idx} style={styles.pickupCard}>
                  <View style={styles.pickupCardHeader}>
                    <View>
                      <Text style={styles.pickupPersonName}>{person.name}</Text>
                      <Text style={styles.pickupPersonRel}>{person.relationship}</Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleRemovePickup(idx)}
                      style={styles.removePickupBtn}
                    >
                      <Trash2 size={15} color={Colors.danger} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.pickupMetaRow}>
                    <Text style={styles.pickupDocText}>Doc: {person.document}</Text>
                    <Text style={styles.pickupPhoneText}>📞 {person.phone}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* INSTRUÇÕES ESPECIAIS EM CASO DE FEBRE */}
            <View style={styles.instructionsBox}>
              <ShieldAlert size={20} color={Colors.warning} />
              <View style={styles.instructionsTextWrap}>
                <Text style={styles.instructionsTitle}>Protocolo de Emergência Escolar</Text>
                <Text style={styles.instructionsContent}>
                  {emergencyShare.emergency_instructions ||
                    'Em caso de febre ou mal-estar, ligar imediatamente para os pais antes de ministrar qualquer antitérmico.'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  privatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  privatePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  subTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  subTabItem: {
    paddingVertical: 10,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
    paddingHorizontal: 4,
  },
  subTabItemActive: {
    borderBottomColor: Colors.primary,
  },
  subTabText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  subTabTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 50,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  ticketIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketHeaderTextWrap: {
    flex: 1,
  },
  ticketFamilyName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  ticketSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  codeBox: {
    backgroundColor: '#FAF7F2',
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ECE4D6',
    marginBottom: 14,
  },
  codeBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeString: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#E2D8C7',
    ...Shadows.subtle,
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 13,
    borderRadius: Radius.md,
    ...Shadows.subtle,
  },
  whatsappBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  membersSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  inviteMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  inviteMiniText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  membersListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFE6',
    gap: 12,
  },
  memberAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarLetter: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.secondary,
  },
  memberMeta: {
    flex: 1,
  },
  memberRelationName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  rolesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  roleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  roleTagAdmin: {
    backgroundColor: Colors.primaryLight,
  },
  roleTagFamily: {
    backgroundColor: Colors.secondaryLight,
  },
  roleTagCaregiver: {
    backgroundColor: Colors.infoLight,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  roleTagTextAdmin: {
    color: Colors.primaryDark,
  },
  roleTagTextFamily: {
    color: Colors.secondaryDark,
  },
  roleTagTextCaregiver: {
    color: Colors.info,
  },
  changeRoleHint: {
    fontSize: 10.5,
    color: Colors.primary,
    fontWeight: '700',
  },
  deleteMemberBtn: {
    padding: 8,
  },
  securityBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  securityTextWrap: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  securityDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  // ESCOLA & BABÁ STYLES
  schoolContainer: {
    gap: 14,
  },
  schoolHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  schoolHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  schoolIconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolHeroTextCol: {
    flex: 1,
  },
  schoolHeroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  schoolHeroSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  newNoteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Radius.md,
    ...Shadows.subtle,
  },
  newNoteBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  noteCardImportant: {
    borderColor: '#FDE68A',
    backgroundColor: '#FFFCF5',
  },
  noteCardUrgent: {
    borderColor: '#FECACA',
    backgroundColor: '#FFF8F8',
  },
  noteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  noteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  urgentBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  noteDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  noteContent: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 19,
    marginBottom: 10,
  },
  suppliesBox: {
    backgroundColor: '#FAF7F2',
    borderRadius: Radius.md,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  suppliesBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondaryDark,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  suppliesPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  supplyPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    borderWidth: 1,
    borderColor: '#E2D8C7',
  },
  supplyPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  noteFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  noteAuthorText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  // PASSE ESCOLAR & RETIRADA STYLES
  pickupContainer: {
    gap: 14,
  },
  schoolPassCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  schoolPassHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFE6',
    marginBottom: 12,
  },
  schoolPassLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  schoolPassBaby: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  openFullPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  openFullPassText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  schoolPassDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  passDetailItem: {
    flex: 1,
  },
  passDetailLabel: {
    fontSize: 10.5,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  passDetailVal: {
    fontSize: 12.5,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  pickupsSection: {
    marginTop: 4,
  },
  addPickupMiniBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  addPickupMiniText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  addPickupBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 12,
    gap: 8,
    ...Shadows.subtle,
  },
  addPickupBoxTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  pickupInput: {
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.md,
    padding: 10,
    fontSize: 13,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickupInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmAddPickupBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: Radius.md,
    marginTop: 4,
  },
  confirmAddPickupText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pickupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
    ...Shadows.subtle,
  },
  pickupCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pickupPersonName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  pickupPersonRel: {
    fontSize: 11.5,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 1,
  },
  removePickupBtn: {
    padding: 4,
  },
  pickupMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  pickupDocText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  pickupPhoneText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  instructionsBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  instructionsTextWrap: {
    flex: 1,
  },
  instructionsTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 3,
  },
  instructionsContent: {
    fontSize: 11.5,
    color: '#92400E',
    lineHeight: 16,
  },
});
