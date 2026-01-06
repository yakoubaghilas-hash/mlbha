import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCigarette } from '../context/CigaretteContext';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../i18n';

interface TimeDisplay {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const TimeSinceLastCigarette: React.FC = () => {
  const { lastCigaretteTime } = useCigarette();
  const { language } = useLanguage();
  const [timeDisplay, setTimeDisplay] = useState<TimeDisplay>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTime = () => {
      if (lastCigaretteTime === null) {
        setTimeDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = Date.now();
      const diffMs = now - lastCigaretteTime;

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeDisplay({ days, hours, minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [lastCigaretteTime]);

  if (lastCigaretteTime === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{i18n.t('time_without_cigarette') || 'Time without cigarette'}</Text>
        <View style={styles.card}>
          <Text style={styles.noDataText}>{i18n.t('start_now') || 'Start your journey now!'}</Text>
        </View>
      </View>
    );
  }

  const formatNumber = (num: number) => String(num).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{i18n.t('time_without_cigarette') || 'Time without cigarette'}</Text>
      <View style={styles.card}>
        <View style={styles.timeGrid}>
          {timeDisplay.days > 0 && (
            <View style={styles.timeUnit}>
              <Text style={styles.timeValue}>{timeDisplay.days}</Text>
              <Text style={styles.timeLabel}>{timeDisplay.days === 1 ? 'day' : 'days'}</Text>
            </View>
          )}
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{formatNumber(timeDisplay.hours)}</Text>
            <Text style={styles.timeLabel}>hours</Text>
          </View>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{formatNumber(timeDisplay.minutes)}</Text>
            <Text style={styles.timeLabel}>mins</Text>
          </View>
          <View style={styles.timeUnit}>
            <Text style={styles.timeValue}>{formatNumber(timeDisplay.seconds)}</Text>
            <Text style={styles.timeLabel}>secs</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0078D4',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#E0F4FF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0078D4',
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8,
  },
  timeUnit: {
    alignItems: 'center',
    flex: 1,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0078D4',
  },
  timeLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#0078D4',
    fontWeight: '500',
  },
});

export default TimeSinceLastCigarette;
