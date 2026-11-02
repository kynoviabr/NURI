import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Plus,
  Heart,
  MessageCircle,
  Sparkles,
  Camera,
  Calendar,
  Share2,
  ChevronRight,
  Baby as BabyIcon,
  Check,
  Send,
  Star,
  Award,
  User as UserIcon,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { useAuth } from '../../src/context/AuthContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateBabyAge, calculateGestation, formatRelativeDate } from '../../src/utils/babyCalculations';
import { FirstMilestoneItem, Moment } from '../../src/types/database';

export default function FeedScreen() {
  const router = useRouter();
  const {
    baby,
    moments,
    toggleBabyMode,
    firstMilestones,
    addMomentReaction,
    growthLogs,
  } = useApp();
  const { profile } = useAuth();

  const isBorn = baby.status === 'born';
  const ageInfo = isBorn && baby.birth_date ? calculateBabyAge(baby.birth_date) : null;
  const gestationInfo = !isBorn && baby.due_date ? calculateGestation(baby.due_date) : null;

  // SUB-ABAS DO MÓDULO DE MEMÓRIAS
  const [subTab, setSubTab] = useState<'feed' | 'mesversarios' | 'milestones'>('feed');

  // FILTROS DO FEED
  const [feedFilter, setFeedFilter] = useState<'all' | 'mesversario' | 'first_time'>('all');

  // CURTIDAS LOCAIS
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({ p1: true, p5: true });

  // ESTADO DE NOVO COMENTÁRIO INLINE
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);

  // ESTADO DE COMPARAÇÃO DE MESVERSÁRIOS
  const [compareMode, setCompareMode] = useState(false);
  const [compareMonthA, setCompareMonthA] = useState<number>(1);
  const [compareMonthB, setCompareMonthB] = useState<number>(3);

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendReaction = (momentId: string, emoji: string) => {
    addMomentReaction(momentId, {
      emoji,
      user_name: 'Você',
    });
    Alert.alert('Reação Enviada! ' + emoji, 'A família inteira foi notificada com seu carinho.');
  };

  const handleSendComment = (momentId: string) => {
    const text = commentInputs[momentId]?.trim();
    if (!text) return;

    addMomentReaction(momentId, {
      comment: text,
      user_name: 'Você (Família)',
    });

    setCommentInputs((prev) => ({ ...prev, [momentId]: '' }));
    setCommentingPostId(null);
  };

  // MOMENTOS FILTRADOS
  const filteredMoments = moments.filter((m) => {
    if (feedFilter === 'all') return true;
    return m.milestone_type === feedFilter;
  });

  // MAPA DE FOTOS DE MESVERSÁRIOS (1 A 12 MESES)
  const mesversarioMoments = moments.filter((m) => m.milestone_type === 'mesversario' && m.month_age);
  const monthMap = new Map<number, Moment>();
  mesversarioMoments.forEach((m) => {
    if (m.month_age && !monthMap.has(m.month_age)) {
      monthMap.set(m.month_age, m);
    }
  });

  // HISTÓRIAS RÁPIDAS
  const storyHighlights = [
    { title: '1º Mês', img: monthMap.get(1)?.media_url || 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&w=400&q=80', active: false },
    { title: '2º Mês', img: monthMap.get(2)?.media_url || 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=400&q=80', active: false },
    { title: '3º Mês ✨', img: monthMap.get(3)?.media_url || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80', active: true },
    { title: '1º Sorriso', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80', active: false },
    { title: '1º Banho', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80', active: false },
  ];

  const achievedMilestonesCount = firstMilestones.filter((fm) => !!fm.achieved_date).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER SUPERIOR */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarGlow}>
            <Image source={{ uri: baby.avatar_url }} style={styles.babyAvatar} />
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.babyName}>{baby.name}</Text>
              <View style={styles.statusDot} />
            </View>
            <Text style={styles.babyAgeSubtitle}>
              {isBorn
                ? `✨ ${ageInfo?.formattedText}`
                : `🌱 ${gestationInfo?.currentWeek}ª Semana (${gestationInfo?.fruitComparison})`}
            </Text>
          </View>
        </View>

        {/* AÇÕES DO HEADER DIREITO */}
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.modeToggle}
            onPress={toggleBabyMode}
            activeOpacity={0.8}
          >
            <BabyIcon size={14} color={Colors.primary} />
            <Text style={styles.modeToggleText}>
              {isBorn ? 'Gestação' : 'Nascido'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => router.push('/modals/user-profile')}
            activeOpacity={0.8}
          >
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.profileAvatarImg} />
            ) : (
              <UserIcon size={16} color={Colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* SELETOR DE SUB-ABAS (Linha do Tempo, Mesversários, Primeiras Vezes) */}
      <View style={styles.subTabsContainer}>
        <TouchableOpacity
          style={[styles.subTabItem, subTab === 'feed' && styles.subTabItemActive]}
          onPress={() => setSubTab('feed')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, subTab === 'feed' && styles.subTabTextActive]}>
            Linha do Tempo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabItem, subTab === 'mesversarios' && styles.subTabItemActive]}
          onPress={() => setSubTab('mesversarios')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, subTab === 'mesversarios' && styles.subTabTextActive]}>
            Mesversários (1 a 12)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.subTabItem, subTab === 'milestones' && styles.subTabItemActive]}
          onPress={() => setSubTab('milestones')}
          activeOpacity={0.8}
        >
          <Text style={[styles.subTabText, subTab === 'milestones' && styles.subTabTextActive]}>
            Primeiras Vezes ({achievedMilestonesCount}/10)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================================= */}
        {/* SUB-ABA 1: LINHA DO TEMPO (FEED FAMILIAR PRIVADO) */}
        {/* ========================================================================= */}
        {subTab === 'feed' && (
          <>
            {/* CARROSSEL DE HISTÓRIAS DOS MESVERSÁRIOS */}
            <View style={styles.storiesSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesScroll}
              >
                <TouchableOpacity
                  style={styles.addStoryItem}
                  onPress={() => router.push('/modals/new-moment')}
                  activeOpacity={0.7}
                >
                  <View style={styles.addStoryCircle}>
                    <Plus size={20} color={Colors.primary} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.storyTitle}>Guardar</Text>
                </TouchableOpacity>

                {storyHighlights.map((st, i) => (
                  <TouchableOpacity key={i} style={styles.storyItem} activeOpacity={0.8}>
                    <View style={[styles.storyRing, st.active && styles.storyRingActive]}>
                      <Image source={{ uri: st.img }} style={styles.storyImage} />
                    </View>
                    <Text style={[styles.storyTitle, st.active && styles.storyTitleActive]} numberOfLines={1}>
                      {st.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* HERO CARD: PRÓXIMO MARCO */}
            <View style={styles.heroCard}>
              <View style={styles.heroCardGlow} />
              <View style={styles.heroTopRow}>
                <View style={styles.heroBadge}>
                  <Sparkles size={13} color={Colors.accent} />
                  <Text style={styles.heroBadgeText}>PRÓXIMO MARCO</Text>
                </View>
                <Text style={styles.heroCountdown}>
                  {isBorn ? 'Faltam 14 dias' : 'Em 2 semanas'}
                </Text>
              </View>

              <Text style={styles.heroCardTitle}>
                {isBorn ? '4º Mesversário de Vida' : 'Ultrassom Morfológico do 2º Trimestre'}
              </Text>
              <Text style={styles.heroCardDesc}>
                {isBorn
                  ? 'Prepare a roupinha e o cenário fofo para tirar a foto do 4º mês do Théo!'
                  : 'Momento de ver o rostinho, bracinhos e batimentos com alta nitidez.'}
              </Text>

              <TouchableOpacity
                style={styles.heroActionBtn}
                onPress={() => router.push('/modals/new-moment')}
                activeOpacity={0.85}
              >
                <Camera size={16} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={styles.heroActionBtnText}>Guardar Nova Memória</Text>
              </TouchableOpacity>
            </View>

            {/* FILTROS DO FEED */}
            <View style={styles.feedFiltersRow}>
              {[
                { id: 'all', label: `Todos (${moments.length})` },
                { id: 'mesversario', label: `🎂 Mesversários (${mesversarioMoments.length})` },
                { id: 'first_time', label: `🏆 Primeiras Vezes` },
              ].map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.feedFilterChip,
                    feedFilter === f.id && styles.feedFilterChipActive,
                  ]}
                  onPress={() => setFeedFilter(f.id as any)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.feedFilterChipText,
                      feedFilter === f.id && styles.feedFilterChipTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* FEED DE POSTS FAMILIARES */}
            {filteredMoments.map((moment) => {
              const isLiked = !!likedPosts[moment.id];
              const isReplying = commentingPostId === moment.id;

              return (
                <View key={moment.id} style={styles.postCard}>
                  {/* Autor e Parentesco */}
                  <View style={styles.postAuthorHeader}>
                    <View style={styles.postAuthorInfo}>
                      <View style={styles.authorAvatarCircle}>
                        <Text style={styles.authorAvatarLetter}>
                          {moment.author_role_label ? moment.author_role_label.charAt(0) : 'M'}
                        </Text>
                      </View>
                      <View>
                        <View style={styles.authorBadgeRow}>
                          <Text style={styles.postAuthorName}>{moment.author_name}</Text>
                          <View style={styles.familyRolePill}>
                            <Text style={styles.familyRoleText}>{moment.author_role_label || 'Família'}</Text>
                          </View>
                        </View>
                        <Text style={styles.postDate}>{formatRelativeDate(moment.taken_at)}</Text>
                      </View>
                    </View>

                    {moment.milestone_title && (
                      <View style={styles.postMilestonePill}>
                        <Sparkles size={11} color={Colors.secondary} />
                        <Text style={styles.postMilestoneText}>{moment.milestone_title}</Text>
                      </View>
                    )}
                  </View>

                  {/* Foto Principal */}
                  <View style={styles.postImageContainer}>
                    <Image
                      source={{ uri: moment.media_url }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  </View>

                  {/* Barra de Ações Afetivas */}
                  <View style={styles.postActionsBar}>
                    <View style={styles.actionsLeft}>
                      <TouchableOpacity
                        style={[styles.likeButton, isLiked && styles.likeButtonActive]}
                        onPress={() => toggleLike(moment.id)}
                        activeOpacity={0.7}
                      >
                        <Heart
                          size={20}
                          color={isLiked ? Colors.secondary : Colors.textSecondary}
                          fill={isLiked ? Colors.secondary : 'transparent'}
                          strokeWidth={2}
                        />
                        <Text style={[styles.likeCount, isLiked && styles.likeCountActive]}>
                          {(moment.reactions_count || 1) + (isLiked ? 1 : 0)}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.commentActionBtn}
                        onPress={() => setCommentingPostId(isReplying ? null : moment.id)}
                        activeOpacity={0.7}
                      >
                        <MessageCircle size={20} color={Colors.textSecondary} strokeWidth={2} />
                        <Text style={styles.actionText}>
                          {moment.reactions?.length || 0}
                        </Text>
                      </TouchableOpacity>

                      {/* EMOJIS RÁPIDOS DE REAÇÃO AFETIVA */}
                      <View style={styles.quickEmojisRow}>
                        {['❤️', '🥰', '👏', '🥺'].map((em) => (
                          <TouchableOpacity
                            key={em}
                            style={styles.quickEmojiBtn}
                            onPress={() => handleSendReaction(moment.id, em)}
                          >
                            <Text style={styles.quickEmojiText}>{em}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* Legenda do Momento */}
                  {moment.caption && (
                    <Text style={styles.postCaption}>
                      <Text style={styles.postCaptionAuthor}>{moment.author_name} </Text>
                      {moment.caption}
                    </Text>
                  )}

                  {/* Comentários Afetivos da Família */}
                  {moment.reactions && moment.reactions.length > 0 && (
                    <View style={styles.familyCommentsBox}>
                      {moment.reactions.map((r) => (
                        <View key={r.id} style={styles.commentRow}>
                          <Text style={styles.commentAuthorName}>{r.user_name}:</Text>
                          <Text style={styles.commentContent}>
                            {r.emoji ? `${r.emoji} ` : ''}
                            {r.comment || ''}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* CAMPO DE COMENTÁRIO INLINE */}
                  {isReplying && (
                    <View style={styles.inlineCommentRow}>
                      <TextInput
                        style={styles.inlineCommentInput}
                        placeholder="Deixe uma mensagem carinhosa..."
                        placeholderTextColor="#A0A7B1"
                        value={commentInputs[moment.id] || ''}
                        onChangeText={(txt) => setCommentInputs((prev) => ({ ...prev, [moment.id]: txt }))}
                      />
                      <TouchableOpacity
                        style={styles.inlineSendBtn}
                        onPress={() => handleSendComment(moment.id)}
                        activeOpacity={0.8}
                      >
                        <Send size={15} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        {/* ========================================================================= */}
        {/* SUB-ABA 2: ÁLBUM DE MESVERSÁRIOS (1 A 12 MESES) & COMPARATIVO */}
        {/* ========================================================================= */}
        {subTab === 'mesversarios' && (
          <View style={styles.mesversariosContainer}>
            {/* CARD DE CABEÇALHO DO ÁLBUM */}
            <View style={styles.albumHeaderCard}>
              <View style={styles.albumHeaderTop}>
                <View>
                  <Text style={styles.albumHeaderTitle}>Álbum dos 12 Mesversários</Text>
                  <Text style={styles.albumHeaderSub}>
                    {monthMap.size} de 12 meses registrados no 1º ano
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.compareToggleBtn, compareMode && styles.compareToggleBtnActive]}
                  onPress={() => setCompareMode(!compareMode)}
                  activeOpacity={0.8}
                >
                  <Sparkles size={14} color={compareMode ? '#FFFFFF' : Colors.primary} />
                  <Text style={[styles.compareToggleText, compareMode && styles.compareToggleTextActive]}>
                    {compareMode ? 'Fechar Comparador' : 'Comparar Meses'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* MODO COMPARATIVO LADO A LADO (TIME-LAPSE) */}
              {compareMode && (
                <View style={styles.compareSection}>
                  <Text style={styles.compareHint}>
                    Selecione dois meses para ver o salto de crescimento lado a lado:
                  </Text>

                  <View style={styles.comparePickersRow}>
                    <View style={styles.pickerBox}>
                      <Text style={styles.pickerLabel}>Mês Inicial:</Text>
                      <View style={styles.pickerChips}>
                        {[1, 2, 3].map((m) => (
                          <TouchableOpacity
                            key={m}
                            style={[styles.pickerChip, compareMonthA === m && styles.pickerChipActive]}
                            onPress={() => setCompareMonthA(m)}
                          >
                            <Text style={[styles.pickerChipText, compareMonthA === m && styles.pickerChipTextActive]}>
                              {m}º Mês
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.pickerBox}>
                      <Text style={styles.pickerLabel}>Mês Final:</Text>
                      <View style={styles.pickerChips}>
                        {[1, 2, 3].map((m) => (
                          <TouchableOpacity
                            key={m}
                            style={[styles.pickerChip, compareMonthB === m && styles.pickerChipActive]}
                            onPress={() => setCompareMonthB(m)}
                          >
                            <Text style={[styles.pickerChipText, compareMonthB === m && styles.pickerChipTextActive]}>
                              {m}º Mês
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>

                  {/* VISUALIZAÇÃO LADO A LADO */}
                  <View style={styles.comparisonCardsRow}>
                    {/* CARD MÊS A */}
                    <View style={styles.comparisonCard}>
                      <Text style={styles.comparisonMonthTitle}>{compareMonthA}º Mês de Vida</Text>
                      <Image
                        source={{ uri: monthMap.get(compareMonthA)?.media_url || 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&w=600&q=80' }}
                        style={styles.comparisonImage}
                      />
                      <Text style={styles.comparisonWeight}>
                        Peso: {compareMonthA === 1 ? '4.60 kg' : compareMonthA === 2 ? '5.65 kg' : '6.25 kg'}
                      </Text>
                    </View>

                    {/* CARD MÊS B */}
                    <View style={styles.comparisonCard}>
                      <Text style={styles.comparisonMonthTitle}>{compareMonthB}º Mês de Vida</Text>
                      <Image
                        source={{ uri: monthMap.get(compareMonthB)?.media_url || 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80' }}
                        style={styles.comparisonImage}
                      />
                      <Text style={styles.comparisonWeight}>
                        Peso: {compareMonthB === 1 ? '4.60 kg' : compareMonthB === 2 ? '5.65 kg' : '6.25 kg'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.comparisonInsight}>
                    <Sparkles size={16} color={Colors.accent} />
                    <Text style={styles.comparisonInsightText}>
                      Evolução incrível: ganho de peso saudável com desenvolvimento motor pleno!
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* GRADE DOS 12 MESVERSÁRIOS */}
            <View style={styles.monthsGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((monthNum) => {
                const recordedMoment = monthMap.get(monthNum);
                const hasPhoto = !!recordedMoment;

                return (
                  <View key={monthNum} style={styles.monthCard}>
                    {hasPhoto ? (
                      <>
                        <Image source={{ uri: recordedMoment.media_url }} style={styles.monthCardImage} />
                        <View style={styles.monthBadge}>
                          <Text style={styles.monthBadgeText}>{monthNum}º Mês</Text>
                        </View>
                        <View style={styles.monthCardFooter}>
                          <Text style={styles.monthCardDate}>{formatRelativeDate(recordedMoment.taken_at)}</Text>
                          <Text style={styles.monthCardCaption} numberOfLines={2}>
                            {recordedMoment.caption}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.emptyMonthCard}>
                        <View style={styles.emptyMonthBadge}>
                          <Text style={styles.emptyMonthBadgeText}>{monthNum}º Mês</Text>
                        </View>
                        <Text style={styles.emptyMonthHint}>
                          {monthNum === 6
                            ? 'Meio aninho e Introdução Alimentar!'
                            : monthNum === 12
                            ? '1º Aninho de vida!'
                            : `Foto oficial do ${monthNum}º mês`}
                        </Text>
                        <TouchableOpacity
                          style={styles.addMonthPhotoBtn}
                          onPress={() => router.push('/modals/new-moment')}
                          activeOpacity={0.8}
                        >
                          <Plus size={14} color={Colors.primary} />
                          <Text style={styles.addMonthPhotoText}>Adicionar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* SUB-ABA 3: LIVRO DE PRIMEIRAS VEZES (BABY MILESTONES) */}
        {/* ========================================================================= */}
        {subTab === 'milestones' && (
          <View style={styles.milestonesContainer}>
            {/* CARD DE PROGRESSO */}
            <View style={styles.milestonesProgressCard}>
              <View style={styles.milestonesHeaderTop}>
                <View>
                  <Text style={styles.milestonesTitle}>Livro de Primeiras Vezes</Text>
                  <Text style={styles.milestonesSub}>
                    {achievedMilestonesCount} de {firstMilestones.length} marcos conquistados
                  </Text>
                </View>
                <Award size={26} color={Colors.accent} />
              </View>

              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(achievedMilestonesCount / firstMilestones.length) * 100}%` },
                  ]}
                />
              </View>
            </View>

            {/* LISTA DOS MARCOS */}
            {firstMilestones.map((item) => {
              const isAchieved = !!item.achieved_date;

              return (
                <View key={item.id} style={[styles.milestoneCard, isAchieved && styles.milestoneCardAchieved]}>
                  <View style={styles.milestoneTopRow}>
                    <View style={styles.milestoneIconWrap}>
                      <Text style={styles.milestoneIconText}>{item.icon}</Text>
                    </View>

                    <View style={styles.milestoneTextCol}>
                      <View style={styles.milestoneTitleRow}>
                        <Text style={styles.milestoneItemTitle}>{item.title}</Text>
                        {isAchieved && (
                          <View style={styles.achievedTag}>
                            <Check size={11} color="#FFFFFF" strokeWidth={3} />
                            <Text style={styles.achievedTagText}>Conquistado</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.milestoneDesc}>{item.description}</Text>
                    </View>
                  </View>

                  {/* FOTO E RELATO SE CONQUISTADO */}
                  {isAchieved && item.photo_url && (
                    <View style={styles.milestoneProofBox}>
                      <Image source={{ uri: item.photo_url }} style={styles.milestoneProofImage} />
                      <View style={styles.milestoneProofMeta}>
                        <Text style={styles.milestoneProofDate}>
                          📅 Conquistado em {item.achieved_date}
                        </Text>
                        {item.notes && (
                          <Text style={styles.milestoneProofNotes}>"{item.notes}"</Text>
                        )}
                        <Text style={styles.milestoneProofAuthor}>
                          Registrado por {item.logged_by || 'Mamãe'}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* BOTÃO PARA REGISTRAR OU ATUALIZAR */}
                  <TouchableOpacity
                    style={[styles.recordMilestoneBtn, isAchieved && styles.recordMilestoneBtnEdit]}
                    onPress={() =>
                      router.push({
                        pathname: '/modals/record-milestone',
                        params: {
                          key: item.key,
                          title: item.title,
                          icon: item.icon,
                        },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Camera size={14} color={isAchieved ? Colors.primary : '#FFFFFF'} />
                    <Text style={[styles.recordMilestoneBtnText, isAchieved && styles.recordMilestoneBtnTextEdit]}>
                      {isAchieved ? 'Editar Foto / Relato' : 'Registrar Este Marco'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
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
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarGlow: {
    padding: 2,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  babyAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  babyName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.success,
  },
  babyAgeSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#D4E5DB',
  },
  modeToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  subTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
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
    paddingBottom: 50,
  },
  storiesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  storiesScroll: {
    paddingHorizontal: Spacing.md,
    gap: 14,
  },
  addStoryItem: {
    alignItems: 'center',
    gap: 6,
  },
  addStoryCircle: {
    width: 58,
    height: 58,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyItem: {
    alignItems: 'center',
    gap: 6,
  },
  storyRing: {
    padding: 2.5,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  storyRingActive: {
    borderColor: Colors.secondary,
    borderWidth: 2,
  },
  storyImage: {
    width: 54,
    height: 54,
    borderRadius: Radius.full,
  },
  storyTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    maxWidth: 62,
    textAlign: 'center',
  },
  storyTitleActive: {
    color: Colors.secondaryDark,
    fontWeight: '800',
  },
  heroCard: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFEAE2',
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.card,
  },
  heroCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.secondary,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  heroCountdown: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
  },
  heroCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroCardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: Radius.md,
    gap: 8,
    ...Shadows.subtle,
  },
  heroActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  feedFiltersRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginTop: 18,
    marginBottom: 12,
    gap: 8,
  },
  feedFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedFilterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  feedFilterChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  feedFilterChipTextActive: {
    color: '#FFFFFF',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.md,
    marginBottom: 18,
    borderRadius: Radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ECE6DC',
    ...Shadows.card,
  },
  postAuthorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatarCircle: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorAvatarLetter: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.secondary,
  },
  authorBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  postAuthorName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  familyRolePill: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.xs,
  },
  familyRoleText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  postDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  postMilestonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF5F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: '#FDE4DC',
  },
  postMilestoneText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  postImageContainer: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: '#F5F2EB',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFEB',
    marginBottom: 8,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  likeButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  likeCount: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  likeCountActive: {
    color: Colors.secondary,
  },
  commentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  quickEmojisRow: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 'auto',
  },
  quickEmojiBtn: {
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#EFE7DA',
  },
  quickEmojiText: {
    fontSize: 14,
  },
  postCaption: {
    fontSize: 13.5,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 6,
  },
  postCaptionAuthor: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  familyCommentsBox: {
    backgroundColor: '#FBF9F5',
    borderRadius: Radius.sm,
    padding: 10,
    marginTop: 6,
    gap: 4,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 4,
  },
  commentAuthorName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  commentContent: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  inlineCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  inlineCommentInput: {
    flex: 1,
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12.5,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inlineSendBtn: {
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // MESVERSÁRIOS STYLES
  mesversariosContainer: {
    padding: Spacing.md,
  },
  albumHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  albumHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  albumHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  albumHeaderSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  compareToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#D4E5DB',
  },
  compareToggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  compareToggleText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  compareToggleTextActive: {
    color: '#FFFFFF',
  },
  compareSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F5EFE6',
  },
  compareHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  comparePickersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  pickerBox: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 6,
  },
  pickerChips: {
    flexDirection: 'row',
    gap: 6,
  },
  pickerChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: '#F7F3EC',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  pickerChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  pickerChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  pickerChipTextActive: {
    color: '#FFFFFF',
  },
  comparisonCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  comparisonCard: {
    flex: 1,
    backgroundColor: '#F9F6F0',
    borderRadius: Radius.lg,
    padding: 10,
    alignItems: 'center',
  },
  comparisonMonthTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  comparisonImage: {
    width: '100%',
    height: 140,
    borderRadius: Radius.md,
    marginBottom: 8,
  },
  comparisonWeight: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.primary,
  },
  comparisonInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accentLight,
    padding: 10,
    borderRadius: Radius.md,
  },
  comparisonInsightText: {
    fontSize: 11.5,
    color: '#8A5A00',
    flex: 1,
    lineHeight: 16,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  monthCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  monthCardImage: {
    width: '100%',
    height: 150,
  },
  monthBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  monthBadgeText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  monthCardFooter: {
    padding: 10,
  },
  monthCardDate: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  monthCardCaption: {
    fontSize: 11.5,
    color: Colors.textPrimary,
    lineHeight: 15,
  },
  emptyMonthCard: {
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FAF7F2',
  },
  emptyMonthBadge: {
    backgroundColor: '#EAE3D6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: 8,
  },
  emptyMonthBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  emptyMonthHint: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 12,
  },
  addMonthPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addMonthPhotoText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },

  // MILESTONES STYLES
  milestonesContainer: {
    padding: Spacing.md,
  },
  milestonesProgressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  milestonesHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestonesTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  milestonesSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3EDE2',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  milestoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  milestoneCardAchieved: {
    borderColor: '#D4E5DB',
    backgroundColor: '#FAFCFA',
  },
  milestoneTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  milestoneIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: '#F8F4ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneIconText: {
    fontSize: 22,
  },
  milestoneTextCol: {
    flex: 1,
  },
  milestoneTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  milestoneItemTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  achievedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  achievedTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  milestoneDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  milestoneProofBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ECE4D6',
  },
  milestoneProofImage: {
    width: 70,
    height: 70,
    borderRadius: Radius.sm,
  },
  milestoneProofMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  milestoneProofDate: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 3,
  },
  milestoneProofNotes: {
    fontSize: 11.5,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  milestoneProofAuthor: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
  recordMilestoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: Radius.md,
    marginTop: 12,
  },
  recordMilestoneBtnEdit: {
    backgroundColor: Colors.primaryLight,
  },
  recordMilestoneBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  recordMilestoneBtnTextEdit: {
    color: Colors.primary,
  },
});
