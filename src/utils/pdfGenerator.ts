import { DayData } from '../services/storage';
import {
  getWeekData,
  getMonthData,
  getAverageCigarettes,
} from './statistics';

interface ReportData {
  weeklyData: DayData[];
  monthlyData: DayData[];
  yearlyData: DayData[];
  weeklyAverage: number;
  monthlyAverage: number;
  yearlyAverage: number;
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
  tagFrequency: { [key: string]: number };
  strategyFrequency: { [key: string]: number };
}

// Get yearly data grouped by month
const getYearlyData = (data: DayData[]) => {
  return data;
};

// Get tag frequency data
const getTagFrequencyData = (data: DayData[]) => {
  const tagCounts: { [key: string]: number } = {};
  
  data.forEach((day) => {
    if (day.tags) {
      day.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  return tagCounts;
};

// Get strategy frequency data
const getStrategyFrequencyData = (data: DayData[]) => {
  const strategyCounts: { [key: string]: number } = {};
  
  data.forEach((day) => {
    if (day.strategies) {
      day.strategies.forEach((strategy) => {
        strategyCounts[strategy] = (strategyCounts[strategy] || 0) + 1;
      });
    }
  });

  return strategyCounts;
};

export const generateReportData = async (allData: DayData[]): Promise<ReportData> => {
  const weeklyData = await getWeekData(allData);
  const monthlyData = await getMonthData(allData);
  const yearlyData = getYearlyData(allData);

  const weeklyAverage = getAverageCigarettes(weeklyData);
  const monthlyAverage = getAverageCigarettes(monthlyData);
  const yearlyAverage = getAverageCigarettes(yearlyData);

  const weeklyTotal = weeklyData.reduce(
    (sum, day) => sum + day.morning + day.afternoon + day.evening,
    0
  );
  const monthlyTotal = monthlyData.reduce(
    (sum, day) => sum + day.morning + day.afternoon + day.evening,
    0
  );
  const yearlyTotal = yearlyData.reduce(
    (sum, day) => sum + day.morning + day.afternoon + day.evening,
    0
  );

  const tagFrequency = getTagFrequencyData(yearlyData);
  const strategyFrequency = getStrategyFrequencyData(yearlyData);

  return {
    weeklyData,
    monthlyData,
    yearlyData,
    weeklyAverage,
    monthlyAverage,
    yearlyAverage,
    weeklyTotal,
    monthlyTotal,
    yearlyTotal,
    tagFrequency,
    strategyFrequency,
  };
};

export const generatePdfContent = (reportData: ReportData, language: string): string => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US');
  };

  const labels = {
    en: {
      title: 'Smoking Report',
      generatedOn: 'Generated on',
      weekly: 'Weekly Report',
      monthly: 'Monthly Report',
      yearly: 'Yearly Report',
      total: 'Total',
      average: 'Daily Average',
      cigarettes: 'cigarettes',
      date: 'Date',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      wastedMoney: 'Wasted Money',
      wastedTime: 'Wasted Time',
      dollars: 'dollars',
      hours: 'hours',
      days: 'days',
      topReasons: 'Top Reasons',
      topStrategies: 'Top Strategies Used',
      statistics: 'Statistics',
      noData: 'No data available',
    },
    es: {
      title: 'Informe de Tabaquismo',
      generatedOn: 'Generado el',
      weekly: 'Informe Semanal',
      monthly: 'Informe Mensual',
      yearly: 'Informe Anual',
      total: 'Total',
      average: 'Promedio Diario',
      cigarettes: 'cigarrillos',
      date: 'Fecha',
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Noche',
      wastedMoney: 'Dinero Desperdiciado',
      wastedTime: 'Tiempo Desperdiciado',
      dollars: 'dólares',
      hours: 'horas',
      days: 'días',
      topReasons: 'Razones Principales',
      topStrategies: 'Estrategias Principales Utilizadas',
      statistics: 'Estadísticas',
      noData: 'No hay datos disponibles',
    },
    fr: {
      title: 'Rapport sur le Tabagisme',
      generatedOn: 'Généré le',
      weekly: 'Rapport Hebdomadaire',
      monthly: 'Rapport Mensuel',
      yearly: 'Rapport Annuel',
      total: 'Total',
      average: 'Moyenne Quotidienne',
      cigarettes: 'cigarettes',
      date: 'Date',
      morning: 'Matin',
      afternoon: 'Après-midi',
      evening: 'Soir',
      wastedMoney: 'Argent Gaspillé',
      wastedTime: 'Temps Gaspillé',
      dollars: 'dollars',
      hours: 'heures',
      days: 'jours',
      topReasons: 'Principales Raisons',
      topStrategies: 'Principales Stratégies Utilisées',
      statistics: 'Statistiques',
      noData: 'Aucune donnée disponible',
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;
  const today = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US');

  const generateTableRows = (data: DayData[]) => {
    return data
      .map(
        (day) => `
      <tr>
        <td>${formatDate(day.date)}</td>
        <td style="text-align: center">${day.morning}</td>
        <td style="text-align: center">${day.afternoon}</td>
        <td style="text-align: center">${day.evening}</td>
        <td style="text-align: center"><strong>${day.morning + day.afternoon + day.evening}</strong></td>
      </tr>
    `
      )
      .join('');
  };

  const generateChartData = (data: { [key: string]: number }) => {
    const sortedEntries = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);

    if (sortedEntries.length === 0) {
      return null;
    }

    const colors = ['#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#06b6d4', '#10b981', '#ec4899', '#f59e0b'];

    return {
      labels: sortedEntries.map(([label]) => label),
      data: sortedEntries.map(([, count]) => count),
      colors: colors.slice(0, sortedEntries.length),
    };
  };

  const generatePieChart = (chartData: any, title: string) => {
    if (!chartData || chartData.labels.length === 0) {
      return `<p style="color: #666; font-size: 14px;">${t.noData}</p>`;
    }

    const total = chartData.data.reduce((a: number, b: number) => a + b, 0);
    const rows = chartData.labels
      .map(
        (label: string, idx: number) => `
      <tr>
        <td style="padding: 10px;">
          <span class="color-box" style="background-color: ${chartData.colors[idx]};"></span>
          <strong>${label}</strong>
        </td>
        <td style="text-align: right; padding: 10px;">
          <span style="font-weight: 600;">${chartData.data[idx]}</span>
          <span style="color: #999; font-size: 12px;"> (${((chartData.data[idx] / total) * 100).toFixed(1)}%)</span>
        </td>
      </tr>
    `
      )
      .join('');

    return `
    <div class="chart-item">
      <h4>${title}</h4>
      <table class="chart-table">
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
  };

  const tagChartData = generateChartData(reportData.tagFrequency);
  const strategyChartData = generateChartData(reportData.strategyFrequency);

  const generateSection = (title: string, data: DayData[], total: number, average: number) => {
    const wastedMoney = total * 1;
    const wastedMinutes = total * 20;
    const wastedHours = wastedMinutes / 60;
    const wastedDays = Math.floor(wastedHours / 24);
    const wastedHoursRemainder = Math.floor(wastedHours % 24);

    return `
    <h2>${title}</h2>
    <table>
      <thead>
        <tr>
          <th>${t.date}</th>
          <th style="text-align: center;">${t.morning}</th>
          <th style="text-align: center;">${t.afternoon}</th>
          <th style="text-align: center;">${t.evening}</th>
          <th style="text-align: center;">${t.total}</th>
        </tr>
      </thead>
      <tbody>
        ${generateTableRows(data)}
      </tbody>
    </table>
    <div class="stats-container">
      <div class="stat-box">
        <p class="stat-label">${t.total}</p>
        <p class="stat-value">${total}</p>
        <p style="color: #999; font-size: 12px; margin: 3px 0 0 0;">${t.cigarettes}</p>
      </div>
      <div class="stat-box">
        <p class="stat-label">${t.average}</p>
        <p class="stat-value">${average.toFixed(1)}</p>
        <p style="color: #999; font-size: 12px; margin: 3px 0 0 0;">${t.cigarettes}</p>
      </div>
      <div class="stat-box">
        <p class="stat-label">${t.wastedMoney}</p>
        <p class="stat-value">$${wastedMoney}</p>
        <p style="color: #999; font-size: 12px; margin: 3px 0 0 0;">${t.dollars}</p>
      </div>
    </div>
  `;
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Smoking Report</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #ffffff;
            padding: 20px;
            line-height: 1.6;
          }
          @media (min-width: 768px) {
            body {
              padding: 40px;
              max-width: 900px;
              margin: 0 auto;
            }
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #0078D4;
            padding-bottom: 20px;
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #0078D4;
            font-size: 32px;
            font-weight: 700;
          }
          .header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
          }
          h2 {
            color: #0078D4;
            font-size: 22px;
            margin-top: 40px;
            margin-bottom: 20px;
            border-bottom: 2px solid #0078D4;
            padding-bottom: 10px;
            font-weight: 600;
          }
          h3 {
            color: #0078D4;
            font-size: 16px;
            margin-top: 20px;
            margin-bottom: 10px;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            background-color: #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          thead {
            background-color: #0078D4;
            color: white;
          }
          th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #ddd;
          }
          td {
            border: 1px solid #e0e0e0;
            padding: 10px 12px;
          }
          tbody tr:nth-child(even) {
            background-color: #f5f5f5;
          }
          tbody tr:hover {
            background-color: #e8f4ff;
          }
          .stats-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
          }
          .stat-box {
            background: linear-gradient(135deg, #e8f4ff 0%, #ffffff 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #0078D4;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          }
          .stat-label {
            color: #666;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0;
          }
          .stat-value {
            color: #0078D4;
            font-size: 28px;
            font-weight: 700;
            margin: 8px 0 0 0;
          }
          .section {
            page-break-inside: avoid;
            margin-bottom: 40px;
          }
          .charts-section {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
          }
          .chart-item {
            margin-bottom: 30px;
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
          }
          .chart-item h4 {
            color: #0078D4;
            margin-bottom: 15px;
            font-size: 14px;
            font-weight: 600;
          }
          .chart-table {
            width: 100%;
            border-collapse: collapse;
          }
          .chart-table td {
            padding: 8px;
            border-bottom: 1px solid #eee;
          }
          .chart-table tr:last-child td {
            border-bottom: none;
          }
          .color-box {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 2px;
            margin-right: 8px;
            vertical-align: middle;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .page-break {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 ${t.title}</h1>
          <p>${t.generatedOn}: ${today}</p>
        </div>

        <div class="section">
          ${generateSection(t.weekly, reportData.weeklyData, reportData.weeklyTotal, reportData.weeklyAverage)}
        </div>

        <div class="page-break"></div>

        <div class="section">
          ${generateSection(t.monthly, reportData.monthlyData, reportData.monthlyTotal, reportData.monthlyAverage)}
        </div>

        <div class="page-break"></div>

        <div class="section">
          ${generateSection(t.yearly, reportData.yearlyData, reportData.yearlyTotal, reportData.yearlyAverage)}
        </div>

        <div class="page-break"></div>

        <div class="charts-section">
          <h2>${t.statistics}</h2>
          ${generatePieChart(tagChartData, t.topReasons)}
          ${generatePieChart(strategyChartData, t.topStrategies)}
        </div>
      </body>
    </html>
  `;

  return html;
};
