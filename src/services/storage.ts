import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DayData {
  date: string; // YYYY-MM-DD
  morning: number;
  afternoon: number;
  evening: number;
  tags?: string[];
}

export interface UserProfile {
  tags: string[];
  workoutType?: 'running' | 'swimming';
  workoutDates: string[];
}

const CIGARETTES_KEY = '@lbha_cigarettes';
const PROFILE_KEY = '@lbha_profile';

// Cigarette tracking
export const saveDayData = async (dayData: DayData): Promise<void> => {
  try {
    const all = await AsyncStorage.getItem(CIGARETTES_KEY);
    const data: DayData[] = all ? JSON.parse(all) : [];
    const index = data.findIndex(d => d.date === dayData.date);
    if (index >= 0) {
      data[index] = dayData;
    } else {
      data.push(dayData);
    }
    await AsyncStorage.setItem(CIGARETTES_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving day data:', error);
  }
};

export const getDayData = async (date: string): Promise<DayData> => {
  try {
    const all = await AsyncStorage.getItem(CIGARETTES_KEY);
    const data: DayData[] = all ? JSON.parse(all) : [];
    const dayData = data.find(d => d.date === date);
    return dayData || { date, morning: 0, afternoon: 0, evening: 0 };
  } catch (error) {
    console.error('Error getting day data:', error);
    return { date, morning: 0, afternoon: 0, evening: 0 };
  }
};

export const getAllData = async (): Promise<DayData[]> => {
  try {
    const all = await AsyncStorage.getItem(CIGARETTES_KEY);
    return all ? JSON.parse(all) : [];
  } catch (error) {
    console.error('Error getting all data:', error);
    return [];
  }
};

export const deleteDay = async (date: string): Promise<void> => {
  try {
    const all = await AsyncStorage.getItem(CIGARETTES_KEY);
    const data: DayData[] = all ? JSON.parse(all) : [];
    const filtered = data.filter(d => d.date !== date);
    await AsyncStorage.setItem(CIGARETTES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting day:', error);
  }
};

// User profile
export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : { tags: [], workoutDates: [] };
  } catch (error) {
    console.error('Error getting profile:', error);
    return { tags: [], workoutDates: [] };
  }
};
