import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { generateReportData, generatePdfContent } from '../utils/pdfGenerator';
import { DayData } from '../services/storage';
import ReportViewer from './ReportViewer';

interface PdfExportButtonProps {
  data: DayData[];
  language: string;
}

const PdfExportButton: React.FC<PdfExportButtonProps> = ({ data, language }) => {
  const [reportVisible, setReportVisible] = useState(false);
  const [reportHtml, setReportHtml] = useState('');

  const handleExportPdf = async () => {
    try {
      // Générer les données de rapport
      const reportData = await generateReportData(data);
      // Générer le contenu HTML
      const htmlContent = generatePdfContent(reportData, language);

      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        // Sur web, créer un fichier HTML et le télécharger
        const fileName = `smoking-report-${new Date().toISOString().split('T')[0]}.html`;
        const blob = new Blob([htmlContent], { type: 'text/html;charset=UTF-8' });
        const url = URL.createObjectURL(blob);
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        Alert.alert('Success', 'Report downloaded successfully!');
      } else {
        // Sur mobile, afficher le rapport dans un viewer
        setReportHtml(htmlContent);
        setReportVisible(true);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'Could not generate report: ' + String(error));
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleExportPdf}>
        <MaterialCommunityIcons name="file-pdf-box" size={20} color="#fff" />
        <Text style={styles.buttonText}>Export PDF</Text>
      </TouchableOpacity>
      <ReportViewer 
        visible={reportVisible} 
        htmlContent={reportHtml}
        onClose={() => setReportVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D32F2F',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PdfExportButton;
