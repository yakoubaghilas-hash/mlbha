import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ReportModalProps {
  visible: boolean;
  htmlContent: string;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ visible, htmlContent, onClose }) => {
  // Extraire le texte du HTML en supprimant les balises
  const extractText = (html: string) => {
    // Remplacer les balises HTML par des retours à la ligne
    let text = html.replace(/<[^>]*>/g, '\n');
    // Décoder les entités HTML
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    // Supprimer les espaces blancs excessifs
    text = text.replace(/\n\s*\n/g, '\n');
    return text.trim();
  };

  const plainText = extractText(htmlContent);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Smoking Report</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <Text style={styles.reportText}>{plainText}</Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  reportText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    fontFamily: 'monospace',
  },
});

export default ReportModal;
