import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import i18n from '../i18n';
import { useCigarette } from '../context/CigaretteContext';
import { useLanguage } from '../context/LanguageContext';
import { useSubscription } from '../context/SubscriptionContext';
import { getAllData } from '../services/storage';
import { checkChallengeStatus } from '../utils/challengeChecker';
import TimeSinceLastCigarette from '../components/TimeSinceLastCigarette';
import { PaywallModal } from '../components/PaywallModal';

const HomeScreen: React.FC = () => {
  const { todayData, profile, updateProfile, addCigarette, removeCigarette, getProfileLevel, subscribedChallenges, updateChallengeStatus } =
    useCigarette();
  const { language } = useLanguage();
  const { subscriptionStatus } = useSubscription();
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [newStrategy, setNewStrategy] = useState('');
  const [showStrategyInput, setShowStrategyInput] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [allData, setAllData] = useState<any[]>([]);

  // Load all data for challenge checking
  useEffect(() => {
    const loadData = async () => {
      const data = await getAllData();
      setAllData(data);
      
      // Check and update challenge statuses
      for (const challenge of subscribedChallenges) {
        if (challenge.status === 'active') {
          const newStatus = checkChallengeStatus(challenge.id, todayData, data);
          if (newStatus !== 'active') {
            await updateChallengeStatus(challenge.id, newStatus);
          }
        }
      }
    };
    loadData();
  }, [todayData]);

  // Create translations object that updates when language changes
  const translations = useMemo(() => ({
    app_name: i18n.t('app_name'),
    today: i18n.t('today'),
    status: i18n.t('status'),
    ready_perfection: i18n.t('ready_perfection'),
    bad: i18n.t('bad'),
    medium: i18n.t('medium'),
    good: i18n.t('good'),
    reason: i18n.t('reason'),
    anti_craving_strategy: i18n.t('anti_craving_strategy'),
    add_strategy: i18n.t('add_strategy'),
    mood: i18n.t('mood'),
    stress: i18n.t('stress'),
    social: i18n.t('social'),
    boredom: i18n.t('boredom'),
    habits: i18n.t('habits'),
    concentration: i18n.t('concentration'),
    party: i18n.t('party'),
    work_break: i18n.t('work_break'),
    metro: i18n.t('metro'),
    add_reason: i18n.t('add_reason'),
    add_tag: i18n.t('add_tag'),
    hydration: i18n.t('hydration'),
    breathing: i18n.t('breathing'),
    movement: i18n.t('movement'),
    healthy_snacking: i18n.t('healthy_snacking'),
    distraction: i18n.t('distraction'),
    meditation: i18n.t('meditation'),
    journal: i18n.t('journal'),
    substitution: i18n.t('substitution'),
    motivation: i18n.t('motivation'),
    morning: i18n.t('morning'),
    afternoon: i18n.t('afternoon'),
    evening: i18n.t('evening'),
    total: i18n.t('total'),
    cigarettes: i18n.t('cigarettes'),
    alert_just_now: i18n.t('alert_just_now'),
    alert_minutes: i18n.t('alert_minutes'),
    alert_hours: i18n.t('alert_hours'),
    alert_days: i18n.t('alert_days'),
    active_challenges: i18n.t('active_challenges'),
    in_progress: i18n.t('in_progress'),
    // Challenge titles for display
    easy_reduction: i18n.t('easy_reduction'),
    easy_no_smoke: i18n.t('easy_no_smoke'),
    easy_hydration: i18n.t('easy_hydration'),
    medium_reduction: i18n.t('medium_reduction'),
    medium_pause: i18n.t('medium_pause'),
    medium_substitution: i18n.t('medium_substitution'),
    hard_day: i18n.t('hard_day'),
    hard_multi_days: i18n.t('hard_multi_days'),
    hard_radical: i18n.t('hard_radical'),
  }), [language]);

  const total =
    todayData.morning + todayData.afternoon + todayData.evening;
  const level = getProfileLevel();
  const levelColors = {
    Bad: '#ef4444',
    Medium: '#f97316',
    Good: '#84cc16',
    'Ready for Perfection': '#22c55e',
  };

  const buildAlertMessage = (timeInfo: { diffMins: number; diffHours: number; diffDays: number } | null): string | null => {
    if (timeInfo === null) {
      return `⚠️ ${translations.alert_just_now}`;
    }

    const { diffMins, diffHours, diffDays } = timeInfo;

    if (diffMins < 1) {
      return `⚠️ ${translations.alert_just_now}`;
    } else if (diffMins < 60) {
      const plural = diffMins > 1 ? 's' : '';
      return `⚠️ ${translations.alert_minutes.replace('{count}', String(diffMins)).replace('{plural}', plural)}`;
    } else if (diffHours < 24) {
      const plural = diffHours > 1 ? 's' : '';
      return `⚠️ ${translations.alert_hours.replace('{count}', String(diffHours)).replace('{plural}', plural)}`;
    } else {
      const plural = diffDays > 1 ? 's' : '';
      return `⚠️ ${translations.alert_days.replace('{count}', String(diffDays)).replace('{plural}', plural)}`;
    }
  };

  const handleAddTag = (tag: string) => {
    if (!profile.tags.includes(tag)) {
      const updatedProfile = {
        ...profile,
        tags: [...profile.tags, tag],
      };
      updateProfile(updatedProfile);
    }
  };

  const handleAddCustomTag = () => {
    if (newTag.trim()) {
      handleAddTag(newTag.trim());
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedProfile = {
      ...profile,
      tags: profile.tags.filter((_, i) => i !== index),
    };
    updateProfile(updatedProfile);
  };

  const handleAddStrategy = (strategy: string) => {
    const strategies = profile.strategies || [];
    if (!strategies.includes(strategy)) {
      const updatedProfile = {
        ...profile,
        strategies: [...strategies, strategy],
      };
      updateProfile(updatedProfile);
    }
  };

  const handleAddCustomStrategy = () => {
    if (newStrategy.trim()) {
      handleAddStrategy(newStrategy.trim());
      setNewStrategy('');
      setShowStrategyInput(false);
    }
  };

  const handleRemoveStrategy = (index: number) => {
    const strategies = profile.strategies || [];
    const updatedProfile = {
      ...profile,
      strategies: strategies.filter((_, i) => i !== index),
    };
    updateProfile(updatedProfile);
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(null), 4000); // Disappear after 4 seconds
  };

  return (
    <SafeAreaView style={styles.container}>
      {!subscriptionStatus.isPremium && <PaywallModal />}
      
      {/* Alert Message */}
      {alertMessage && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </View>
      )}

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{translations.app_name}</Text>
          <Text style={styles.subtitle}>{translations.today}</Text>
        </View>

        {/* Level Badge */}
        <View
          style={[
            styles.levelBadge,
            { backgroundColor: levelColors[level] },
          ]}
        >
          <Text style={styles.levelText} numberOfLines={1}>
            {translations.status}: {translations[level === 'Ready for Perfection' ? 'ready_perfection' : level.toLowerCase() as keyof typeof translations]}
          </Text>
        </View>

        {/* Subscribed Challenges Section */}
        {subscribedChallenges.length > 0 && (
          <View style={styles.challengesSection}>
            <Text style={styles.challengesSectionLabel}>{translations.active_challenges}</Text>
            <View style={styles.subscribedChallengesContainer}>
              {subscribedChallenges.map((challenge) => {
                const statusColors = {
                  active: '#E0F4FF',
                  won: '#22c55e',
                  lost: '#ef4444',
                };
                const statusTextColors = {
                  active: '#0078D4',
                  won: '#ffffff',
                  lost: '#ffffff',
                };
                const challengeTitle = translations[challenge.id as keyof typeof translations] || challenge.id;
                const statusLabel = challenge.status === 'won' ? '✓' : challenge.status === 'lost' ? '✗' : `● ${translations.in_progress}`;
                return (
                  <View
                    key={challenge.id}
                    style={[
                      styles.subscribedChallenge,
                      { backgroundColor: statusColors[challenge.status] }
                    ]}
                  >
                    <Text style={[
                      styles.subscribedChallengeText,
                      { color: statusTextColors[challenge.status] }
                    ]}>
                      {challengeTitle} • {statusLabel}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Time Since Last Cigarette Counter */}
        <TimeSinceLastCigarette />

        {/* Reason & Strategy Sections */}
        <View style={styles.reasonStrategyContainer}>
          {/* Reason Section */}
          <View style={[styles.reasonSection, styles.sideSection]}>
            <Text style={styles.reasonLabel}>{translations.reason}</Text>
            
            {/* Suggested Reasons */}
            <View style={styles.suggestedReasonsContainer}>
              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.mood)}
              >
                <Text style={styles.suggestedReasonText}>😊 {translations.mood}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.stress)}
              >
                <Text style={styles.suggestedReasonText}>😰 {translations.stress}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.social)}
              >
                <Text style={styles.suggestedReasonText}>👥 {translations.social}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.boredom)}
              >
                <Text style={styles.suggestedReasonText}>😑 {translations.boredom}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.habits)}
              >
                <Text style={styles.suggestedReasonText}>👔 {translations.habits}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.concentration)}
              >
                <Text style={styles.suggestedReasonText}>🧠 {translations.concentration}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.party)}
              >
                <Text style={styles.suggestedReasonText}>🎉 {translations.party}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.work_break)}
              >
                <Text style={styles.suggestedReasonText}>☕ {translations.work_break}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddTag(translations.metro)}
              >
                <Text style={styles.suggestedReasonText}>🚇 {translations.metro}</Text>
              </TouchableOpacity>
            </View>

            {/* Active Reasons */}
            {profile.tags.length > 0 && (
              <View style={styles.activeReasonsContainer}>
                {profile.tags.map((reason, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.activeReason}
                    onPress={() => handleRemoveTag(index)}
                  >
                    <Text style={styles.activeReasonText}>{reason} ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Add Custom Reason */}
            {!showTagInput ? (
              <TouchableOpacity
                style={styles.addReasonButton}
                onPress={() => setShowTagInput(true)}
              >
                <Text style={styles.addReasonButtonText}>+ {translations.add_reason}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder={translations.add_tag}
                  placeholderTextColor="#94a3b8"
                  value={newTag}
                  onChangeText={setNewTag}
                  onSubmitEditing={handleAddCustomTag}
                />
                <TouchableOpacity
                  style={styles.tagInputButton}
                  onPress={handleAddCustomTag}
                >
                  <Text style={styles.tagInputButtonText}>✓</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Anti-Craving Strategy Section */}
          <View style={[styles.reasonSection, styles.sideSection]}>
            <Text style={styles.reasonLabel}>{translations.anti_craving_strategy}</Text>
            
            {/* Suggested Strategies */}
            <View style={styles.suggestedReasonsContainer}>
              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.hydration)}
              >
                <Text style={styles.suggestedReasonText}>💧 {translations.hydration}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.breathing)}
              >
                <Text style={styles.suggestedReasonText}>🫁 {translations.breathing}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.movement)}
              >
                <Text style={styles.suggestedReasonText}>🚶 {translations.movement}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.healthy_snacking)}
              >
                <Text style={styles.suggestedReasonText}>🍎 {translations.healthy_snacking}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.distraction)}
              >
                <Text style={styles.suggestedReasonText}>🎮 {translations.distraction}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.meditation)}
              >
                <Text style={styles.suggestedReasonText}>🧘 {translations.meditation}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.social)}
              >
                <Text style={styles.suggestedReasonText}>👥 {translations.social}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.journal)}
              >
                <Text style={styles.suggestedReasonText}>📝 {translations.journal}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.substitution)}
              >
                <Text style={styles.suggestedReasonText}>🔄 {translations.substitution}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestedReason}
                onPress={() => handleAddStrategy(translations.motivation)}
              >
                <Text style={styles.suggestedReasonText}>💪 {translations.motivation}</Text>
              </TouchableOpacity>
            </View>

            {/* Active Strategies */}
            {profile.strategies && profile.strategies.length > 0 && (
              <View style={styles.activeReasonsContainer}>
                {profile.strategies.map((strategy, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.activeReason}
                    onPress={() => handleRemoveStrategy(index)}
                  >
                    <Text style={styles.activeReasonText}>{strategy} ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Add Custom Strategy */}
            {!showStrategyInput ? (
              <TouchableOpacity
                style={styles.addReasonButton}
                onPress={() => setShowStrategyInput(true)}
              >
                <Text style={styles.addReasonButtonText}>+ {translations.add_strategy}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  placeholder={translations.add_strategy}
                  placeholderTextColor="#94a3b8"
                  value={newStrategy}
                  onChangeText={setNewStrategy}
                  onSubmitEditing={handleAddCustomStrategy}
                />
                <TouchableOpacity
                  style={styles.tagInputButton}
                  onPress={handleAddCustomStrategy}
                >
                  <Text style={styles.tagInputButtonText}>✓</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Period Sections */}
        <View style={styles.periodsContainer}>
          {/* Morning */}
          <PeriodSection
            title={translations.morning}
            count={todayData.morning}
            onAdd={() => {
              const timeInfo = addCigarette('morning');
              const message = buildAlertMessage(timeInfo);
              if (message) {
                showAlert(message);
              }
            }}
            onRemove={() => removeCigarette('morning')}
            color="#3b82f6"
          />

          {/* Afternoon */}
          <PeriodSection
            title={translations.afternoon}
            count={todayData.afternoon}
            onAdd={() => {
              const timeInfo = addCigarette('afternoon');
              const message = buildAlertMessage(timeInfo);
              if (message) {
                showAlert(message);
              }
            }}
            onRemove={() => removeCigarette('afternoon')}
            color="#f59e0b"
          />

          {/* Evening */}
          <PeriodSection
            title={translations.evening}
            count={todayData.evening}
            onAdd={() => {
              const timeInfo = addCigarette('evening');
              const message = buildAlertMessage(timeInfo);
              if (message) {
                showAlert(message);
              }
            }}
            onRemove={() => removeCigarette('evening')}
            color="#8b5cf6"
          />
        </View>

        {/* Total */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{translations.total}</Text>
          <Text style={styles.totalValue}>{total}</Text>
          <Text style={styles.totalUnit}>{translations.cigarettes}</Text>
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

interface PeriodSectionProps {
  title: string;
  count: number;
  onAdd: () => void;
  onRemove: () => void;
  color: string;
}

const PeriodSection: React.FC<PeriodSectionProps> = ({
  title,
  count,
  onAdd,
  onRemove,
  color,
}) => (
  <View style={[styles.periodCard, { borderLeftColor: color }]}>
    <Text style={styles.periodTitle}>{title}</Text>
    <Text style={styles.periodCount}>{count}</Text>
    <View style={styles.buttonGroup}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#000' }]}
        onPress={onAdd}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#d1d5db' }]}
        onPress={onRemove}
      >
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9fc',
  },
  alertBanner: {
    backgroundColor: '#fecaca',
    borderBottomColor: '#dc2626',
    borderBottomWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  alertText: {
    color: '#7f1d1d',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0078D4',
  },
  subtitle: {
    fontSize: 10,
    color: '#0090DA',
    marginTop: 2,
  },
  levelBadge: {
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  challengesSection: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#0078D4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  challengesSectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0078D4',
    marginBottom: 10,
  },
  subscribedChallengesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subscribedChallenge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  subscribedChallengeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  reasonSection: {
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#0078D4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reasonStrategyContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  sideSection: {
    flex: 1,
    marginHorizontal: 8,
  },
  reasonLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0078D4',
    marginBottom: 10,
  },
  suggestedReasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  suggestedReason: {
    backgroundColor: '#E0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 14,
  },
  suggestedReasonText: {
    fontSize: 11,
    color: '#0078D4',
    fontWeight: '500',
  },
  activeReasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  activeReason: {
    backgroundColor: '#0078D4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  activeReasonText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  addReasonButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#0078D4',
    alignSelf: 'flex-start',
    marginLeft: 0,
  },
  addReasonButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0F4FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: '#0078D4',
  },
  tagInputButton: {
    backgroundColor: '#0078D4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagInputButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  periodsContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  periodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 12,
    shadowColor: '#0078D4',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  periodTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0078D4',
    marginBottom: 6,
  },
  periodCount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0078D4',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalContainer: {
    alignItems: 'center',
    backgroundColor: '#0078D4',
    marginHorizontal: 16,
    marginVertical: 15,
    paddingVertical: 15,
    borderRadius: 12,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  totalCount: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalUnit: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  spacer: {
    height: 20,
  },
});

export default HomeScreen;
