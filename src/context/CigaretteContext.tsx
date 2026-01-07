import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDayData, saveDayData, DayData, UserProfile, getProfile, saveProfile, getSubscribedChallenges, subscribeToChallenge, unsubscribeFromChallenge, updateChallengeStatus, SubscribedChallenge, getLastCigaretteTime, saveLastCigaretteTime } from '../services/storage';
import { safeAsync } from '../utils/safeInitialization';

interface CigaretteContextType {
  // Current day data
  currentDate: string;
  todayData: DayData;
  lastCigaretteTime: number | null; // Timestamp of last cigarette
  totalToday: number; // Total cigarettes today (morning + afternoon + evening)
  
  // Actions
  addCigarette: (period: 'morning' | 'afternoon' | 'evening') => { diffMins: number; diffHours: number; diffDays: number } | null;
  removeCigarette: (period: 'morning' | 'afternoon' | 'evening') => void;
  setTodayData: (data: DayData) => void;
  
  // Profile
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  
  // Challenges
  subscribedChallenges: SubscribedChallenge[];
  subscribeToChallenge: (challengeId: string) => Promise<void>;
  unsubscribeFromChallenge: (challengeId: string) => Promise<void>;
  updateChallengeStatus: (challengeId: string, status: 'active' | 'won' | 'lost') => Promise<void>;
  
  // Statistics
  getProfileLevel: () => 'Bad' | 'Medium' | 'Good' | 'Ready for Perfection';
}

const CigaretteContext = createContext<CigaretteContextType | undefined>(undefined);

// Default safe values for initial state
const DEFAULT_TODAY_DATA: DayData = {
  date: new Date().toISOString().split('T')[0],
  morning: 0,
  afternoon: 0,
  evening: 0,
};

const DEFAULT_PROFILE: UserProfile = {
  tags: [],
  strategies: [],
  workoutDates: [],
};

export const CigaretteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [todayData, setTodayDataState] = useState<DayData>(DEFAULT_TODAY_DATA);
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [subscribedChallenges, setSubscribedChallenges] = useState<SubscribedChallenge[]>([]);
  const [lastCigaretteTime, setLastCigaretteTime] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Load today's data on mount - with robust error handling
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Load each piece of data independently with fallbacks
        const data = await safeAsync(
          () => getDayData(currentDate),
          DEFAULT_TODAY_DATA
        );
        if (isMounted) setTodayDataState(data);

        const profileData = await safeAsync(
          () => getProfile(),
          DEFAULT_PROFILE
        );
        if (isMounted) setProfileState(profileData);

        const challenges = await safeAsync(
          () => getSubscribedChallenges(),
          []
        );
        if (isMounted) setSubscribedChallenges(challenges);

        const lastTime = await safeAsync(
          () => getLastCigaretteTime(),
          null
        );
        if (isMounted) setLastCigaretteTime(lastTime);

        if (isMounted) setInitialized(true);
      } catch (error) {
        // If everything fails, still initialize with defaults
        if (isMounted) {
          setInitialized(true);
        }
      }
    };

    // Start loading but don't block rendering
    loadData();

    return () => {
      isMounted = false;
    };
  }, [currentDate]);

  // Save whenever data changes
  useEffect(() => {
    // Include current profile tags and strategies in the day data
    const dataToSave = {
      ...todayData,
      tags: profile.tags,
      strategies: profile.strategies,
    };
    saveDayData(dataToSave);
  }, [todayData, profile.tags, profile.strategies]);

  const addCigarette = (period: 'morning' | 'afternoon' | 'evening'): { diffMins: number; diffHours: number; diffDays: number } | null => {
    const now = Date.now();
    
    // Get time difference from last cigarette
    let timeInfo = null;
    if (lastCigaretteTime !== null) {
      const diffMs = now - lastCigaretteTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      timeInfo = { diffMins, diffHours, diffDays };
    }
    
    setTodayDataState(prev => ({
      ...prev,
      [period]: prev[period] + 1,
    }));
    setLastCigaretteTime(now);
    saveLastCigaretteTime(now);
    
    return timeInfo;
  };

  const removeCigarette = (period: 'morning' | 'afternoon' | 'evening') => {
    setTodayDataState(prev => ({
      ...prev,
      [period]: Math.max(0, prev[period] - 1),
    }));
  };

  const setTodayData = (data: DayData) => {
    setTodayDataState(data);
  };

  const updateProfile = async (newProfile: UserProfile) => {
    setProfileState(newProfile);
    await saveProfile(newProfile);
  };

  const handleSubscribeToChallenge = async (challengeId: string) => {
    await subscribeToChallenge(challengeId);
    const challenges = await getSubscribedChallenges();
    setSubscribedChallenges(challenges);
  };

  const handleUnsubscribeFromChallenge = async (challengeId: string) => {
    await unsubscribeFromChallenge(challengeId);
    const challenges = await getSubscribedChallenges();
    setSubscribedChallenges(challenges);
  };

  const handleUpdateChallengeStatus = async (challengeId: string, status: 'active' | 'won' | 'lost') => {
    await updateChallengeStatus(challengeId, status);
    const challenges = await getSubscribedChallenges();
    setSubscribedChallenges(challenges);
  };

  const getProfileLevel = (): 'Bad' | 'Medium' | 'Good' | 'Ready for Perfection' => {
    const total = todayData.morning + todayData.afternoon + todayData.evening;
    if (total === 0) return 'Ready for Perfection';
    if (total <= 3) return 'Good';
    if (total <= 7) return 'Medium';
    return 'Bad';
  };

  const value: CigaretteContextType = {
    currentDate,
    todayData,
    lastCigaretteTime,
    totalToday: todayData.morning + todayData.afternoon + todayData.evening,
    addCigarette,
    removeCigarette,
    setTodayData,
    profile,
    updateProfile,
    subscribedChallenges,
    subscribeToChallenge: handleSubscribeToChallenge,
    unsubscribeFromChallenge: handleUnsubscribeFromChallenge,
    updateChallengeStatus: handleUpdateChallengeStatus,
    getProfileLevel,
  };

  return (
    <CigaretteContext.Provider value={value}>
      {children}
    </CigaretteContext.Provider>
  );
};

export const useCigarette = (): CigaretteContextType => {
  const context = useContext(CigaretteContext);
  if (context === undefined) {
    throw new Error('useCigarette must be used within CigaretteProvider');
  }
  return context;
};
