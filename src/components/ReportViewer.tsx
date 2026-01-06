import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ReportViewerProps {
  visible: boolean;
  htmlContent: string;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ visible, htmlContent, onClose }) => {
  if (Platform.OS === 'web') {
    return null;
  }

  const stripHtml = (html: string): string => {
    let text = html.replace(/<style[^>]*>.*?<\/style>/gs, '');
    text = text.replace(/<script[^>]*>.*?<\/script>/gs, '');
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&quot;/g, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n');
    text = text.replace(/<\/div>/gi, '');
    text = text.replace(/<\/h[1-6]>/gi, '\n');
    text = text.replace(/<\/tr>/gi, '\n');
    text = text.replace(/<\/td>/gi, ' | ');
    text = text.replace(/<\/th>/gi, ' | ');
    text = text.replace(/<[^>]*>/g, '');
    text = text.replace(/\n\n\n+/g, '\n\n');
    return text.trim();
  };

  // Extract title and description
  const getTitleAndDate = (html: string) => {
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const dateMatch = html.match(/<p[^>]*>(.*?Generated.*?)<\/p>/);
    return {
      title: titleMatch ? stripHtml(titleMatch[1]) : 'Smoking Report',
      date: dateMatch ? stripHtml(dateMatch[1]) : '',
    };
  };

  // Extract stat boxes
  const getStatBoxes = (html: string) => {
    const stats = [];
    const statMatches = html.matchAll(/<div[^>]*stat-box[^>]*>(.*?)<\/div>/gs);
    
    for (const match of statMatches) {
      const statContent = match[1];
      const labelMatch = statContent.match(/<p[^>]*stat-label[^>]*>(.*?)<\/p>/);
      const valueMatch = statContent.match(/<p[^>]*stat-value[^>]*>(.*?)<\/p>/);
      const subMatch = statContent.match(/<p[^>]*>(.*?)<\/p>(?!.*<p[^>]*stat)/);
      
      if (labelMatch && valueMatch) {
        stats.push({
          label: stripHtml(labelMatch[1]),
          value: stripHtml(valueMatch[1]),
          sub: subMatch ? stripHtml(subMatch[1]) : '',
        });
      }
    }
    return stats;
  };

  // Extract table data
  const getTableData = (sectionHtml: string) => {
    const rows = [];
    const trMatches = sectionHtml.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs);
    
    for (const match of trMatches) {
      const cells = [];
      const tdMatches = match[1].matchAll(/<t[dh][^>]*>(.*?)<\/t[dh]>/gs);
      for (const tdMatch of tdMatches) {
        cells.push(stripHtml(tdMatch[1]));
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }
    return rows;
  };

  // Extract main sections
  const getSections = (html: string) => {
    const sections = [];
    const h2Matches = html.matchAll(/<h2[^>]*>(.*?)<\/h2>(.*?)(?=<h2|<div class="charts|$)/gs);
    
    for (const match of h2Matches) {
      const title = stripHtml(match[1]);
      const content = match[2];
      const tableRows = getTableData(content);
      const stats = getStatBoxes(content);
      
      sections.push({
        title,
        tableRows,
        stats,
        hasData: stats.length > 0 || tableRows.length > 0,
      });
    }
    return sections;
  };

  const { title, date } = getTitleAndDate(htmlContent);
  const sections = getSections(htmlContent);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>📊 Smoking Report</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
          {/* Report Header */}
          <View style={styles.reportHeader}>
            <Text style={styles.reportTitle}>{title}</Text>
            {date && <Text style={styles.reportDate}>{date}</Text>}
          </View>

          {/* Sections */}
          {sections.map((section, sectionIdx) => (
            <View key={sectionIdx} style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="chart-line" size={20} color="#0078D4" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>

              {/* Stats Grid */}
              {section.stats.length > 0 && (
                <View style={styles.statsContainer}>
                  {section.stats.map((stat, idx) => (
                    <View key={idx} style={styles.miniStatBox}>
                      <Text style={styles.miniStatLabel}>{stat.label}</Text>
                      <Text style={styles.miniStatValue}>{stat.value}</Text>
                      {stat.sub && <Text style={styles.miniStatSub}>{stat.sub}</Text>}
                    </View>
                  ))}
                </View>
              )}

              {/* Table */}
              {section.tableRows.length > 0 && (
                <View style={styles.tableContainer}>
                  {section.tableRows.map((row, rowIdx) => (
                    <View
                      key={rowIdx}
                      style={[
                        styles.tableRow,
                        rowIdx === 0 && styles.tableHeaderRow,
                      ]}
                    >
                      {row.map((cell, cellIdx) => (
                        <Text
                          key={cellIdx}
                          style={[
                            styles.tableCell,
                            rowIdx === 0 && styles.tableCellHeader,
                          ]}
                          numberOfLines={1}
                        >
                          {cell}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          <View style={styles.footer} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0078D4',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  reportHeader: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#0078D4',
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0078D4',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#999',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#E8F4FF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0078D4',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  miniStatBox: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0078D4',
  },
  miniStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0078D4',
    marginBottom: 2,
  },
  miniStatSub: {
    fontSize: 9,
    color: '#999',
  },
  tableContainer: {
    marginTop: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  tableHeaderRow: {
    backgroundColor: '#0078D4',
    paddingVertical: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
    color: '#333',
    paddingHorizontal: 6,
  },
  tableCellHeader: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
  },
  footer: {
    height: 20,
  },
});

export default ReportViewer;
