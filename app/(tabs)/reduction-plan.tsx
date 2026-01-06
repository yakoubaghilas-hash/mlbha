import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from '../../src/i18n';
import { useCigarette } from '../../src/context/CigaretteContext';
import { useLanguage } from '../../src/context/LanguageContext';

interface ReductionPlan {
  pace: 'slow' | 'moderate' | 'fast';
  startingCigarettes: number;
  currentLevel: number;
  stages: Stage[];
  createdDate: string;
  motivation: string;
}

interface Stage {
  id: number;
  from: number;
  to: number;
  duration: number;
  status: 'pending' | 'active' | 'completed' | 'failed';
  startDate?: string;
  completionDate?: string;
}

const ReductionPlanScreen: React.FC = () => {
  const { language } = useLanguage();
  const cigaretteContext = useCigarette();
  const todayData = cigaretteContext?.todayData || { morning: 0, afternoon: 0, evening: 0 };
  const [plan, setPlan] = useState<ReductionPlan | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [selectedPace, setSelectedPace] = useState<'slow' | 'moderate' | 'fast'>('moderate');
  const [startingCigarettes, setStartingCigarettes] = useState(10);
  const [motivation, setMotivation] = useState('health');

  const translations = useMemo(() => ({
    reduction_plan: i18n.t('reduction_plan') || 'Gradual Reduction Plan',
    start_journey: i18n.t('start_journey') || 'Start Your Journey',
    current_level: i18n.t('current_level') || 'Current Level',
    cigarettes_per_day: i18n.t('cigarettes_per_day') || 'cigarettes/day',
    choose_pace: i18n.t('choose_pace') || 'Choose Your Pace',
    slow: i18n.t('slow') || 'Slow',
    moderate: i18n.t('moderate') || 'Moderate',
    fast: i18n.t('fast') || 'Fast',
    pace_slow_desc: i18n.t('pace_slow_desc') || '−1 cigarette every 5–7 days',
    pace_moderate_desc: i18n.t('pace_moderate_desc') || '−1 cigarette every 2–3 days',
    pace_fast_desc: i18n.t('pace_fast_desc') || '−1 cigarette per day',
    motivation: i18n.t('motivation') || 'Main Motivation',
    health: i18n.t('health') || 'Health',
    money: i18n.t('money') || 'Save Money',
    family: i18n.t('family') || 'Family',
    start_plan: i18n.t('start_plan') || 'Start Plan',
    active_stage: i18n.t('active_stage') || 'Active Stage',
    days_remaining: i18n.t('days_remaining') || 'Days remaining',
    today_goal: i18n.t('today_goal') || 'Today\'s goal',
    max_cigarettes: i18n.t('max_cigarettes') || 'max cigarettes',
    stage_completed: i18n.t('stage_completed') || 'Stage Completed',
    adjust_plan: i18n.t('adjust_plan') || 'Adjust Plan',
    progress: i18n.t('progress') || 'Progress',
    stages: i18n.t('stages') || 'Stages',
    phase_final: i18n.t('phase_final') || 'Final Phase',
    zero_cigarette_mode: i18n.t('zero_cigarette_mode') || 'When you reach 1 cigarette/day, a special "Zero Cigarette" mode will activate with short challenges and continuous support.',
  }), [language]);

  const generatePlan = (
    starting: number,
    pace: 'slow' | 'moderate' | 'fast'
  ): ReductionPlan => {
    const paceDays = {
      slow: 6,
      moderate: 3,
      fast: 1,
    };

    const daysPerStage = paceDays[pace];
    const stages: Stage[] = [];

    for (let i = starting - 1; i >= 0; i--) {
      stages.push({
        id: starting - i,
        from: starting - i + 1,
        to: i,
        duration: i === 0 ? 7 : daysPerStage,
        status: stages.length === 0 ? 'active' : 'pending',
      });
    }

    return {
      pace,
      startingCigarettes: starting,
      currentLevel: starting,
      stages,
      createdDate: new Date().toISOString().split('T')[0],
      motivation,
    };
  };

  const handleStartPlan = () => {
    const newPlan = generatePlan(startingCigarettes, selectedPace);
    setPlan(newPlan);
    setShowOnboarding(false);
  };

  const currentStage = plan?.stages.find(s => s.status === 'active');
  const completedStages = plan?.stages.filter(s => s.status === 'completed').length || 0;
  const totalStages = plan?.stages.length || 1;
  const progressPercent = (completedStages / totalStages) * 100;

  const getTodayGoal = () => {
    if (!currentStage) return null;
    return currentStage.to;
  };

  const getTodayStatus = () => {
    const goal = getTodayGoal();
    if (goal === null) return null;

    const todayTotal = todayData.morning + todayData.afternoon + todayData.evening;
    if (todayTotal <= goal) {
      return { status: 'success', message: `✅ ${translations.stage_completed}!` };
    } else {
      return { status: 'warning', message: `⚠️ Goal: ${goal}, Current: ${todayTotal}` };
    }
  };

  const renderOnboarding = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🧩 {translations.reduction_plan}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{translations.current_level}</Text>
          <View style={styles.inputGroup}>
            <TouchableOpacity
              style={styles.decreaseBtn}
              onPress={() => setStartingCigarettes(Math.max(1, startingCigarettes - 1))}
            >
              <Text style={styles.btnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.numberDisplay}>{startingCigarettes}</Text>
            <TouchableOpacity
              style={styles.increaseBtn}
              onPress={() => setStartingCigarettes(Math.min(50, startingCigarettes + 1))}
            >
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subText}>{translations.cigarettes_per_day}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{translations.choose_pace}</Text>

          <TouchableOpacity
            style={[styles.paceOption, selectedPace === 'slow' && styles.paceOptionActive]}
            onPress={() => setSelectedPace('slow')}
          >
            <View style={styles.paceIcon}>
              <Text style={styles.emoji}>🐢</Text>
            </View>
            <View style={styles.paceContent}>
              <Text style={styles.paceName}>{translations.slow}</Text>
              <Text style={styles.paceDesc}>{translations.pace_slow_desc}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paceOption, selectedPace === 'moderate' && styles.paceOptionActive]}
            onPress={() => setSelectedPace('moderate')}
          >
            <View style={styles.paceIcon}>
              <Text style={styles.emoji}>🚶</Text>
            </View>
            <View style={styles.paceContent}>
              <Text style={styles.paceName}>{translations.moderate}</Text>
              <Text style={styles.paceDesc}>{translations.pace_moderate_desc}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paceOption, selectedPace === 'fast' && styles.paceOptionActive]}
            onPress={() => setSelectedPace('fast')}
          >
            <View style={styles.paceIcon}>
              <Text style={styles.emoji}>🏃</Text>
            </View>
            <View style={styles.paceContent}>
              <Text style={styles.paceName}>{translations.fast}</Text>
              <Text style={styles.paceDesc}>{translations.pace_fast_desc}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{translations.motivation}</Text>
          {['health', 'money', 'family'].map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.motivationOption, motivation === m && styles.motivationOptionActive]}
              onPress={() => setMotivation(m)}
            >
              <View style={styles.radioButton}>
                {motivation === m && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.motivationText}>
                {m === 'health' ? '❤️ ' : m === 'money' ? '💰 ' : '👨‍👩‍👧 '}
                {translations[m as keyof typeof translations]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartPlan}>
          <Text style={styles.startButtonText}>{translations.start_plan}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  const renderPlan = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>🧩 {translations.reduction_plan}</Text>
        </View>

        {/* Progress */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{translations.progress}</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {completedStages} / {totalStages} {translations.stages}
          </Text>
        </View>

        {/* Current Stage */}
        {currentStage && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{translations.active_stage}</Text>
            <View style={styles.stageContent}>
              <View style={styles.stageGoal}>
                <Text style={styles.stageGoalLabel}>{translations.today_goal}</Text>
                <Text style={styles.stageGoalValue}>{currentStage.to}</Text>
                <Text style={styles.stageGoalUnit}>{translations.max_cigarettes}</Text>
              </View>
              <View style={styles.stageDuration}>
                <Text style={styles.stageDurationLabel}>{translations.days_remaining}</Text>
                <Text style={styles.stageDurationValue}>{currentStage.duration}</Text>
                <Text style={styles.stageDurationUnit}>days</Text>
              </View>
            </View>

            {getTodayStatus() && (
              <View
                style={[
                  styles.statusBanner,
                  getTodayStatus()?.status === 'success'
                    ? styles.statusSuccess
                    : styles.statusWarning,
                ]}
              >
                <Text style={styles.statusText}>{getTodayStatus()?.message}</Text>
              </View>
            )}
          </View>
        )}

        {/* All Stages */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{translations.stages}</Text>
          {plan?.stages.map((stage, index) => (
            <View
              key={stage.id}
              style={[
                styles.stageItem,
                stage.status === 'completed' && styles.stageItemCompleted,
                stage.status === 'active' && styles.stageItemActive,
              ]}
            >
              <View style={styles.stageNumber}>
                {stage.status === 'completed' ? (
                  <MaterialCommunityIcons name="check-circle" size={24} color="#22c55e" />
                ) : stage.status === 'active' ? (
                  <View style={styles.activeDot} />
                ) : (
                  <Text style={styles.stageNumberText}>{stage.id}</Text>
                )}
              </View>
              <View style={styles.stageInfo}>
                <Text style={styles.stageLabel}>
                  {stage.from} → {stage.to} {translations.cigarettes_per_day}
                </Text>
                <Text style={styles.stageMeta}>{stage.duration} days</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Final Phase */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🎯 {translations.phase_final}</Text>
          <Text style={styles.finalPhaseText}>
            {translations.zero_cigarette_mode}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.adjustButton}
          onPress={() => setShowOnboarding(true)}
        >
          <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
          <Text style={styles.adjustButtonText}>{translations.adjust_plan}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  return showOnboarding || !plan ? renderOnboarding() : renderPlan();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0078D4',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0078D4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  decreaseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  increaseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  numberDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0078D4',
    minWidth: 80,
    textAlign: 'center',
  },
  subText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
  },
  paceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  paceOptionActive: {
    borderColor: '#0078D4',
    backgroundColor: '#E0F4FF',
  },
  paceIcon: {
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  paceContent: {
    flex: 1,
  },
  paceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  paceDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  motivationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
  },
  motivationOptionActive: {
    backgroundColor: '#E0F4FF',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0078D4',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0078D4',
  },
  motivationText: {
    fontSize: 14,
    color: '#333',
  },
  startButton: {
    backgroundColor: '#0078D4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0078D4',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  stageContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  stageGoal: {
    alignItems: 'center',
  },
  stageGoalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  stageGoalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0078D4',
  },
  stageGoalUnit: {
    fontSize: 12,
    color: '#666',
  },
  stageDuration: {
    alignItems: 'center',
  },
  stageDurationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  stageDurationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f97316',
  },
  stageDurationUnit: {
    fontSize: 12,
    color: '#666',
  },
  statusBanner: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  statusSuccess: {
    backgroundColor: '#dcfce7',
  },
  statusWarning: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#e0e0e0',
  },
  stageItemCompleted: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: '#22c55e',
  },
  stageItemActive: {
    backgroundColor: '#E0F4FF',
    borderLeftColor: '#0078D4',
  },
  stageNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stageNumberText: {
    fontWeight: '600',
    color: '#333',
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0078D4',
  },
  stageInfo: {
    flex: 1,
  },
  stageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  stageMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  finalPhaseText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  adjustButton: {
    flexDirection: 'row',
    backgroundColor: '#0078D4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ReductionPlanScreen;
