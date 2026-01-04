import { DayData } from '../services/storage';

export const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

export const getWeekData = async (
  allData: DayData[],
  endDate: Date = new Date()
): Promise<DayData[]> => {
  const weekData: DayData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = getDateString(date);
    const data = allData.find(d => d.date === dateStr) || {
      date: dateStr,
      morning: 0,
      afternoon: 0,
      evening: 0,
    };
    weekData.push(data);
  }
  return weekData;
};

export const getMonthData = async (
  allData: DayData[],
  date: Date = new Date()
): Promise<DayData[]> => {
  const monthData: DayData[] = [];
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateStr = getDateString(d);
    const data = allData.find(d => d.date === dateStr) || {
      date: dateStr,
      morning: 0,
      afternoon: 0,
      evening: 0,
    };
    monthData.push(data);
  }
  return monthData;
};

export const getTotalCigarettes = (data: DayData[]): number => {
  return data.reduce((sum, day) => sum + day.morning + day.afternoon + day.evening, 0);
};

export const getAverageCigarettes = (data: DayData[]): number => {
  if (data.length === 0) return 0;
  return getTotalCigarettes(data) / data.length;
};

export const getMaxCigarettes = (data: DayData[]): number => {
  if (data.length === 0) return 0;
  return Math.max(...data.map(d => d.morning + d.afternoon + d.evening));
};

export const getChartData = (data: DayData[], label: string = 'Days') => {
  return {
    labels: data.map((d, i) => {
      const date = new Date(d.date);
      return date.getDate().toString();
    }),
    datasets: [
      {
        data: data.map(d => d.morning + d.afternoon + d.evening),
      },
    ],
  };
};
