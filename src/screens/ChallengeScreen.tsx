import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import i18n from '../i18n';
import { useLanguage } from '../context/LanguageContext';

interface Challenge {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const ChallengeScreen: React.FC = () => {
  const { language } = useLanguage();
  const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);

  const translations = useMemo(() => ({
    challenges: i18n.t('challenges'),
    easy_level: i18n.t('easy_level'),
    medium_level: i18n.t('medium_level'),
    hard_level: i18n.t('hard_level'),
    
    // Easy challenges
    easy_reduction: i18n.t('easy_reduction'),
    easy_no_smoke: i18n.t('easy_no_smoke'),
    easy_hydration: i18n.t('easy_hydration'),
    
    // Medium challenges
    medium_reduction: i18n.t('medium_reduction'),
    medium_pause: i18n.t('medium_pause'),
    medium_substitution: i18n.t('medium_substitution'),
    
    // Hard challenges
    hard_day: i18n.t('hard_day'),
    hard_multi_days: i18n.t('hard_multi_days'),
    hard_radical: i18n.t('hard_radical'),
    
    // Descriptions
    easy_reduction_desc: i18n.t('easy_reduction_desc'),
    easy_no_smoke_desc: i18n.t('easy_no_smoke_desc'),
    easy_hydration_desc: i18n.t('easy_hydration_desc'),
    medium_reduction_desc: i18n.t('medium_reduction_desc'),
    medium_pause_desc: i18n.t('medium_pause_desc'),
    medium_substitution_desc: i18n.t('medium_substitution_desc'),
    hard_day_desc: i18n.t('hard_day_desc'),
    hard_multi_days_desc: i18n.t('hard_multi_days_desc'),
    hard_radical_desc: i18n.t('hard_radical_desc'),
  }), [language]);

  const challenges: Challenge[] = [
    // Easy
    {
      title: translations.easy_reduction,
      description: translations.easy_reduction_desc,
      difficulty: 'easy',
    },
    {
      title: translations.easy_no_smoke,
      description: translations.easy_no_smoke_desc,
      difficulty: 'easy',
    },
    {
      title: translations.easy_hydration,
      description: translations.easy_hydration_desc,
      difficulty: 'easy',
    },
    // Medium
    {
      title: translations.medium_reduction,
      description: translations.medium_reduction_desc,
      difficulty: 'medium',
    },
    {
      title: translations.medium_pause,
      description: translations.medium_pause_desc,
      difficulty: 'medium',
    },
    {
      title: translations.medium_substitution,
      description: translations.medium_substitution_desc,
      difficulty: 'medium',
    },
    // Hard
    {
      title: translations.hard_day,
      description: translations.hard_day_desc,
      difficulty: 'hard',
    },
    {
      title: translations.hard_multi_days,
      description: translations.hard_multi_days_desc,
      difficulty: 'hard',
    },
    {
      title: translations.hard_radical,
      description: translations.hard_radical_desc,
      difficulty: 'hard',
    },
  ];

  const easyChallenges = challenges.filter(c => c.difficulty === 'easy');
  const mediumChallenges = challenges.filter(c => c.difficulty === 'medium');
  const hardChallenges = challenges.filter(c => c.difficulty === 'hard');

  const ChallengeCard: React.FC<{ challenge: Challenge; index: number }> = ({ challenge, index }) => {
    const isExpanded = expandedChallenge === index;
    const difficultyColors = {
      easy: '#84cc16',
      medium: '#f97316',
      hard: '#ef4444',
    };

    return (
      <TouchableOpacity
        style={[styles.challengeCard, { borderLeftColor: difficultyColors[challenge.difficulty] }]}
        onPress={() => setExpandedChallenge(isExpanded ? null : index)}
      >
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        {isExpanded && (
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const LevelSection: React.FC<{ title: string; icon: string; challenges: Challenge[]; startIndex: number }> = ({
    title,
    icon,
    challenges: levelChallenges,
    startIndex,
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.challengesContainer}>
        {levelChallenges.map((challenge, idx) => (
          <ChallengeCard
            key={`${challenge.difficulty}-${idx}`}
            challenge={challenge}
            index={startIndex + idx}
          />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{translations.challenges}</Text>
          <Text style={styles.subtitle}>Relève les défis pour progresser</Text>
        </View>

        <LevelSection
          title={translations.easy_level}
          icon="✅"
          challenges={easyChallenges}
          startIndex={0}
        />

        <LevelSection
          title={translations.medium_level}
          icon="⚡"
          challenges={mediumChallenges}
          startIndex={3}
        />

        <LevelSection
          title={translations.hard_level}
          icon="🔥"
          challenges={hardChallenges}
          startIndex={6}
        />

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9fc',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0891b2',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#06b6d4',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  challengesContainer: {
    gap: 8,
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  spacer: {
    height: 40,
  },
});

export default ChallengeScreen;
