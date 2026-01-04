import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDayData, saveDayData, DayData, UserProfile, getProfile, saveProfile } from '../services/storage';

interface CigaretteContextType {
  // Current day data
  currentDate: string;
  todayData: DayData;
  
  // Actions
  addCigarette: (period: 'morning' | 'afternoon' | 'evening') => void;
  removeCigarette: (period: 'morning' | 'afternoon' | 'evening') => void;
  setTodayData: (data: DayData) => void;
  
  // Profile
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  
  // Statistics
  getProfileLevel: () => 'Bad' | 'Medium' | 'Good' | 'Ready for Perfection';
}

const CigaretteContext = createContext<CigaretteContextType | undefined>(undefined);

export const CigaretteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [todayData, setTodayDataState] = useState<DayData>({
    date: currentDate,
    morning: 0,
    afternoon: 0,
    evening: 0,
  });
  const [profile, setProfileState] = useState<UserProfile>({
    tags: [],
    workoutDates: [],
  });

  // Load today's data on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await getDayData(currentDate);
      setTodayDataState(data);
      const profileData = await getProfile();
      setProfileState(profileData);
    };
    loadData();
  }, [currentDate]);

  // Save whenever data changes
  useEffect(() => {
    // Include current profile tags in the day data
    const dataToSave = {
      ...todayData,
      tags: profile.tags,
    };
    saveDayData(dataToSave);
  }, [todayData, profile.tags]);

  const addCigarette = (period: 'morning' | 'afternoon' | 'evening') => {
    setTodayDataState(prev => ({
      ...prev,
      [period]: prev[period] + 1,
    }));
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
    addCigarette,
    removeCigarette,
    setTodayData,
    profile,
    updateProfile,
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
