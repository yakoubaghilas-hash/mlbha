import React, { useState, useMemo } from 'react';
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

const HomeScreen: React.FC = () => {
  const { todayData, profile, updateProfile, addCigarette, removeCigarette, getProfileLevel } =
    useCigarette();
  const { language } = useLanguage();
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

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
    morning: i18n.t('morning'),
    afternoon: i18n.t('afternoon'),
    evening: i18n.t('evening'),
    total: i18n.t('total'),
    cigarettes: i18n.t('cigarettes'),
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

  return (
    <SafeAreaView style={styles.container}>
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
            {translations.status}: {translations[level === 'Ready for Perfection' ? 'ready_perfection' : level.toLowerCase()]}
          </Text>
        </View>

        {/* Reason Section */}
        <View style={styles.reasonSection}>
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

        {/* Period Sections */}
        <View style={styles.periodsContainer}>
          {/* Morning */}
          <PeriodSection
            title={translations.morning}
            count={todayData.morning}
            onAdd={() => addCigarette('morning')}
            onRemove={() => removeCigarette('morning')}
            color="#3b82f6"
          />

          {/* Afternoon */}
          <PeriodSection
            title={translations.afternoon}
            count={todayData.afternoon}
            onAdd={() => addCigarette('afternoon')}
            onRemove={() => removeCigarette('afternoon')}
            color="#f59e0b"
          />

          {/* Evening */}
          <PeriodSection
            title={translations.evening}
            count={todayData.evening}
            onAdd={() => addCigarette('evening')}
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
  scrollContent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0078D4',
  },
  subtitle: {
    fontSize: 14,
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
    alignItems: 'center',
  },
  addReasonButtonText: {
    color: '#0078D4',
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
