import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
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
import PdfExportButton from '../components/PdfExportButton';

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

// Function to get tag frequency data
const getTagFrequencyData = (data: DayData[]) => {
  const tagCounts: { [key: string]: number } = {};
  
  data.forEach((day) => {
    if (day.tags) {
      day.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Sort by frequency and get top 6
  const sortedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  if (sortedTags.length === 0) {
    return null;
  }

  const colors = ['#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#06b6d4', '#10b981'];

  return {
    labels: sortedTags.map(([tag]) => tag),
    datasets: [
      {
        data: sortedTags.map(([, count]) => count),
      },
    ],
    colors: colors.slice(0, sortedTags.length),
  };
};

// Function to get strategy frequency data
const getStrategyFrequencyData = (data: DayData[]) => {
  const strategyCounts: { [key: string]: number } = {};
  
  data.forEach((day) => {
    if (day.strategies) {
      day.strategies.forEach((strategy) => {
        strategyCounts[strategy] = (strategyCounts[strategy] || 0) + 1;
      });
    }
  });

  // Sort by frequency and get top 6
  const sortedStrategies = Object.entries(strategyCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  if (sortedStrategies.length === 0) {
    return null;
  }

  const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f97316', '#ef4444', '#3b82f6'];

  return {
    labels: sortedStrategies.map(([strategy]) => strategy),
    datasets: [
      {
        data: sortedStrategies.map(([, count]) => count),
      },
    ],
    colors: colors.slice(0, sortedStrategies.length),
  };
};

const OverviewScreen: React.FC = () => {
  const { language } = useLanguage();
  const [viewType, setViewType] = useState<ViewType>('weekly');
  const [data, setData] = useState<DayData[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  // Create translations object that updates when language changes
  const translations = useMemo(() => ({
    overview: i18n.t('overview'),
    weekly: i18n.t('weekly'),
    monthly: i18n.t('monthly'),
    yearly: i18n.t('yearly'),
    loading: i18n.t('loading'),
    average: i18n.t('average'),
    per_day: i18n.t('per_day'),
    total: i18n.t('total'),
    cigarettes: i18n.t('cigarettes'),
    daily: i18n.t('daily'),
    wasted_money: i18n.t('wasted_money'),
    wasted_time: i18n.t('wasted_time'),
    dollars: i18n.t('dollars'),
    hours: i18n.t('hours'),
    days: i18n.t('days'),
    top_reasons: i18n.t('top_reasons'),
    no_reasons_tracked: i18n.t('no_reasons_tracked'),
    top_strategies: i18n.t('top_strategies'),
    no_strategies_tracked: i18n.t('no_strategies_tracked'),
  }), [language]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allData = await getAllData().catch(() => []);
        setData(allData);

        try {
          if (viewType === 'weekly') {
            const weekData = await getWeekData(allData).catch(() => []);
            setChartData(getChartData(weekData));
          } else if (viewType === 'monthly') {
            const monthData = await getMonthData(allData).catch(() => []);
            setChartData(getChartData(monthData));
          } else {
            // Yearly data - group by month
            const yearlyData = getYearlyData(allData);
            setChartData(yearlyData);
          }
        } catch (error) {
          // Ignore chart data loading errors
          console.error('Error loading chart data:', error);
        }
      } catch (error) {
        // Silently ignore data loading errors
        console.error('Error loading overview data:', error);
        setData([]);
      }
    };

    loadData();
  }, [viewType, language]);

  // Get tag frequency data for pie chart
  const tagFrequencyData = useMemo(() => getTagFrequencyData(data), [data]);

  // Get strategy frequency data for pie chart
  const strategyFrequencyData = useMemo(() => getStrategyFrequencyData(data), [data]);

  const displayData = viewType === 'weekly' ? 
    data.slice(Math.max(0, data.length - 7)) : 
    data;
  const average = getAverageCigarettes(displayData);
  
  // Calculate total cigarettes
  const totalCigarettes = displayData.reduce(
    (sum, day) => sum + day.morning + day.afternoon + day.evening,
    0
  );
  
  // Calculate wasted money: $1 per cigarette (1 pack = 20 cigs = $20)
  const wastedMoney = totalCigarettes * 1;
  
  // Calculate wasted time: 20 minutes per cigarette
  const wastedMinutes = totalCigarettes * 20;
  const wastedHours = wastedMinutes / 60;
  const wastedDays = Math.floor(wastedHours / 24);
  const wastedHoursRemainder = Math.floor(wastedHours % 24);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{translations.overview}</Text>
        </View>

        {/* PDF Export Button */}
        <PdfExportButton data={data} language={language} />

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
              {translations.weekly}
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
              {translations.monthly}
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
              {translations.yearly}
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
            <Text style={styles.loadingText}>{translations.loading}</Text>
          </View>
        )}

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <StatCard
            label={translations.average}
            value={Math.round(average)}
            unit={translations.per_day}
            color="#3b82f6"
          />

          <StatCard
            label={translations.total}
            value={totalCigarettes}
            unit={translations.cigarettes}
            color="#8b5cf6"
          />

          <StatCard
            label={translations.wasted_money}
            value={wastedMoney}
            unit={translations.dollars}
            color="#ef4444"
          />

          <StatCard
            label={translations.wasted_time}
            value={wastedDays}
            unit={translations.days}
            color="#f97316"
            subValue={wastedHoursRemainder}
            subUnit={translations.hours}
          />
        </View>

        {/* Top Reasons Pie Chart */}
        {tagFrequencyData ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.top_reasons}</Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={tagFrequencyData.labels.map((label, index) => ({
                  name: label,
                  count: tagFrequencyData.datasets[0].data[index],
                  color: tagFrequencyData.colors[index],
                  legendFontColor: '#333',
                  legendFontSize: 12,
                }))}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  color: () => '#000',
                  labelColor: () => '#000',
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.top_reasons}</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {translations.no_reasons_tracked}
              </Text>
            </View>
          </View>
        )}

        {/* Top Strategies Pie Chart */}
        {strategyFrequencyData ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.top_strategies}</Text>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={strategyFrequencyData.labels.map((label, index) => ({
                  name: label,
                  count: strategyFrequencyData.datasets[0].data[index],
                  color: strategyFrequencyData.colors[index],
                  legendFontColor: '#333',
                  legendFontSize: 12,
                }))}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  color: () => '#000',
                  labelColor: () => '#000',
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{translations.top_strategies}</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {translations.no_strategies_tracked}
              </Text>
            </View>
          </View>
        )}

        {/* Data Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{translations.daily}</Text>
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
  subValue?: number;
  subUnit?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, color, subValue, subUnit }) => (
  <View style={[styles.statCard, { borderTopColor: color }]}>
    <Text style={styles.statLabel}>{label}</Text>
    <View style={styles.statValueContainer}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
    </View>
    {subValue !== undefined && subUnit && (
      <View style={styles.statSubContainer}>
        <Text style={[styles.statSubValue, { color }]}>{subValue}</Text>
        <Text style={styles.statSubUnit}>{subUnit}</Text>
      </View>
    )}
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
    color: '#0078D4',
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
    backgroundColor: '#0078D4',
    borderColor: '#0078D4',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#0078D4',
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
  pieChartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
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
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#0891b2',
    marginBottom: 6,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
    gap: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  statUnit: {
    fontSize: 10,
    color: '#06b6d4',
  },
  statSubContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  statSubValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0891b2',
  },
  statSubUnit: {
    fontSize: 8,
    color: '#06b6d4',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0078D4',
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
