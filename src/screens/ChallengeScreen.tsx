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
import { useCigarette } from '../context/CigaretteContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const ChallengeScreen: React.FC = () => {
  const { language } = useLanguage();
  const { subscribedChallenges, subscribeToChallenge, unsubscribeFromChallenge } = useCigarette();
  const [expandedChallenge, setExpandedChallenge] = useState<number | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const translations = useMemo(() => ({
    challenges: i18n.t('challenges'),
    challenges_subtitle: i18n.t('challenges_subtitle'),
    easy_level: i18n.t('easy_level'),
    medium_level: i18n.t('medium_level'),
    hard_level: i18n.t('hard_level'),
    already_subscribed: i18n.t('already_subscribed'),
    
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
      id: 'easy_reduction',
      title: translations.easy_reduction,
      description: translations.easy_reduction_desc,
      difficulty: 'easy',
    },
    {
      id: 'easy_no_smoke',
      title: translations.easy_no_smoke,
      description: translations.easy_no_smoke_desc,
      difficulty: 'easy',
    },
    {
      id: 'easy_hydration',
      title: translations.easy_hydration,
      description: translations.easy_hydration_desc,
      difficulty: 'easy',
    },
    // Medium
    {
      id: 'medium_reduction',
      title: translations.medium_reduction,
      description: translations.medium_reduction_desc,
      difficulty: 'medium',
    },
    {
      id: 'medium_pause',
      title: translations.medium_pause,
      description: translations.medium_pause_desc,
      difficulty: 'medium',
    },
    {
      id: 'medium_substitution',
      title: translations.medium_substitution,
      description: translations.medium_substitution_desc,
      difficulty: 'medium',
    },
    // Hard
    {
      id: 'hard_day',
      title: translations.hard_day,
      description: translations.hard_day_desc,
      difficulty: 'hard',
    },
    {
      id: 'hard_multi_days',
      title: translations.hard_multi_days,
      description: translations.hard_multi_days_desc,
      difficulty: 'hard',
    },
    {
      id: 'hard_radical',
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
    const isSubscribed = subscribedChallenges.some(c => c.id === challenge.id);
    
    const difficultyColors = {
      easy: '#84cc16',
      medium: '#f97316',
      hard: '#ef4444',
    };

    const handleSubscribe = async () => {
      if (isSubscribed) {
        await unsubscribeFromChallenge(challenge.id);
        setNotificationMessage(null);
      } else {
        // Check if already has an active challenge
        const activeChallenge = subscribedChallenges.find(c => c.status === 'active');
        if (activeChallenge) {
          setNotificationMessage(translations.already_subscribed);
          setTimeout(() => setNotificationMessage(null), 3000);
        } else {
          await subscribeToChallenge(challenge.id);
        }
      }
    };

    return (
      <View style={[styles.challengeCard, { borderLeftColor: difficultyColors[challenge.difficulty] }]}>
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={styles.cardTitleContainer}
            onPress={() => setExpandedChallenge(isExpanded ? null : index)}
          >
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.challengeDescriptionPreview}>{challenge.description}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              {
                backgroundColor: isSubscribed ? '#0891b2' : '#e0e7ff',
              }
            ]}
            onPress={handleSubscribe}
          >
            <Text style={[
              styles.subscribeButtonText,
              {
                color: isSubscribed ? '#fff' : '#0891b2',
              }
            ]}>
              {isSubscribed ? '✓' : '+'}
            </Text>
          </TouchableOpacity>
        </View>
        {isExpanded && (
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
        )}
      </View>
    );
  };

  const LevelSection: React.FC<{ title: string; challenges: Challenge[]; startIndex: number }> = ({
    title,
    challenges: levelChallenges,
    startIndex,
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
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
      {/* Notification */}
      {notificationMessage && (
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{translations.challenges}</Text>
          <Text style={styles.subtitle}>{translations.challenges_subtitle}</Text>
        </View>

        <LevelSection
          title={translations.easy_level}
          challenges={easyChallenges}
          startIndex={0}
        />

        <LevelSection
          title={translations.medium_level}
          challenges={mediumChallenges}
          startIndex={3}
        />

        <LevelSection
          title={translations.hard_level}
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
  notificationBanner: {
    backgroundColor: '#fecaca',
    borderBottomColor: '#dc2626',
    borderBottomWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  notificationText: {
    color: '#7f1d1d',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
    color: '#0078D4',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#0078D4',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0078D4',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  challengeDescriptionPreview: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 16,
  },
  subscribeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
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
