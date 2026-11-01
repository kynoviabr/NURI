import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Heart, MessageCircle, Calendar, Sparkles, RefreshCw } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Colors, Spacing, Radius, Shadows } from '../../src/constants/theme';
import { calculateBabyAge, calculateGestation, formatRelativeDate } from '../../src/utils/babyCalculations';

export default function FeedScreen() {
  const router = useRouter();
  const { baby, moments, toggleBabyMode } = useApp();

  const isBorn = baby.status === 'born';
  const ageInfo = isBorn && baby.birth_date ? calculateBabyAge(baby.birth_date) : null;
  const gestationInfo = !isBorn && baby.due_date ? calculateGestation(baby.due_date) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* HEADER DO BEBÊ */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: baby.avatar_url }} style={styles.babyAvatar} />
          <View>
            <Text style={styles.babyName}>{baby.name}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.babyAgeBadge}>
                {isBorn ? ageInfo?.formattedText : `${gestationInfo?.currentWeek}ª Semana (${gestationInfo?.fruitComparison})`}
              </Text>
            </View>
          </View>
        </View>

        {/* Botão de alternar modo para demonstração (Gestação <-> Nascido) */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={toggleBabyMode}
          activeOpacity={0.7}
        >
          <RefreshCw size={14} color={Colors.primary} />
          <Text style={styles.switchButtonText}>Modo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* BANNER DE DESTAQUE / MARCO */}
        <View style={styles.heroBanner}>
          <View style={styles.heroTextContainer}>
            <View style={styles.heroHeaderRow}>
              <Sparkles size={18} color={Colors.accent} />
              <Text style={styles.heroTitle}>
                {isBorn ? ageInfo?.nextMilestoneTitle : 'Próximo Exame: Morfológico'}
              </Text>
            </View>
            <Text style={styles.heroSubtitle}>
              {isBorn
                ? 'Prepare o tema e as fotos para comemorar mais um mês de vida!'
                : `Seu bebê está com o tamanho de um(a) ${gestationInfo?.fruitComparison}.`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => router.push('/modals/new-moment')}
            activeOpacity={0.8}
          >
            <Plus size={18} color={Colors.textInverted} />
            <Text style={styles.heroButtonText}>Postar Foto</Text>
          </TouchableOpacity>
        </View>

        {/* FEED DE MOMENTOS DA FAMÍLIA */}
        <Text style={styles.sectionTitle}>Linha do Tempo da Família</Text>

        {moments.map((moment) => (
          <View key={moment.id} style={styles.momentCard}>
            {/* Cabeçalho do Card (Autor e Parentesco) */}
            <View style={styles.cardHeader}>
              <View style={styles.authorRow}>
                <View style={styles.authorBadge}>
                  <Text style={styles.authorBadgeText}>{moment.author_role_label || 'Família'}</Text>
                </View>
                <Text style={styles.authorName}>{moment.author_name}</Text>
              </View>
              <Text style={styles.momentDate}>{formatRelativeDate(moment.taken_at)}</Text>
            </View>

            {/* Tag de Marco (Mesversário ou Primeira Vez) */}
            {moment.milestone_title && (
              <View style={styles.milestoneTag}>
                <Sparkles size={12} color={Colors.secondary} />
                <Text style={styles.milestoneTagText}>{moment.milestone_title}</Text>
              </View>
            )}

            {/* Imagem do Momento */}
            <Image
              source={{ uri: moment.media_url }}
              style={styles.momentImage}
              resizeMode="cover"
            />

            {/* Legenda */}
            {moment.caption && (
              <Text style={styles.momentCaption}>{moment.caption}</Text>
            )}

            {/* Barra de Reações e Comentários da Família */}
            <View style={styles.reactionBar}>
              <TouchableOpacity style={styles.reactionButton} activeOpacity={0.7}>
                <Heart size={18} color={Colors.secondary} fill={Colors.secondary} />
                <Text style={styles.reactionCount}>{moment.reactions_count || 1}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.reactionButton} activeOpacity={0.7}>
                <MessageCircle size={18} color={Colors.textSecondary} />
                <Text style={styles.reactionCount}>
                  {moment.reactions?.length || 0}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Comentários Recentes dos Parentes (ex: Vovó) */}
            {moment.reactions && moment.reactions.length > 0 && (
              <View style={styles.commentsList}>
                {moment.reactions.map((r) => (
                  <View key={r.id} style={styles.commentItem}>
                    <Text style={styles.commentUser}>{r.user_name}:</Text>
                    <Text style={styles.commentText}>{r.comment}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
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
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  babyAvatar: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  babyName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  babyAgeBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
  },
  switchButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  heroBanner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  heroTextContainer: {
    marginBottom: Spacing.xs,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: Radius.md,
    gap: 6,
  },
  heroButtonText: {
    color: Colors.textInverted,
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  momentCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorBadge: {
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  authorBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  momentDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  milestoneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  milestoneTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondaryDark,
  },
  momentImage: {
    width: '100%',
    height: 280,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  momentCaption: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  reactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  reactionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  commentsList: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
  },
  commentUser: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  commentText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
});
