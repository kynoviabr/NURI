import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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
  Bookmark,
  ChevronRight,
  Baby as BabyIcon,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateBabyAge, calculateGestation, formatRelativeDate } from '../../src/utils/babyCalculations';

export default function FeedScreen() {
  const router = useRouter();
  const { baby, moments, toggleBabyMode } = useApp();

  const isBorn = baby.status === 'born';
  const ageInfo = isBorn && baby.birth_date ? calculateBabyAge(baby.birth_date) : null;
  const gestationInfo = !isBorn && baby.due_date ? calculateGestation(baby.due_date) : null;

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({ p1: true });

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Histórias rápidas de mesversários / marcos em destaque
  const storyHighlights = [
    { title: '1º Mês', img: 'https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&w=400&q=80', active: false },
    { title: '2º Mês', img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=400&q=80', active: false },
    { title: '3º Mês ✨', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80', active: true },
    { title: '1º Banho', img: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&q=80', active: false },
    { title: 'Ultrassom', img: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=400&q=80', active: false },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* BARRA SUPERIOR ELEGANTE */}
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

        {/* ALTERNADOR DE MODO (Gestação vs Nascido) */}
        <TouchableOpacity
          style={styles.modeToggle}
          onPress={toggleBabyMode}
          activeOpacity={0.8}
        >
          <BabyIcon size={14} color={Colors.primary} />
          <Text style={styles.modeToggleText}>
            {isBorn ? 'Ver Gestação' : 'Ver Nascido'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CARROSSEL DE MARCOS / DESTAQUES DO 1º ANO */}
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
              <Text style={styles.storyTitle}>Adicionar</Text>
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

        {/* HERO CARD DE CELEBRAÇÃO / PRÓXIMO MARCO */}
        <View style={styles.heroCard}>
          <View style={styles.heroCardGlow} />
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Sparkles size={13} color={Colors.accent} />
              <Text style={styles.heroBadgeText}>PRÓXIMO MARCO</Text>
            </View>
            <Text style={styles.heroCountdown}>
              {isBorn ? 'Faltam 18 dias' : 'Em 2 semanas'}
            </Text>
          </View>

          <Text style={styles.heroCardTitle}>
            {isBorn ? ageInfo?.nextMilestoneTitle : 'Ultrassom Morfológico do 2º Trimestre'}
          </Text>
          <Text style={styles.heroCardDesc}>
            {isBorn
              ? 'Tire a foto oficial deste mês para o álbum de time-lapse com IA!'
              : 'Momento de ver os bracinhos, perninhas e o rostinho com nitidez incrível.'}
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

        {/* TÍTULO DA LINHA DO TEMPO */}
        <View style={styles.timelineHeader}>
          <View>
            <Text style={styles.timelineTitle}>Linha do Tempo Familiar</Text>
            <Text style={styles.timelineSub}>Álbum privado e seguro da família</Text>
          </View>
          <View style={styles.secureBadge}>
            <Text style={styles.secureBadgeText}>🔒 Privado</Text>
          </View>
        </View>

        {/* FEED DE MOMENTOS ESTILO MAGAZINE / INSTAGRAM FAMILIAR */}
        {moments.map((moment) => {
          const isLiked = !!likedPosts[moment.id];

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

                {/* Tag de Marco Especial */}
                {moment.milestone_title && (
                  <View style={styles.postMilestonePill}>
                    <Sparkles size={11} color={Colors.secondary} />
                    <Text style={styles.postMilestoneText}>{moment.milestone_title}</Text>
                  </View>
                )}
              </View>

              {/* Foto Principal com cantos arredondados e sombra suave */}
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

                  <TouchableOpacity style={styles.commentActionBtn} activeOpacity={0.7}>
                    <MessageCircle size={20} color={Colors.textSecondary} strokeWidth={2} />
                    <Text style={styles.actionText}>
                      {moment.reactions?.length || 0}
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.shareIconBtn} activeOpacity={0.7}>
                  <Share2 size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Legenda do Momento */}
              {moment.caption && (
                <Text style={styles.postCaption}>
                  <Text style={styles.postCaptionAuthor}>{moment.author_name} </Text>
                  {moment.caption}
                </Text>
              )}

              {/* Comentários Afetivos da Família (Vovós, Padrinhos) */}
              {moment.reactions && moment.reactions.length > 0 && (
                <View style={styles.familyCommentsBox}>
                  {moment.reactions.map((r) => (
                    <View key={r.id} style={styles.commentRow}>
                      <Text style={styles.commentAuthorName}>{r.user_name}:</Text>
                      <Text style={styles.commentContent}>{r.comment}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
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
  scrollContent: {
    paddingBottom: 50,
  },
  storiesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
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
    width: 60,
    height: 60,
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
    width: 55,
    height: 55,
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
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: 22,
    marginBottom: 12,
  },
  timelineTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  timelineSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  secureBadge: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  secureBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
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
    gap: 16,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    gap: 6,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  shareIconBtn: {
    padding: 4,
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
});
