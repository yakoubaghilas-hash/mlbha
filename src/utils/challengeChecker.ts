import { DayData, getAllData } from '../services/storage';

export interface ChallengeCondition {
  id: string;
  check: (todayData: DayData, allData: DayData[]) => boolean;
}

// Helper function to get cigarette count from today
const getTodayCigaretteCount = (todayData: DayData): number => {
  return todayData.morning + todayData.afternoon + todayData.evening;
};

// Helper function to check if user has not smoked since a specific time
const getLastCigaretteTime = (todayData: DayData): Date | null => {
  if (getTodayCigaretteCount(todayData) === 0) {
    return null; // No cigarettes today
  }
  return new Date(); // Last cigarette was today (simple check)
};

// Helper function to get yesterday's data
const getYesterdayData = (allData: DayData[]): DayData | null => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  return allData.find(d => d.date === yesterdayStr) || null;
};

// Helper function to check X consecutive days without smoking
const getConsecutiveDaysWithoutSmoking = (todayData: DayData, allData: DayData[]): number => {
  if (getTodayCigaretteCount(todayData) > 0) {
    return 0; // Smoked today, so no consecutive days
  }
  
  let count = 1; // Today
  const today = new Date();
  
  for (let i = 1; i <= 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateStr = checkDate.toISOString().split('T')[0];
    const dayData = allData.find(d => d.date === checkDateStr);
    
    if (!dayData || getTodayCigaretteCount(dayData) === 0) {
      count++;
    } else {
      break;
    }
  }
  
  return count;
};

export const challengeConditions: { [key: string]: (todayData: DayData, allData: DayData[]) => boolean } = {
  // EASY CHALLENGES
  easy_reduction: (todayData: DayData) => {
    // Reduce by 1 cigarette compared to your average
    const count = getTodayCigaretteCount(todayData);
    return count >= 0; // Just log, consider won if user tracks
  },

  easy_no_smoke: (todayData: DayData) => {
    // Don't smoke for 2 hours after waking up
    // Simple check: if user tracked time (morning period empty is ideal)
    return todayData.morning === 0;
  },

  easy_hydration: (todayData: DayData) => {
    // Drink water instead of smoking (tracked via tags)
    return true; // User takes action, consider won
  },

  // MEDIUM CHALLENGES
  medium_reduction: (todayData: DayData) => {
    // Reduce daily consumption by 50%
    const count = getTodayCigaretteCount(todayData);
    return count <= 3; // Reduction target
  },

  medium_pause: (todayData: DayData) => {
    // No smoking during work/study hours (9am-5pm)
    // Proxy: afternoon period low
    return todayData.afternoon <= 2;
  },

  medium_substitution: (todayData: DayData) => {
    // Replace smoking with exercise or relaxation
    return true; // Requires manual action
  },

  // HARD CHALLENGES
  hard_day: (todayData: DayData) => {
    // Don't smoke for 1 full day (24 hours)
    return getTodayCigaretteCount(todayData) === 0;
  },

  hard_multi_days: (todayData: DayData, allData: DayData[]) => {
    // Don't smoke for 7 consecutive days
    const consecutiveDays = getConsecutiveDaysWithoutSmoking(todayData, allData);
    return consecutiveDays >= 7;
  },

  hard_radical: (todayData: DayData, allData: DayData[]) => {
    // Quit smoking entirely (30 consecutive days without)
    const consecutiveDays = getConsecutiveDaysWithoutSmoking(todayData, allData);
    return consecutiveDays >= 30;
  },
};

export const checkChallengeStatus = (challengeId: string, todayData: DayData, allData: DayData[]): 'won' | 'lost' | 'active' => {
  const checker = challengeConditions[challengeId];
  if (!checker) return 'active';
  
  const isWon = checker(todayData, allData);
  return isWon ? 'won' : 'lost';
};
