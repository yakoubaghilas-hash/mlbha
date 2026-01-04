import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import i18n from '../i18n';
import { useCigarette } from '../context/CigaretteContext';
import { useLanguage } from '../context/LanguageContext';
import { getAllData } from '../services/storage';
import {
  getWeekData,
  getMonthData,
  getChartData,
  getAverageCigarettes,
} from '../utils/statistics';
import { DayData } from '../services/storage';

const screenWidth = Dimensions.get('window').width;

type ViewType = 'weekly' | 'monthly' | 'yearly';

// Function to get yearly data grouped by month
const getYearlyData = (data: DayData[]) => {
  const monthlyTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  data.forEach((day) => {
    const date = new Date(day.date);
    const month = date.getMonth();
    const total = day.morning + day.afternoon + day.evening;
    monthlyTotals[month] += total;
  });

  return {
    labels: months,
    datasets: [
      {
        data: monthlyTotals,
      },
    ],
  };
};

const OverviewScreen: React.FC = () => {
  const { language } = useLanguage();
  const [viewType, setViewType] = useState<ViewType>('weekly');
  const [data, setData] = useState<DayData[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const allData = await getAllData();
      setData(allData);

      if (viewType === 'weekly') {
        const weekData = await getWeekData(allData);
        setChartData(getChartData(weekData));
      } else if (viewType === 'monthly') {
        const monthData = await getMonthData(allData);
        setChartData(getChartData(monthData));
      } else {
        // Yearly data - group by month
        const yearlyData = getYearlyData(allData);
        setChartData(yearlyData);
      }
    };

    loadData();
  }, [viewType, language]);

  const displayData = viewType === 'weekly' ? 
    data.slice(Math.max(0, data.length - 7)) : 
    data;
  const average = getAverageCigarettes(displayData);

  return (
    <SafeAreaView style={styles.container} key={language}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{i18n.t('overview')}</Text>
        </View>

        {/* View Type Selector */}
        <View style={styles.viewSelector}>
          <TouchableOpacity
            style={[
              styles.viewButton,
              viewType === 'weekly' && styles.viewButtonActive,
            ]}
            onPress={() => setViewType('weekly')}
          >
            <Text
              style={[
                styles.viewButtonText,
                viewType === 'weekly' && styles.viewButtonTextActive,
              ]}
            >
              {i18n.t('weekly')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.viewButton,
              viewType === 'monthly' && styles.viewButtonActive,
            ]}
            onPress={() => setViewType('monthly')}
          >
            <Text
              style={[
                styles.viewButtonText,
                viewType === 'monthly' && styles.viewButtonTextActive,
              ]}
            >
              {i18n.t('monthly')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.viewButton,
              viewType === 'yearly' && styles.viewButtonActive,
            ]}
            onPress={() => setViewType('yearly')}
          >
            <Text
              style={[
                styles.viewButtonText,
                viewType === 'yearly' && styles.viewButtonTextActive,
              ]}
            >
              {i18n.t('yearly')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        {chartData ? (
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={screenWidth - 40}
              height={300}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: () => '#3b82f6',
                labelColor: () => '#64748b',
                strokeWidth: 2,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#3b82f6',
                },
                decimalPlaces: 0,
                propsForLabels: {
                  fontSize: 6,
                },
              }}
              style={{
                borderRadius: 12,
                marginVertical: 8,
              }}
              showValuesOnTopOfBars={true}
            />
          </View>
        ) : (
          <View style={styles.chartPlaceholder}>
            <Text style={styles.loadingText}>{i18n.t('loading')}</Text>
          </View>
        )}

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            label={i18n.t('average')}
            value={Math.round(average)}
            unit={i18n.t('per_day')}
            color="#3b82f6"
          />

          <StatCard
            label={i18n.t('total')}
            value={displayData.reduce(
              (sum, day) => sum + day.morning + day.afternoon + day.evening,
              0
            )}
            unit={i18n.t('cigarettes')}
            color="#8b5cf6"
          />
        </View>

        {/* Data Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('daily')}</Text>
          <View style={styles.table}>
            {displayData.map((day) => (
              <View key={day.date}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableDate}>
                    {new Date(day.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <View style={styles.tablePeriods}>
                    <View style={styles.tablePeriod}>
                      <Text style={styles.periodLabel}>M</Text>
                      <Text style={styles.periodValue}>{day.morning}</Text>
                    </View>
                    <View style={styles.tablePeriod}>
                      <Text style={styles.periodLabel}>A</Text>
                      <Text style={styles.periodValue}>{day.afternoon}</Text>
                    </View>
                    <View style={styles.tablePeriod}>
                      <Text style={styles.periodLabel}>E</Text>
                      <Text style={styles.periodValue}>{day.evening}</Text>
                    </View>
                  </View>
                  <Text style={styles.tableTotal}>
                    {day.morning + day.afternoon + day.evening}
                  </Text>
                </View>
                {day.tags && day.tags.length > 0 && (
                  <View style={styles.dayReasonsRow}>
                    <View style={styles.dayReasonsContainer}>
                      {day.tags.map((reason, index) => (
                        <View key={index} style={styles.dayReason}>
                          <Text style={styles.dayReasonText}>{reason}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, color }) => (
  <View style={[styles.statCard, { borderTopColor: color }]}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statUnit}>{unit}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9fc',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  viewSelector: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cffafe',
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#0891b2',
    fontWeight: '600',
  },
  viewButtonTextActive: {
    color: '#fff',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  chartPlaceholder: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#0891b2',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopWidth: 4,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#0891b2',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0891b2',
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 12,
    color: '#06b6d4',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0891b2',
    marginBottom: 12,
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cffafe',
  },
  tableDate: {
    width: 50,
    fontSize: 13,
    fontWeight: '600',
    color: '#0891b2',
  },
  tablePeriods: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  tablePeriod: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f9fc',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  periodLabel: {
    fontSize: 10,
    color: '#0891b2',
    fontWeight: '600',
  },
  periodValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  tableTotal: {
    width: 40,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  dayReasonsRow: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cffafe',
  },
  dayReasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginLeft: 50,
  },
  dayReason: {
    backgroundColor: '#E0F4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayReasonText: {
    fontSize: 11,
    color: '#0078D4',
    fontWeight: '500',
  },
});

export default OverviewScreen;
